// app/api/view/route.js
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { videoId } = await req.json();

  if (!videoId) {
    return Response.json({ ok: false, error: "Missing videoId" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const cookieName = `ll_view_${videoId}`;

  // Cookie mutations must happen in route handlers or server actions, not during page render.
  if (cookieStore.get(cookieName)) {
    return Response.json({ ok: true, counted: false });
  }

  cookieStore.set(cookieName, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60
  });

  const db = supabaseAdmin();

  const { data, error: readError } = await db
    .from("videos")
    .select("views")
    .eq("id", videoId)
    .single();

  if (readError) {
    return Response.json({ ok: false, error: readError.message }, { status: 500 });
  }

  const { error: updateError } = await db
    .from("videos")
    .update({ views: Number(data?.views || 0) + 1 })
    .eq("id", videoId);

  if (updateError) {
    return Response.json({ ok: false, error: updateError.message }, { status: 500 });
  }

  return Response.json({ ok: true, counted: true });
}