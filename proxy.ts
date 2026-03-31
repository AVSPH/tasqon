import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const proxy = (request: NextRequest) => {
  // Create an unmodified response.
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  return supabaseResponse;
};

/**
 * Run the Supabase auth check on absolutely every single page of my website... EXCEPT for these specific files.
 * Imagine a user goes to your /dashboard. To load that one page, the browser actually makes dozens of background requests:
 * 1 request for the HTML page.
 * 5 requests for different JavaScript chunks (_next/static/…).
 * 1 request for your logo (logo.png).
 * 1 request for the tab icon (favicon.ico).
 * Without the matcher, your middleware would ping Supabase to check the user's session 8 separate times
 * just to load one page. That will drastically slow down your website and burn through
 * your Supabase database quota for absolutely no reason.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
