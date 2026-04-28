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
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
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
    { data: videos, error: videoError },
    { data: threads, error: threadError },
    { data: posts, error: postError }
  ] = await Promise.all([
    videosQuery,
    db.from("forum_threads").select("*").order("created_at", { ascending: false }).limit(5),
    db.from("forum_posts").select("*").order("created_at", { ascending: false }).limit(5)
  ]);

  if (videoError) throw new Error(videoError.message);
  if (threadError) throw new Error(threadError.message);
  if (postError) throw new Error(postError.message);

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
        <div className="container">
          LiveLeak.com - Redefining the Media
        </div>
      </div>

      <div className="container">
        <Link id="logo" href="/">
          Live<span>Leak</span>
        </Link>

        <div id="header-right">
          <p>
            <Link href="/forum">Create Account</Link>&nbsp;|&nbsp;
            <Link href="/admin">Log in</Link>&nbsp;|&nbsp;
            <a href={SPOTIFY_URL} target="_blank" rel="noreferrer">spotify</a>&nbsp;
            <a href={APPLE_MUSIC_URL} target="_blank" rel="noreferrer">apple music</a>
          </p>

          <ul id="nav">
            <li className="current"><Link href="/">Home</Link></li>
            <li><a href="#music">Music</a></li>
            <li><a href="#shows">Shows</a></li>
            <li><a href="#videos">Videos</a></li>
            <li><Link href="/forum">Forum</Link></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <form id="search" action="/" method="get">
            <input
              type="text"
              name="q"
              placeholder="Search videos..."
              defaultValue={query}
            />
            <input type="submit" value="Search" />
          </form>
        </div>

        <div className="clear" />

        <ul id="subnav">
          <li><a href="#music">News &amp; Politics</a>&nbsp;|</li>
          <li><Link href="/forum">Yoursay</Link>&nbsp;|</li>
          <li><a href="#featured">Must See</a>&nbsp;|</li>
          <li><a href="#videos">Entertainment</a>&nbsp;|</li>
          <li><Link href="/forum">Chat</Link>&nbsp;|</li>
          <li><a href="#contact">Staff Blog</a>&nbsp;|</li>
          <li><a href="#stats">Top Leakers</a>&nbsp;|</li>
          <li>
            <a href={SPOTIFY_URL} target="_blank" rel="noreferrer">
              <strong>PREMIUM MEMBERSHIPS</strong>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

function NoticeBar() {
  return (
    <div className="notice_bar">
      <strong>Featured item:</strong> Fell In Love With A Terrorist by LIVELEAK.
      <span> Stream links available now.</span>
    </div>
  );
}

function FeaturedRelease() {
  return (
    <div className="tab_nav_large feature_panel" id="featured">
      <ul className="tabs">
        <li><a href="#featured">In the news</a></li>
        <li><Link href="/forum">Yoursay</Link></li>
        <li><a href="#featured" className="current">Must See</a></li>
        <li><a href="#videos">Recent Activity</a></li>
      </ul>

      <div className="clear" />

      <div className="tab_nav_contents">
        <div className="leak_stamp">EXCLUSIVE / MUSIC</div>

        <ul className="item_list">
          <li className="featured_item">
            <div className="thumbnail_column featured_thumb">
              <a href={FEATURED_TRACK_URL} target="_blank" rel="noreferrer">
                <img
                  className="thumbnail_image"
                  src="/images/terroristsingle.jfif"
                  alt="Fell in Love With a Terrorist"
                />
              </a>
              <span className="rating_icon rating_ga">GA</span>
              <span className="mini_icon rating_hd">HD</span>
            </div>

            <div className="item_info_column">
              <h2>
                <a href={FEATURED_TRACK_URL} target="_blank" rel="noreferrer">
                  FELL IN LOVE WITH A TERRORIST - LIVELEAK
                </a>
              </h2>

              <span>▶</span>&nbsp;<h3>approved, featured</h3><br />

              <div className="description">
                <strong className="band-title">FELL IN LOVE WITH A TERRORIST OUT NOW</strong>
                <p>
                  New single from LIVELEAK. Listen now on Spotify and Apple Music.
                </p>
              </div>

              <h4>
                By: <a href={SPOTIFY_URL} target="_blank" rel="noreferrer" className="liveleak-link">LIVELEAK</a> |
                Comments: <Link href="/forum">46</Link> | Views: 18882 | Votes: 13 | Shared: 5076<br />
                Category: Music | Added: just now in <a href="#videos">Entertainment</a>, <a href="#music">Music</a>
              </h4>

              <div className="links">
                <a href={FEATURED_TRACK_URL} target="_blank" rel="noreferrer">Listen</a>
                <a href={SPOTIFY_URL} target="_blank" rel="noreferrer">Spotify</a>
                <a href={APPLE_MUSIC_URL} target="_blank" rel="noreferrer">Apple Music</a>
                <Link href="/forum">Discuss</Link>
              </div>

              <div className="spotify-wrap">
                <iframe
                  src="https://open.spotify.com/embed/track/49fyD99tJX6n8Wh0UOmT07"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Sidebar({ videos, threads, posts }) {
  return (
    <div id="rightcol">
      <span className="section_title">Current Events</span>
      <div className="scroll_list">
        <ul>
          {videos.slice(0, 3).map((video) => (
            <li key={video.id}>
              <iframe
                className="side_thumb"
                src={`https://www.youtube.com/embed/${video.youtube_id}`}
              />
              <h4><Link href={`/video/${video.id}`}>{video.title}</Link></h4>
              <span>{video.views || 0} views</span>
            </li>
          ))}
        </ul>
      </div>

      <span className="section_title">Forum Activity</span>
      <div className="scroll_list">
        <ul>
          {threads.map((thread) => (
            <li key={thread.id}>
              <h4><Link href={`/forum/${thread.id}`}>{thread.title}</Link></h4>
              <span>By {thread.display_name}</span>
            </li>
          ))}
        </ul>
      </div>

      <span className="section_title">Shows</span>
      <div className="stats_box">
        <strong>Upcoming dates:</strong> TBA<br />
        <strong>Booking:</strong> <a href="mailto:booking@example.com">booking@example.com</a><br />
        <strong>Status:</strong> active
      </div>

      <span className="section_title">Start a Thread</span>
      <div className="form_box">
        <form action={createForumThread}>
          <input name="title" placeholder="Thread title" required />
          <input name="display_name" placeholder="Name" required />
          <textarea name="body" required />
          <button className="era-button" type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}

export default async function HomePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = cleanQuery(resolvedSearchParams?.q);
  const { videos, threads, posts } = await getHomeData(query);

  return (
    <>
      <Header query={query} />

      <main id="content">
        <div className="container">
          <NoticeBar />

          <div id="content_box">
            <div id="leftcol">
              <FeaturedRelease />
            </div>

            <Sidebar videos={videos} threads={threads} posts={posts} />

            <div className="clear" />
          </div>
        </div>
      </main>

      <div className="footer">LiveLeak.com - Redefining the Media</div>
    </>
  );
}