// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { api } from "../../api";
// import { parse } from "cookie";

// export async function GET() {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value;
//   const refreshToken = cookieStore.get("refreshToken")?.value;

//   if (accessToken) {
//     return NextResponse.json({});
//   }

//   if (refreshToken) {
//     const apiRes = await api.get("auth/session", {
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     });
//     const setCookie = apiRes.headers["set-cookie"];
//     if (setCookie) {
//       const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
//       let accessToken = "";
//       let refreshToken = "";

//       for (const cookieStr of cookieArray) {
//         const parsed = parse(cookieStr);
//         if (parsed.accessToken) accessToken = parsed.accessToken;
//         if (parsed.refreshToken) refreshToken = parsed.refreshToken;
//       }

//       if (accessToken) cookieStore.set("accessToken", accessToken);
//       if (refreshToken) cookieStore.set("refreshToken", refreshToken);

//       return NextResponse.json({});
//     }
//   }
//   return NextResponse.json({});
// }

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";
import axios from "axios";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  if (refreshToken) {
    try {
      const apiRes = await api.get("auth/session", {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      const setCookie = apiRes.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        let newAccessToken = "";
        let newRefreshToken = "";

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          if (parsed.accessToken) newAccessToken = parsed.accessToken;
          if (parsed.refreshToken) newRefreshToken = parsed.refreshToken;
        }

        if (newAccessToken) cookieStore.set("accessToken", newAccessToken);
        if (newRefreshToken) cookieStore.set("refreshToken", newRefreshToken);

        // Успішно оновили токени
        return NextResponse.json({ success: true }, { status: 200 });
      }
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        const errorMessage =
          error.response.data?.message || "Failed to refresh session.";

        console.error(
          `Error refreshing session (Status: ${statusCode}):`,
          errorMessage,
          error.response.data
        );

        if (statusCode === 401) {
          cookieStore.delete("accessToken");
          cookieStore.delete("refreshToken");
          return NextResponse.json(
            {
              success: false,
              message: "Session expired or invalid. Please log in again.",
            },
            { status: 401 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            message: errorMessage,
            details: error.response.data,
          },
          { status: statusCode }
        );
      }

      console.error("Unknown error in session route:", error);
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  console.log("No access or refresh token found. Returning 401.");
  return NextResponse.json(
    { success: false, message: "Unauthorized - No session tokens." },
    { status: 401 }
  );
}
