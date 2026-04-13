import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const accessToken = body?.accessToken ?? null;
  const refreshToken = body?.refreshToken ?? null;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ ok: true });
  }

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const { error } = await supabase
    .from("profiles")
    .update({
      google_access_token: accessToken,
      google_refresh_token: refreshToken,
      google_token_expires_at: expiresAt,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
