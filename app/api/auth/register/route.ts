// import { NextRequest, NextResponse } from "next/server";
// import { api } from "../../api";
// import { cookies } from "next/headers";
// import { parse } from "cookie";

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const apiRes = await api.post("auth/register", body);

//   const cookieStore = await cookies();
//   const setCookie = apiRes.headers["set-cookie"];

//   if (setCookie) {
//     const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
//     for (const cookieStr of cookieArray) {
//       const parsed = parse(cookieStr);

//       const options = {
//         expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
//         path: parsed.Path,
//         maxAge: Number(parsed["Max-Age"]),
//       };
//       if (parsed.accessToken)
//         cookieStore.set("accessToken", parsed.accessToken, options);
//       if (parsed.refreshToken)
//         cookieStore.set("refreshToken", parsed.refreshToken, options);
//     }
//     return NextResponse.json(apiRes.data);
//   }

//   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// }

import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { AxiosError } from "axios";

export async function POST(req: NextRequest) {
  const allowedOrigin = req.headers.get("Origin") || "*";

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  try {
    const body = await req.json();
    const apiRes = await api.post("auth/register", body);

    const response = NextResponse.json(apiRes.data, {
      status: apiRes.status,
      headers: corsHeaders,
    });

    const setCookieHeaders = apiRes.headers["set-cookie"];
    if (setCookieHeaders) {
      (Array.isArray(setCookieHeaders)
        ? setCookieHeaders
        : [setCookieHeaders]
      ).forEach((cookieString) => {
        response.headers.append("Set-Cookie", cookieString);
      });
    }

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Registration API route error:",
        error.response?.data || error.message
      );
      return NextResponse.json(
        { error: error.response?.data?.message || "Registration failed" },
        {
          status: error.response?.status || 500,
          headers: corsHeaders,
        }
      );
    }

    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const allowedOrigin = request.headers.get("Origin") || "*";

  const response = new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  });
  return response;
}
