// app/actions.js
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { extractYouTubeId } from "@/lib/youtube";

/* ---------- helpers ---------- */

const ADMIN_COOKIE = "liveleak_admin";

function clean(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizeTag(value, fallback) {
  return clean(value || fallback, 10).toUpperCase();
}

function optionalUrl(value) {
  const url = clean(value, 500);

  if (!url) return "";

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" || url.startsWith("/") ? url : "";
  } catch {
    return url.startsWith("/") ? url : "";
  }
}

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const expected = getAdminSessionSecret();

  if (!expected || cookieStore.get(ADMIN_COOKIE)?.value !== expected) {
    throw new Error("Not authorized");
  }
}

async function bumpVideoCounter(videoId, field) {
  const db = supabaseAdmin();

  const { data, error: readError } = await db
    .from("videos")
    .select(field)
    .eq("id", videoId)
    .single();

  if (readError) {
    throw new Error(readError.message);
  }

  const { error: updateError } = await db
    .from("videos")
    .update({ [field]: Number(data?.[field] || 0) + 1 })
    .eq("id", videoId);

  if (updateError) {
    throw new Error(updateError.message);
  }
}

/* ---------- admin auth ---------- */

export async function loginAdmin(formData) {
  const password = clean(formData.get("password"), 200);
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = getAdminSessionSecret();

  if (!adminPassword || !sessionSecret || password !== adminPassword) {
    redirect("/admin?error=invalid");
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE, sessionSecret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  revalidatePath("/admin");
  redirect("/admin");
}

/* ---------- videos ---------- */

export async function createVideo(formData) {
  await requireAdmin();

  const title = clean(formData.get("title"), 120);
  const videoUrl = optionalUrl(formData.get("video_url"));
  const youtubeUrl = clean(formData.get("youtube_url"), 500);
  const youtubeId = extractYouTubeId(youtubeUrl);
  const ratingTag = normalizeTag(formData.get("rating_tag"), "MA");
  const miniTag = normalizeTag(formData.get("mini_tag"), "HD");

  if (!title || (!videoUrl && !youtubeId)) {
    throw new Error("Title plus a video file URL or valid YouTube URL are required.");
  }

  const db = supabaseAdmin();

  const { error } = await db.from("videos").insert({
    title,
    video_url: videoUrl || null,
    youtube_url: youtubeUrl,
    youtube_id: youtubeId || "",
    rating_tag: ratingTag,
    mini_tag: miniTag || null,
    category: "Videos",
    author: "liveleak",
    published: true
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateVideo(formData) {
  await requireAdmin();

  const id = clean(formData.get("id"), 80);
  const title = clean(formData.get("title"), 120);
  const videoUrl = optionalUrl(formData.get("video_url"));
  const youtubeUrl = clean(formData.get("youtube_url"), 500);
  const youtubeId = extractYouTubeId(youtubeUrl);
  const ratingTag = normalizeTag(formData.get("rating_tag"), "MA");
  const miniTag = normalizeTag(formData.get("mini_tag"), "HD");
  const published = formData.get("published") === "on";

  if (!id || !title) {
    throw new Error("Video ID and title are required.");
  }

  if (!videoUrl && !youtubeId) {
    throw new Error("Video file URL or valid YouTube URL is required.");
  }

  const db = supabaseAdmin();

  const { error } = await db
    .from("videos")
    .update({
      title,
      video_url: videoUrl || null,
      youtube_url: youtubeUrl,
      youtube_id: youtubeId || "",
      rating_tag: ratingTag,
      mini_tag: miniTag || null,
      published
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/video/${id}`);
  redirect("/admin");
}

export async function deleteVideo(formData) {
  await requireAdmin();

  const id = clean(formData.get("id"), 80);

  if (!id) {
    throw new Error("Video ID is required.");
  }

  const db = supabaseAdmin();

  const { error } = await db.from("videos").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

/* ---------- engagement ---------- */

export async function likeVideo(videoId) {
  const cookieStore = await cookies();
  const cookieName = `ll_like_${videoId}`;

  if (cookieStore.get(cookieName)) {
    return;
  }

  cookieStore.set(cookieName, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24
  });

  await bumpVideoCounter(videoId, "likes");

  revalidatePath("/");
  revalidatePath(`/video/${videoId}`);
}

export async function shareVideo(videoId) {
  const cookieStore = await cookies();
  const cookieName = `ll_share_${videoId}`;

  if (cookieStore.get(cookieName)) {
    return;
  }

  cookieStore.set(cookieName, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24
  });

  await bumpVideoCounter(videoId, "shares");

  revalidatePath("/");
  revalidatePath(`/video/${videoId}`);
}

/* ---------- video comments ---------- */

export async function addComment(videoId, formData) {
  const displayName = clean(formData.get("display_name"), 40);
  const body = clean(formData.get("body"), 600);
  const website = clean(formData.get("website"), 200);

  // Honeypot field for basic bot filtering.
  if (website) {
    return;
  }

  if (!displayName || !body) {
    throw new Error("Name and comment are required.");
  }

  const db = supabaseAdmin();

  const { error } = await db.from("comments").insert({
    video_id: videoId,
    display_name: displayName,
    body
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath(`/video/${videoId}`);
}

export async function deleteComment(formData) {
  await requireAdmin();

  const id = clean(formData.get("id"), 80);
  const videoId = clean(formData.get("video_id"), 80);

  if (!id) {
    throw new Error("Comment ID is required.");
  }

  const db = supabaseAdmin();

  const { error } = await db.from("comments").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/");

  if (videoId) {
    revalidatePath(`/video/${videoId}`);
  }

  redirect("/admin");
}

/* ---------- forum ---------- */

export async function createForumThread(formData) {
  const title = clean(formData.get("title"), 120);
  const displayName = clean(formData.get("display_name"), 40);
  const body = clean(formData.get("body"), 1200);
  const website = clean(formData.get("website"), 200);

  // Honeypot field for basic bot filtering.
  if (website) {
    return;
  }

  if (!title || !displayName || !body) {
    throw new Error("Title, name, and post body are required.");
  }

  const db = supabaseAdmin();

  const { data, error } = await db
    .from("forum_threads")
    .insert({
      title,
      display_name: displayName,
      body
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/forum");
  redirect(`/forum/${data.id}`);
}

export async function addForumReply(threadId, formData) {
  const displayName = clean(formData.get("display_name"), 40);
  const body = clean(formData.get("body"), 1200);
  const website = clean(formData.get("website"), 200);

  // Honeypot field for basic bot filtering.
  if (website) {
    return;
  }

  if (!displayName || !body) {
    throw new Error("Name and reply are required.");
  }

  const db = supabaseAdmin();

  const { error } = await db.from("forum_posts").insert({
    thread_id: threadId,
    display_name: displayName,
    body
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/forum");
  revalidatePath(`/forum/${threadId}`);
}

export async function deleteForumThread(formData) {
  await requireAdmin();

  const id = clean(formData.get("id"), 80);

  if (!id) {
    throw new Error("Thread ID is required.");
  }

  const db = supabaseAdmin();

  const { error } = await db.from("forum_threads").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/forum");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteForumPost(formData) {
  await requireAdmin();

  const id = clean(formData.get("id"), 80);
  const threadId = clean(formData.get("thread_id"), 80);

  if (!id) {
    throw new Error("Post ID is required.");
  }

  const db = supabaseAdmin();

  const { error } = await db.from("forum_posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");

  if (threadId) {
    revalidatePath(`/forum/${threadId}`);
  }

  redirect("/admin");
}
