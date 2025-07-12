// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import { checkServerSession } from "@/lib/api/serverApi";
// import { parse } from "cookie";

// const privateRoutes = ["/profile"];
// const publicRoutes = ["/sign-in", "/sign-up"];

// export const middleware = async (request: NextRequest) => {
//   const { pathname } = request.nextUrl;

//   const cookieData = await cookies();
//   const accessToken = cookieData.get("accessToken")?.value;
//   const refreshToken = cookieData.get("refreshToken")?.value;

//   const isPrivateRoute = privateRoutes.some((path) =>
//     path.startsWith(pathname)
//   );

//   if (isPrivateRoute) {
//     if (!accessToken) {
//       if (refreshToken) {
//         try {
//           const response = await checkServerSession();
//           const setCookies = response.headers["set-cookie"];

//           if (setCookies) {
//             const cookiesArray = Array.isArray(setCookies)
//               ? setCookies
//               : [setCookies];

//             for (const newCookieStr of cookiesArray) {
//               const parsedCookie = parse(newCookieStr);
//               const options = {
//                 path: parsedCookie.Path,
//                 maxAge: Number(parsedCookie["Max-Age"]),
//                 expires: parsedCookie.Expires
//                   ? new Date(parsedCookie.Expires)
//                   : undefined,
//                 httpOnly: true,
//                 secure: true,
//               };
//               if (parsedCookie.accessToken) {
//                 cookieData.set(
//                   "accessToken",
//                   parsedCookie.accessToken,
//                   options
//                 );
//               }
//               if (parsedCookie.refreshToken) {
//                 cookieData.set(
//                   "refreshToken",
//                   parsedCookie.refreshToken,
//                   options
//                 );
//               }
//             }
//           }
//           return NextResponse.next({
//             headers: {
//               Cookie: cookieData.toString(),
//             },
//           });
//         } catch {
//           return NextResponse.redirect(
//             new URL("/sign-in", request.nextUrl.origin)
//           );
//         }
//       }
//       return NextResponse.redirect(new URL("/sign-in", request.nextUrl.origin));
//     }
//   } else if (publicRoutes) {
//     if (accessToken) {
//       return NextResponse.redirect(new URL("/", request.nextUrl.origin));
//     } else {
//       if (refreshToken) {
//         try {
//           const response = await checkServerSession();
//           const setCookies = response.headers["set-cookie"];

//           if (setCookies) {
//             const cookiesArray = Array.isArray(setCookies)
//               ? setCookies
//               : [setCookies];

//             for (const newCookieStr of cookiesArray) {
//               const parsedCookie = parse(newCookieStr);
//               const options = {
//                 path: parsedCookie.Path,
//                 maxAge: Number(parsedCookie["Max-Age"]),
//                 expires: parsedCookie.Expires
//                   ? new Date(parsedCookie.Expires)
//                   : undefined,
//                 httpOnly: true,
//                 secure: true,
//               };
//               if (parsedCookie.accessToken) {
//                 cookieData.set(
//                   "accessToken",
//                   parsedCookie.accessToken,
//                   options
//                 );
//               }
//               if (parsedCookie.refreshToken) {
//                 cookieData.set(
//                   "refreshToken",
//                   parsedCookie.refreshToken,
//                   options
//                 );
//               }
//             }
//           }
//           return NextResponse.redirect(new URL("/", request.nextUrl.origin), {
//             headers: {
//               Cookie: cookieData.toString(),
//             },
//           });
//         } catch {
//           return NextResponse.next();
//         }
//       }
//     }
//   }
//   return NextResponse.next();
// };

// export const config = {
//   matcher: ["/profile", "/sign-in", "/sign-up"],
// };

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { checkServerSession } from "@/lib/api/serverApi";
import { parse } from "cookie";

const privateRoutes = ["/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPrivate && !accessToken) {
    if (refreshToken) {
      try {
        const res = await checkServerSession();
        const setCookieHeader = res.headers["set-cookie"];

        if (setCookieHeader) {
          const response = NextResponse.next();

          const cookieArray = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            if (parsed.accessToken) {
              response.cookies.set("accessToken", parsed.accessToken, {
                httpOnly: true,
                secure: true,
                path: "/",
              });
            }
            if (parsed.refreshToken) {
              response.cookies.set("refreshToken", parsed.refreshToken, {
                httpOnly: true,
                secure: true,
                path: "/",
              });
            }
          }

          return response;
        }

        return NextResponse.next();
      } catch {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublic && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/profile", "/sign-in", "/sign-up"],
};
