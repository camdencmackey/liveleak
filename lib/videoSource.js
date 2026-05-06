import { extractYouTubeId } from "@/lib/youtube";

const knownYouTubeIds = [
  {
    test: /2026|nenGfRcNXaw|live-leak-live-2026/i,
    id: "nenGfRcNXaw"
  },
  {
    test: /0O8IeVFW5P0|live-leak-live|live leak live/i,
    id: "0O8IeVFW5P0"
  }
];

export function getYouTubeId(video) {
  if (video?.youtube_id) return video.youtube_id;

  const storedId = extractYouTubeId(video?.youtube_url);
  if (storedId) return storedId;

  const source = `${video?.title || ""} ${video?.video_url || ""} ${video?.youtube_url || ""}`;
  const knownVideo = knownYouTubeIds.find((entry) => entry.test.test(source));
  return knownVideo?.id || "";
}

export function getYouTubeEmbedUrl(video) {
  const id = getYouTubeId(video);
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

export function getVideoUrl(video) {
  if (video?.video_url) return video.video_url;
  if (video?.youtube_url && !extractYouTubeId(video.youtube_url)) return video.youtube_url;
  return "";
}

export function hasFirstPartyVideo(video) {
  return Boolean(getVideoUrl(video));
}

export function getVideoPoster(video) {
  const source = `${video?.title || ""} ${video?.video_url || ""} ${video?.youtube_url || ""}`.toLowerCase();

  if (source.includes("2026")) {
    return "/images/live-leak-live-2026-poster.jpg";
  }

  if (source.includes("live-leak-live") || source.includes("live leak live")) {
    return "/images/live-leak-live-poster.jpg";
  }

  return "/images/live-leak-live-2026-poster.jpg";
}

export function videoDownloadName(video) {
  const safeTitle = String(video?.title || "liveleak-video")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${safeTitle || "liveleak-video"}.mp4`;
}
