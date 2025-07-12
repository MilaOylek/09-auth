import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieData = await cookies();
  try {
    const { data } = await api("/auth/me", {
      headers: { Cookie: cookieData.toString() },
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 401 });
  }
}
