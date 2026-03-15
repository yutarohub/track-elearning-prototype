import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** ログイン済みを示す Cookie（AuthContext の login/logout と同期） */
const AUTH_COOKIE = "track_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ログインページは常に許可
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // ログイン済み Cookie がなければ /login へ
  if (!request.cookies.get(AUTH_COOKIE)?.value) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 静的ファイル・API・_next を除外し、アプリのルートのみ対象
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
