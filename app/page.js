// app/page.js
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { likeVideo, shareVideo } from "./actions";

async function getVideos() {
  const db = supabaseAdmin();

  const { data, error } = await db
    .from("videos")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export default async function HomePage() {
  const videos = await getVideos();

  return (
    <>
      <div id="header">
        <div className="container">
          <Link id="logo" href="/">
            Live<span>Leak</span>
          </Link>

          <div id="header-right">
            <p>
              <Link href="/admin">Create Account</Link>&nbsp;|&nbsp;
              <Link href="/admin">Log in</Link>&nbsp;|&nbsp;
              <a href="#">facebook</a>&nbsp;
              <a href="#">twitter</a>
            </p>

            <ul id="nav">
              <li className="current"><a href="#music">Music</a></li>
              <li><a href="#shows">Shows</a></li>
              <li><a href="#videos">Videos</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>

            <fieldset id="search">
              {/* Server Components cannot use onFocus/onBlur handlers.
                  Placeholder gives the same visible behavior without client JS. */}
              <input
                type="text"
                name="q"
                placeholder="Your search entry..."
              />
              <input type="submit" value="Search" />
            </fieldset>
          </div>

          <div className="clear" />

          <ul id="subnav">
            <li><a href="#">News &amp; Politics</a>&nbsp;|</li>
            <li><a href="#">Yoursay</a>&nbsp;|</li>
            <li><a href="#">Must See</a>&nbsp;|</li>
            <li><a href="#">Iraq</a>&nbsp;|</li>
            <li><a href="#">Afghanistan</a>&nbsp;|</li>
            <li><a href="#">Entertainment</a>&nbsp;|</li>
            <li><a href="#">Chat</a>&nbsp;|</li>
            <li><a href="#">Staff Blog</a>&nbsp;|</li>
            <li><a href="#">Top Leakers</a>&nbsp;|</li>
            <li><a href="#"><strong>PREMIUM MEMBERSHIPS</strong></a></li>
          </ul>
        </div>
      </div>

      <div id="content">
        <span id="music" />
        <div className="container">
          <div id="content_box">
            <div id="leftcol">
              <div className="tab_nav_large">
                <ul className="tabs">
                  <li><a href="#">In the news</a></li>
                  <li><a href="#">Yoursay</a></li>
                  <li><a href="#" className="current">Must See</a></li>
                  <li><a href="#">Recent Activity</a></li>
                </ul>

                <div className="clear" />

                <div className="tab_nav_contents">
                  <ul className="item_list">
                    <li>
                      <div className="thumbnail_column">
                        <img className="thumbnail_image" src="/images/terroristsingle.jfif" alt="Fell in Love With a Terrorist" />
                        <span className="rating_icon rating_ga">GA</span><span className="mini_icon rating_hd">HD</span>
                      </div>

                      <div className="item_info_column">
                        <h2><a href="#">FELL IN LOVE WITH A TERRORIST - LIVELEAK</a></h2>
                        <span>▶</span>&nbsp;<h3>approved, featured</h3><br />

                        <div className="description">
                          <strong className="band-title">FELL IN LOVE WITH A TERRORIST OUT NOW</strong>
                        </div>

                        <h4>
                          By: <a href="#" className="liveleak-link">LIVELEAK</a> | Comments: <a href="#">46</a> | Views: 18882 | Votes: 13 | Shared: 5076<br />
                          Location: <a href="#">Internet</a> | Leaked: just now in <a href="#">Entertainment</a>, <a href="#">Music</a>
                        </h4>

                        <div className="links">
                          <a href="https://open.spotify.com/artist/46pXqeFHTjgAGPovI7u3bI" target="_blank">Spotify</a>
                          <a href="https://music.apple.com/us/artist/live-leak/1888285076" target="_blank">Apple Music</a>
                        </div>

                        <div className="spotify-wrap">
                          <iframe
                            data-testid="embed-iframe"
                            style={{ borderRadius: "12px" }}
                            src="https://open.spotify.com/embed/track/49fyD99tJX6n8Wh0UOmT07?utm_source=generator&theme=0"
                            height="152"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <ul className="item_list" id="videos">
                <h1><strong>LiveLeak Videos</strong>&nbsp;&nbsp; RSS</h1>

                {videos.length === 0 && (
                  <li>
                    <div className="thumbnail_column">
                      <div className="thumb_blank" />
                      <span className="rating_icon rating_raw">RAW</span>
                    </div>
                    <div className="item_info_column">
                      <h2><Link href="/admin">No videos yet. Add one in admin.</Link></h2>
                      <span>▶</span>&nbsp;<h3>pending</h3><br />
                      <h4>By: <a href="#" className="liveleak-link">liveleak</a> | Comments: <a href="#">0</a> | Views: 0 | Votes: 0 | Shared: 0<br />
                      Leaked: pending in <a href="#">Videos</a></h4>
                    </div>
                  </li>
                )}

                {videos.map((video) => (
                  <li key={video.id}>
                    <div className="thumbnail_column">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.youtube_id}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
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
                        By: <a href="#" className="liveleak-link">{video.author}</a> | Comments: <a href={`/video/${video.id}`}>open</a> | Views: {video.views} | Votes: {video.likes} | Shared: {video.shares}<br />
                        Leaked: {new Date(video.created_at).toLocaleDateString()} in <a href="#">Videos</a>
                      </h4>

                      <div className="links">
                        <Link href={`/video/${video.id}`}>Watch</Link>

                        <form action={likeVideo.bind(null, video.id)} style={{ display: "inline" }}>
                          <button className="era-button" type="submit">Like</button>
                        </form>

                        <form action={shareVideo.bind(null, video.id)} style={{ display: "inline" }}>
                          <button className="era-button" type="submit">Share</button>
                        </form>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <ul className="pagenav">
                <li>Previous</li>
                <li className="current">1</li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">5</a></li>
                <li><a href="#">Next</a></li>
              </ul>
            </div>

            <div id="rightcol">
              <span className="section_title">Current Events</span>
              <div className="scroll_list">
                <ul>
                  <li>
                    <img className="side_thumb" src="/images/terroristsingle.jfif" alt="single art" />
                    <h4><a href="#">Fell In Love With A Terrorist</a></h4>
                    <span>LIVELEAK / single / music</span>
                  </li>

                  {videos.slice(0, 2).map((video) => (
                    <li key={video.id}>
                      <iframe
                        className="side_thumb"
                        src={`https://www.youtube.com/embed/${video.youtube_id}`}
                        frameBorder="0"
                        allowFullScreen
                      />
                      <h4><Link href={`/video/${video.id}`}>{video.title}</Link></h4>
                      <span>LIVELEAK / video / leaked footage</span>
                    </li>
                  ))}
                </ul>
              </div>

              <span className="section_title" id="shows">Shows</span>
              <div className="stats_box">
                Upcoming dates: TBA<br />
                Booking: <a href="mailto:booking@example.com">booking@example.com</a><br />
                Location: Internet<br />
                Status: accepting leaks
              </div>

              <span className="section_title" id="contact">Contact</span>
              <div className="stats_box">
                Online: 46 users<br />
                Items: {videos.length}<br />
                Status: approved, featured<br />
                Category: Entertainment / Music<br />
                Artist: LIVELEAK
              </div>
            </div>

            <div className="clear" />
          </div>
        </div>
      </div>

      <div className="footer">
        LiveLeak.com - Redefining the Media
      </div>
    </>
  );
}