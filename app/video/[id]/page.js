// app/video/[id]/page.js

import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { likeVideo, shareVideo, addComment } from "@/app/actions";
import { timeAgo } from "@/lib/time";
import { FakeAccountLinks, ReportButton } from "@/components/SiteActions";
import { SideVideoThumb, WatchPlayer } from "@/components/VideoMedia";
import ClientView from "./ClientView";

export default async function VideoPage({ params }) {
  const db = supabaseAdmin();

  const { data: video } = await db
    .from("videos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!video) return notFound();

  const { data: comments } = await db
    .from("comments")
    .select("*")
    .eq("video_id", video.id)
    .order("created_at", { ascending: true });

  const { data: related } = await db
    .from("videos")
    .select("*")
    .neq("id", video.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <>
      {/* Tracks views safely */}
      <ClientView videoId={video.id} />

      <div id="header">
        <div className="container">
          <Link id="logo" href="/">
            Live<span>Leak</span>
          </Link>

          <div id="header-right">
            <p><FakeAccountLinks showCreate={false} /></p>

            <ul id="nav">
              <li><Link href="/">Home</Link></li>
              <li className="current"><Link href="#">Videos</Link></li>
              <li><Link href="/forum">Forum</Link></li>
            </ul>
          </div>

          <div className="clear" />
        </div>
      </div>

      <div id="content">
        <div className="container">
          <div id="content_box">

            {/* LEFT */}
            <div id="leftcol">

              <ul className="item_list">
                <h1><strong>{video.title}</strong></h1>

                <li>
                  <WatchPlayer video={video} />

                  <h4>
                    By: <a className="liveleak-link">{video.author}</a> | 
                    Views: {video.views} | 
                    Votes: {video.likes} | 
                    Shared: {video.shares}<br />
                    Leaked: {timeAgo(video.created_at)} | File: {video.video_url ? "hosted" : "not attached"}
                  </h4>

                  <div className="links">
                    <form action={likeVideo.bind(null, video.id)}>
                      <button className="era-button">Like</button>
                    </form>

                    <form action={shareVideo.bind(null, video.id)}>
                      <button className="era-button">Share</button>
                    </form>

                    <ReportButton />
                    {video.video_url && (
                      <a href={video.video_url} download>
                        Download
                      </a>
                    )}
                    <Link href="/">Back</Link>
                  </div>

                  {video.video_url && (
                    <div className="embed_box">
                      <strong>Embed item</strong>
                      <textarea
                        readOnly
                        value={`<video controls src="${video.video_url}"></video>`}
                      />
                    </div>
                  )}
                </li>
              </ul>

              {/* COMMENTS */}
              <ul className="item_list">
                <h1><strong>Comments</strong> ({comments.length})</h1>

                {comments.map((c) => (
                  <li key={c.id}>
                    <div className="comment_box">
                      <strong>{c.display_name}</strong><br />
                      {c.body}<br />
                      <span>{timeAgo(c.created_at)}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* COMMENT FORM */}
              <div className="form_box">
                <strong>Post comment</strong>

                <form action={addComment.bind(null, video.id)}>
                  <input name="display_name" placeholder="Name" required />
                  <textarea name="body" placeholder="Comment" required />
                  <button className="era-button">Submit</button>
                </form>
              </div>

            </div>

            {/* RIGHT */}
            <div id="rightcol">

              <span className="section_title">Related</span>

              <div className="scroll_list">
                <ul>
                  {related.map((r) => (
                    <li key={r.id}>
                      <SideVideoThumb video={r} />
                      <h4>
                        <Link href={`/video/${r.id}`}>{r.title}</Link>
                      </h4>
                      <span>{r.views} views</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="clear" />
          </div>
        </div>
      </div>

      <div className="footer">LiveLeak.com - Redefining the Media<br />band website. Not affiliated with LiveLeak.com</div>
    </>
  );
}
