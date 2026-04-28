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
    db
      .from("forum_threads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    db
      .from("forum_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
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
          WARNING: LIVELEAK ARCHIVE MIRROR // UNVERIFIED BROADCAST MATERIAL // BAND TRANSMISSION ACTIVE
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
              placeholder="Search leaked items..."
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
      <strong>BREAKING:</strong> LIVELEAK signal detected. Audio recovered from corrupted tape source.
      <span> Stream links verified.</span>
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
        <div className="leak_stamp">EXCLUSIVE / MUSIC / LOW RESOLUTION BROADCAST</div>

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

              <span>▶</span>&nbsp;<h3>approved, featured, staff pick</h3><br />

              <div className="description">
                <strong className="band-title">FELL IN LOVE WITH A TERRORIST OUT NOW</strong>
                <p>
                  Official transmission from LIVELEAK. Stream the single, post in the forum,
                  and treat this page like a damaged 2012 media portal that learned how to host a band.
                </p>
              </div>

              <h4>
                By: <a href={SPOTIFY_URL} target="_blank" rel="noreferrer" className="liveleak-link">LIVELEAK</a> |
                Comments: <Link href="/forum">46</Link> | Views: 18882 | Votes: 13 | Shared: 5076<br />
                Location: Internet | Leaked: just now in <a href="#videos">Entertainment</a>, <a href="#music">Music</a>
              </h4>

              <div className="links">
                <a href={FEATURED_TRACK_URL} target="_blank" rel="noreferrer">Listen</a>
                <a href={SPOTIFY_URL} target="_blank" rel="noreferrer">Spotify</a>
                <a href={APPLE_MUSIC_URL} target="_blank" rel="noreferrer">Apple Music</a>
                <Link href="/forum">Discuss</Link>
              </div>

              <div className="spotify-wrap">
                <iframe
                  data-testid="embed-iframe"
                  src="https://open.spotify.com/embed/track/49fyD99tJX6n8Wh0UOmT07?utm_source=generator&theme=0"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Fell in Love With a Terrorist Spotify embed"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

function VideoList({ videos, query }) {
  return (
    <section id="videos">
      <div className="section_heading">
        <h1><strong>{query ? `Search results for "${query}"` : "LiveLeak Videos"}</strong>&nbsp;&nbsp; RSS</h1>
        {query && <Link href="/">clear search</Link>}
      </div>

      <ul className="item_list">
        {videos.length === 0 && (
          <li>
            <div className="thumbnail_column">
              <div className="thumb_blank" />
              <span className="rating_icon rating_raw">RAW</span>
            </div>

            <div className="item_info_column">
              <h2><Link href="/admin">No videos found. Add one in admin.</Link></h2>
              <span>▶</span>&nbsp;<h3>pending</h3><br />
              <h4>
                By: <a href={SPOTIFY_URL} target="_blank" rel="noreferrer" className="liveleak-link">liveleak</a> |
                Comments: <Link href="/forum">0</Link> | Views: 0 | Votes: 0 | Shared: 0<br />
                Leaked: pending in <a href="#videos">Videos</a>
              </h4>
            </div>
          </li>
        )}

        {videos.map((video) => (
          <li key={video.id}>
            <div className="thumbnail_column">
              <Link href={`/video/${video.id}`} aria-label={`Watch ${video.title}`}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtube_id}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={video.title}
                />
              </Link>

              <span className={`rating_icon rating_${String(video.rating_tag || "ma").toLowerCase()}`}>
                {video.rating_tag || "MA"}
              </span>

              {video.mini_tag && (
                <span className={`mini_icon rating_${String(video.mini_tag).toLowerCase()}`}>
                  {video.mini_tag}
                </span>
              )}
            </div>

            <div className="item_info_column">
              <h2><Link href={`/video/${video.id}`}>{video.title}</Link></h2>
              <span>▶</span>&nbsp;<h3>approved, featured</h3><br />

              <h4>
                By: <a href={SPOTIFY_URL} target="_blank" rel="noreferrer" className="liveleak-link">{video.author || "liveleak"}</a> |
                Comments: <Link href={`/video/${video.id}`}>open</Link> |
                Views: {video.views || 0} |
                Votes: {video.likes || 0} |
                Shared: {video.shares || 0}<br />
                Leaked: {formatDate(video.created_at)} in <a href="#videos">Videos</a>
              </h4>

              <div className="links">
                <Link href={`/video/${video.id}`}>Watch</Link>

                <form action={likeVideo.bind(null, video.id)}>
                  <button className="era-button" type="submit">Like</button>
                </form>

                <form action={shareVideo.bind(null, video.id)}>
                  <button className="era-button" type="submit">Share</button>
                </form>

                <Link href="/forum">Discuss</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ul className="pagenav">
        <li><a href="#videos">Previous</a></li>
        <li className="current">1</li>
        <li><a href="#featured">2</a></li>
        <li><Link href="/forum">3</Link></li>
        <li><a href="#shows">4</a></li>
        <li><a href="#contact">5</a></li>
        <li><a href="#videos">Next</a></li>
      </ul>
    </section>
  );
}

function Sidebar({ videos, threads, posts }) {
  return (
    <div id="rightcol">
      <span className="section_title danger_title">Current Events</span>
      <div className="scroll_list current_events">
        <ul>
          <li>
            <img className="side_thumb" src="/images/terroristsingle.jfif" alt="Fell In Love With A Terrorist" />
            <h4>
              <a href={FEATURED_TRACK_URL} target="_blank" rel="noreferrer">
                Fell In Love With A Terrorist
              </a>
            </h4>
            <span>LIVELEAK / single / music / verified stream</span>
          </li>

          {videos.slice(0, 3).map((video) => (
            <li key={video.id}>
              <iframe
                className="side_thumb"
                src={`https://www.youtube.com/embed/${video.youtube_id}`}
                title={video.title}
              />
              <h4><Link href={`/video/${video.id}`}>{video.title}</Link></h4>
              <span>{video.views || 0} views / leaked footage</span>
            </li>
          ))}
        </ul>
      </div>

      <span className="section_title">Forum Activity</span>
      <div className="scroll_list">
        <ul>
          {threads.length === 0 && (
            <li>
              <h4><Link href="/forum">No threads yet</Link></h4>
              <span>Start the first argument.</span>
            </li>
          )}

          {threads.map((thread) => (
            <li key={thread.id}>
              <h4><Link href={`/forum/${thread.id}`}>{thread.title}</Link></h4>
              <span>By {thread.display_name || "anonymous"}</span>
            </li>
          ))}

          {posts.map((post) => (
            <li key={post.id}>
              <h4><Link href={`/forum/${post.thread_id}`}>Recent reply</Link></h4>
              <span>{post.display_name || "anonymous"}: {post.body}</span>
            </li>
          ))}
        </ul>
      </div>

      <span className="section_title" id="shows">Transmission Log</span>
      <div className="stats_box transmission_box">
        <strong>Upcoming dates:</strong> TBA<br />
        <strong>Booking:</strong> <a href="mailto:booking@example.com">booking@example.com</a><br />
        <strong>Location:</strong> Internet<br />
        <strong>Signal:</strong> unstable<br />
        <strong>Status:</strong> accepting leaks
      </div>

      <span className="section_title">Start a Thread</span>
      <div className="form_box">
        <form action={createForumThread}>
          <input name="title" placeholder="Thread title" required />
          <input name="display_name" placeholder="Name" required />
          <textarea name="body" placeholder="Say something reckless..." required />
          <input className="hidden-field" name="website" tabIndex="-1" autoComplete="off" />
          <button className="era-button" type="submit">Post to Forum</button>
        </form>
      </div>

      <span className="section_title" id="contact">Contact</span>
      <div className="stats_box" id="stats">
        <strong>Online:</strong> 46 users<br />
        <strong>Items:</strong> {videos.length}<br />
        <strong>Status:</strong> approved, featured<br />
        <strong>Category:</strong> Entertainment / Music<br />
        <strong>Artist:</strong> LIVELEAK<br />
        <strong>Email:</strong> <a href="mailto:booking@example.com">booking@example.com</a>
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
        <span id="music" />

        <div className="container">
          <NoticeBar />

          <div id="content_box">
            <div id="leftcol">
              <FeaturedRelease />
              <VideoList videos={videos} query={query} />
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