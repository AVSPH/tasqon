import { NextResponse } from "next/server";
// You can remove the 'cookies' import if it's no longer used elsewhere in this file
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server is missing Supabase credentials" },
      { status: 500 },
    );
  }

  const { email, projectId } = await request.json();
  if (!email || !projectId) {
    return NextResponse.json(
      { error: "Email and projectId are required" },
      { status: 400 },
    );
  }

  // FIXED: Await the client and pass 0 arguments
  const supabase = await createServerClient();
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const origin = request.headers.get("origin") ?? undefined;
  const redirectTo = origin ? `${origin}/invites` : undefined;

  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    email,
    {
      data: {
        project_id: projectId,
        invited_by: user.id,
        role: "member",
      },
      ...(redirectTo ? { redirectTo } : {}),
    },
  );

  const inviteAlreadyRegistered =
    !!inviteError && /already been registered/i.test(inviteError.message);

  if (inviteError && !inviteAlreadyRegistered) {
    return NextResponse.json({ error: inviteError.message }, { status: 400 });
  }

  const { error: insertError } = await admin.from("invites").upsert(
    {
      email,
      project_id: projectId,
      invited_by: user.id,
      role: "member",
      status: "sent",
    },
    { onConflict: "project_id,email" },
  );

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}