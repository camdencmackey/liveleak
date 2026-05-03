import { extractYouTubeId } from "@/lib/youtube";

export function getVideoUrl(video) {
  if (video?.video_url) return video.video_url;
  if (video?.youtube_url && !extractYouTubeId(video.youtube_url)) return video.youtube_url;
  return "";
}

export function hasFirstPartyVideo(video) {
  return Boolean(getVideoUrl(video));
}

export function videoDownloadName(video) {
  const safeTitle = String(video?.title || "liveleak-video")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${safeTitle || "liveleak-video"}.mp4`;
}
