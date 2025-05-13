import { NextRequest, NextResponse } from "next/server";
import parser from "accept-language-parser";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const acceptLanguage = req.headers.get("Accept-Language");
  const languages = parser.parse(acceptLanguage || "");
  const preferredLanguage = languages[0]?.code || "en";

  return NextResponse.next({
    headers: {
      "x-locale": preferredLanguage,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
