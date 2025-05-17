import { NextRequest, NextResponse } from "next/server";
import parser from "accept-language-parser";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const acceptLanguage = req.headers.get("Accept-Language");
  const languages = parser.parse(acceptLanguage || "");
  const preferredLanguage = languages[0]?.code || "en";
  const href = req.nextUrl.href;

  if (
    req.nextUrl.pathname === "/.well-known/appspecific/com.chrome.devtools.json"
  ) {
    return new NextResponse(null, {
      status: 404,
      statusText: "not found",
    });
  }

  return NextResponse.next({
    headers: {
      "x-locale": preferredLanguage,
      "x-href": href,
      "x-pathname": req.nextUrl.pathname,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
