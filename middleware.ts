// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { parse } from "cookie";
// import { checkServerSession } from "./lib/api/serverApi";

// const privateRoutes = ["/profile", "/notes"];
// const publicRoutes = ["/sign-in", "/sign-up"];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value;
//   const refreshToken = cookieStore.get("refreshToken")?.value;

//   const isPublicRoute = publicRoutes.some((route) =>
//     pathname.startsWith(route)
//   );
//   const isPrivateRoute = privateRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   if (!accessToken) {
//     if (refreshToken) {
//       const data = await checkServerSession();
//       const setCookie = data.headers["set-cookie"];

//       if (setCookie) {
//         const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
//         for (const cookieStr of cookieArray) {
//           const parsed = parse(cookieStr);
//           const options = {
//             expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
//             path: parsed.Path,
//             maxAge: Number(parsed["Max-Age"]),
//           };
//           if (parsed.accessToken)
//             cookieStore.set("accessToken", parsed.accessToken, options);
//           if (parsed.refreshToken)
//             cookieStore.set("refreshToken", parsed.refreshToken, options);
//         }
//         if (isPublicRoute) {
//           return NextResponse.redirect(new URL("/", request.url), {
//             headers: {
//               Cookie: cookieStore.toString(),
//             },
//           });
//         }
//         if (isPrivateRoute) {
//           return NextResponse.next({
//             headers: {
//               Cookie: cookieStore.toString(),
//             },
//           });
//         }
//       }
//     }
//     if (isPublicRoute) {
//       return NextResponse.next();
//     }

//     if (isPrivateRoute) {
//       return NextResponse.redirect(new URL("/sign-in", request.url));
//     }
//   }

//   if (isPublicRoute) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }
//   if (isPrivateRoute) {
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
// };
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Правильно використовуємо await для отримання cookieStore
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value;
  // Змінюємо refreshToken на const, оскільки він не переприсвоюється
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedPage = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Для налагодження
  console.log({
    middleware: pathname,
    isAuthPage: isAuthPage,
    isProtectedPage: isProtectedPage,
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
  });

  // Ініціалізуємо відповідь. Зазвичай це просто "продовжуємо"
  const response = NextResponse.next();

  // Сценарій 1: Немає accessToken
  if (!accessToken) {
    // Спробуємо оновити токени за допомогою refreshToken
    if (refreshToken) {
      try {
        const sessionResponse = await checkServerSession(); // Отримуємо відповідь з бекенду

        // Якщо бекенд успішно оновив токени, він має повернути Set-Cookie заголовки.
        // Переносимо ці заголовки до нашої відповіді middleware.
        sessionResponse.headers.forEach((value: string, key: string) => {
          if (key.toLowerCase() === "set-cookie") {
            response.headers.append("Set-Cookie", value);
          }
        });

        // Оновлюємо accessToken після успішного оновлення сесії
        accessToken = response.cookies.get("accessToken")?.value;

        // Після успішного оновлення сесії:
        if (isAuthPage) {
          // Якщо користувач оновив сесію і тепер залогінений, але знаходиться на сторінці логіну/реєстрації
          return NextResponse.redirect(new URL("/", request.url), response); // Перенаправляємо на головну
        }
        // Якщо на захищеній сторінці, просто дозволяємо далі (куки вже оновлені)
        return response; // Продовжуємо, з оновленими куками
      } catch (error) {
        // Якщо оновлення сесії не вдалося (наприклад, refreshToken недійсний)
        console.error("Failed to refresh session or token expired:", error);
        // Очищаємо недійсні токени в браузері
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        accessToken = undefined; // Забезпечуємо, що подальша логіка бачить відсутність токена

        // Після невдалого оновлення:
        if (isProtectedPage) {
          // Якщо на захищеній сторінці, перенаправляємо на сторінку входу
          return NextResponse.redirect(
            new URL("/sign-in", request.url),
            response
          );
        }
        // Якщо на сторінці автентифікації, дозволяємо залишитися (щоб спробувати увійти/зареєструватися)
        return response;
      }
    }

    // Якщо немає accessToken і немає refreshToken (або він не спрацював)
    if (isProtectedPage) {
      // Якщо на захищеній сторінці, перенаправляємо на вхід
      return NextResponse.redirect(new URL("/sign-in", request.url), response);
    }
    // Якщо на сторінці автентифікації, дозволяємо далі (для логіну/реєстрації)
    return response;
  }

  // Сценарій 2: Є accessToken (користувач залогінений)
  if (accessToken) {
    if (isAuthPage) {
      // Якщо користувач залогінений і намагається отримати доступ до сторінок входу/реєстрації
      return NextResponse.redirect(new URL("/", request.url), response); // Перенаправляємо на головну
    }
    // Якщо на будь-якій іншій сторінці (включаючи захищені), дозволяємо доступ
    return response;
  }

  // Дефолтний випадок: дозволити запит
  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
