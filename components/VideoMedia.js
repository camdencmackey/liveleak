import Link from "next/link";

export function hasFirstPartyVideo(video) {
  return Boolean(video?.video_url);
}

export function VideoThumb({ video, linked = true }) {
  const media = hasFirstPartyVideo(video) ? (
    <video
      className="thumb_video"
      src={video.video_url}
      preload="metadata"
      muted
      playsInline
      aria-label={video.title}
    />
  ) : (
    <div className="thumb_blank thumb_missing">
      <span>FILE MISSING</span>
    </div>
  );

  if (!linked) return media;

  return (
    <Link href={`/video/${video.id}`} aria-label={`Watch ${video.title}`}>
      {media}
    </Link>
  );
}

export function SideVideoThumb({ video }) {
  return hasFirstPartyVideo(video) ? (
    <video
      className="side_thumb"
      src={video.video_url}
      preload="metadata"
      muted
      playsInline
      aria-label={video.title}
    />
  ) : (
    <div className="side_thumb side_missing">missing file</div>
  );
}

export function WatchPlayer({ video }) {
  if (hasFirstPartyVideo(video)) {
    return (
      <video
        className="watch_embed watch_player"
        src={video.video_url}
        controls
        preload="metadata"
        playsInline
      />
    );
  }

  return (
    <div className="watch_embed file_notice">
      <strong>First-party video file not attached.</strong>
      {video.youtube_url && (
        <a href={video.youtube_url} target="_blank" rel="noreferrer">
          View archived external source
        </a>
      )}
    </div>
  );
}
