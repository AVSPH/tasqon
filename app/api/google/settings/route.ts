import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function normalizeMinutes(value: unknown) {
  if (value === null) return null;
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.floor(value);
  }
  return undefined;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("google_reminder_popup_minutes, google_reminder_email_minutes")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    popupMinutes: data?.google_reminder_popup_minutes ?? null,
    emailMinutes: data?.google_reminder_email_minutes ?? null,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const popupMinutes = normalizeMinutes(body?.popupMinutes);
  const emailMinutes = normalizeMinutes(body?.emailMinutes);

  const updates: Record<string, number | null> = {};
  if (popupMinutes !== undefined) {
    updates.google_reminder_popup_minutes = popupMinutes;
  }
  if (emailMinutes !== undefined) {
    updates.google_reminder_email_minutes = emailMinutes;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
