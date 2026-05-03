import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getVideoUrl, videoDownloadName } from "@/lib/videoSource";

export async function GET(request, { params }) {
  const { id } = await params;
  const db = supabaseAdmin();

  const { data: video } = await db
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  const videoUrl = getVideoUrl(video);

  if (!video || !videoUrl) {
    notFound();
  }

  const range = request.headers.get("range");
  const response = await fetch(videoUrl, {
    headers: range ? { range } : undefined
  });

  if (!response.ok && response.status !== 206) {
    return new Response("Video unavailable.", { status: 502 });
  }

  const headers = new Headers();
  const contentType = response.headers.get("content-type") || "video/mp4";
  const contentLength = response.headers.get("content-length");
  const contentRange = response.headers.get("content-range");
  const acceptRanges = response.headers.get("accept-ranges");

  headers.set("content-type", contentType);
  headers.set("content-disposition", `attachment; filename="${videoDownloadName(video)}"`);
  headers.set("cache-control", "private, max-age=0, must-revalidate");

  if (contentLength) headers.set("content-length", contentLength);
  if (contentRange) headers.set("content-range", contentRange);
  if (acceptRanges) headers.set("accept-ranges", acceptRanges);

  return new Response(response.body, {
    status: response.status,
    headers
  });
}
