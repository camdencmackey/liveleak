// app/page.js
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { likeVideo, shareVideo, createForumThread } from "./actions";

const SPOTIFY_URL = "https://open.spotify.com/artist/46pXqeFHTjgAGPovI7u3bI";
const APPLE_MUSIC_URL = "https://music.apple.com/us/artist/live-leak/1888285076";
const FEATURED_TRACK_URL = "https://open.spotify.com/track/49fyD99tJX6n8Wh0UOmT07";

function cleanQuery(value) {
  return String(value || "").trim().slice(0, 80);
}

function formatDate(value) {
  if (!value) return "pending";
  const d = new Date(value);
  return `${d.toLocaleString("en-US", { month: "short" })}-${d.getDate()}-${d.getFullYear()}`;
}

async function getHomeData(query) {
  const db = supabaseAdmin();

  let videosQuery = db
    .from("videos")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (query) {
    videosQuery = videosQuery.ilike("title", `%${query}%`);
  }

  const [
    { data: videos },
    { data: threads },
    { data: posts }
  ] = await Promise.all([
    videosQuery,
    db.from("forum_threads").select("*").order("created_at", { ascending: false }).limit(5),
    db.from("forum_posts").select("*").order("created_at", { ascending: false }).limit(5)
  ]);

  return {
    videos: videos || [],
    threads: threads || [],
    posts: posts || []
  };
}

function Header({ query }) {
  return (
    <div id="header">
      <div id="top-strip">
        <div className="container">LiveLeak.com - Redefining the Media</div>
      </div>

      <div className="container">
        <Link id="logo" href="/">Live<span>Leak</span></Link>

        <div id="header-right">
          <p>
            <Link href="/forum">Create Account</Link>&nbsp;|&nbsp;
            <Link href="/admin">Log in</Link>&nbsp;|&nbsp;
            <a href={SPOTIFY_URL} target="_blank">spotify</a>&nbsp;
            <a href={APPLE_MUSIC_URL} target="_blank">apple music</a>
          </p>

          <ul id="nav">
            <li className="current"><Link href="/">Home</Link></li>
            <li><a href="#videos">Videos</a></li>
            <li><Link href="/forum">Forum</Link></li>
          </ul>

          <form id="search" action="/" method="get">
            <input name="q" placeholder="Search videos..." defaultValue={query} />
            <input type="submit" value="Search" />
          </form>
        </div>

        <div className="clear" />
      </div>
    </div>
  );
}

function Featured() {
  return (
    <div className="feature_panel">
      <div className="leak_stamp">EXCLUSIVE / MUSIC</div>

      <div className="feature_inner">
        <img src="/images/terroristsingle.jfif" />

        <div>
          <h2>
            <a href={FEATURED_TRACK_URL} target="_blank">
              FELL IN LOVE WITH A TERRORIST - LIVELEAK
            </a>
          </h2>

          <p>New single from LIVELEAK.</p>

          <div className="meta">
            By LIVELEAK | Views: 18882 | Votes: 13<br />
            Category: Music | Added: Apr-28-2026<br />
            Tags: music, liveleak
          </div>

          <div className="links">
            <a href={FEATURED_TRACK_URL} target="_blank">Listen</a>
            <a href={SPOTIFY_URL} target="_blank">Spotify</a>
            <a href={APPLE_MUSIC_URL} target="_blank">Apple Music</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoList({ videos }) {
  return (
    <ul className="item_list">
      {videos.map((video) => (
        <li key={video.id}>
          <iframe
            src={`https://www.youtube.com/embed/${video.youtube_id}`}
            title={video.title}
          />

          <div className="info">
            <h3>
              <Link href={`/video/${video.id}`}>{video.title}</Link>
            </h3>

            <div className="meta">
              Views: {video.views || 0} | Votes: {video.likes || 0} | Comments: {video.comment_count || 0}<br />
              Added: {formatDate(video.created_at)}<br />
              Tags: video
            </div>

            <div className="links">
              <form action={likeVideo.bind(null, video.id)}>
                <button type="submit">Like</button>
              </form>

              <form action={shareVideo.bind(null, video.id)}>
                <button type="submit">Share</button>
              </form>

              <Link href={`/video/${video.id}`}>Comments</Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Sidebar({ videos, threads }) {
  return (
    <div id="rightcol">
      <div className="section_title">Latest Items</div>

      <ul className="scroll_list">
        {videos.slice(0, 5).map(v => (
          <li key={v.id}>
            <Link href={`/video/${v.id}`}>{v.title}</Link>
          </li>
        ))}
      </ul>

      <div className="section_title">Forum Activity</div>

      <ul className="scroll_list">
        {threads.length === 0 && (
          <li>No threads yet.</li>
        )}

        {threads.map(t => (
          <li key={t.id}>
            <Link href={`/forum/${t.id}`}>{t.title}</Link>
          </li>
        ))}
      </ul>

      <div className="section_title">Band Links</div>

      <ul className="scroll_list">
        <li><a href={SPOTIFY_URL}>Spotify</a></li>
        <li><a href={APPLE_MUSIC_URL}>Apple Music</a></li>
      </ul>

      <div className="section_title">Post Thread</div>

      <div className="form_box">
        <form action={createForumThread}>
          <input name="title" placeholder="Thread title" required />
          <input name="display_name" placeholder="Name" required />
          <textarea name="body" placeholder="Post reply..." required />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}

export const metadata = {
  icons: {
    icon: "/favicon.ico"
  }
};

export default async function HomePage({ searchParams }) {
  const query = cleanQuery((await searchParams)?.q);
  const { videos, threads } = await getHomeData(query);

  return (
    <>
      <Header query={query} />

      <div id="content">
        <div className="container">
          <Featured />

          <div id="main">
            <VideoList videos={videos} />
            <Sidebar videos={videos} threads={threads} />
          </div>
        </div>
      </div>
    </>
  );
}