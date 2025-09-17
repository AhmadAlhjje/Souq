// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // حماية صفحات الـ admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.exp && payload.exp < Date.now() / 1000) {
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }
      if (payload.role !== "merchant") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  // إعادة التوجيه من الصفحة الرئيسية إذا كان المستخدم admin
  if (pathname === "/" && token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (
        payload.exp &&
        payload.exp >= Date.now() / 1000 &&
        payload.role === "merchant"
      ) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    } catch {
      const response = NextResponse.next();
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
