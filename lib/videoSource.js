import { extractYouTubeId } from "@/lib/youtube";

export function getVideoUrl(video) {
  if (video?.video_url) return video.video_url;
  if (video?.youtube_url && !extractYouTubeId(video.youtube_url)) return video.youtube_url;
  return "";
}

export function hasFirstPartyVideo(video) {
  return Boolean(getVideoUrl(video));
}

export function getVideoPoster(video) {
  const source = `${video?.title || ""} ${getVideoUrl(video)}`.toLowerCase();

  if (source.includes("2026")) {
    return "/images/live-leak-live-2026-poster.jpg";
  }

  if (source.includes("live-leak-live") || source.includes("live leak live")) {
    return "/images/live-leak-live-poster.jpg";
  }

  return hasFirstPartyVideo(video) ? "/images/live-leak-live-2026-poster.jpg" : "";
}

export function videoDownloadName(video) {
  const safeTitle = String(video?.title || "liveleak-video")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${safeTitle || "liveleak-video"}.mp4`;
}
