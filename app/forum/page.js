// app/forum/page.js
import Link from "next/link";
import { createForumThread } from "@/app/actions";
import { FakeAccountLinks } from "@/components/SiteActions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function getThreads() {
  const db = supabaseAdmin();

  const [
    { data: threads, error: threadError },
    { data: posts, error: postError }
  ] = await Promise.all([
    db
      .from("forum_threads")
      .select("*")
      .order("created_at", { ascending: false }),
    db
      .from("forum_posts")
      .select("thread_id, display_name, created_at")
      .order("created_at", { ascending: false })
  ]);

  if (threadError) throw new Error(threadError.message);
  if (postError) throw new Error(postError.message);

  const statsByThread = {};

  for (const post of posts || []) {
    if (!statsByThread[post.thread_id]) {
      statsByThread[post.thread_id] = {
        replies: 0,
        lastPostName: post.display_name,
        lastPostAt: post.created_at
      };
    }

    statsByThread[post.thread_id].replies += 1;
  }

  return (threads || []).map((thread) => ({
    ...thread,
    forumStats: statsByThread[thread.id] || {
      replies: 0,
      lastPostName: thread.display_name,
      lastPostAt: thread.created_at
    }
  }));
}

function formatForumDate(value) {
  if (!value) return "pending";

  return new Date(value).toLocaleString();
}

function ForumTable({ threads }) {
  return (
    <div className="forum_table">
      <div className="forum_row forum_head">
        <span>Thread</span>
        <span>Started By</span>
        <span>Replies</span>
        <span>Last Post</span>
      </div>

      {threads.length === 0 && (
        <div className="forum_row">
          <span>
            <strong>No threads yet.</strong>
            <em>Start the first discussion below.</em>
          </span>
          <span>-</span>
          <span>0</span>
          <span>pending</span>
        </div>
      )}

      {threads.map((thread) => (
        <div className="forum_row" key={thread.id}>
          <span>
            <strong><Link href={`/forum/${thread.id}`}>{thread.title}</Link></strong>
            <em>{thread.locked ? "locked" : "approved"} / Yoursay</em>
          </span>
          <span>{thread.display_name}</span>
          <span>{thread.forumStats.replies}</span>
          <span>
            {thread.forumStats.lastPostName}<br />
            <em>{formatForumDate(thread.forumStats.lastPostAt)}</em>
          </span>
        </div>
      ))}
    </div>
  );
}

export default async function ForumPage() {
  const threads = await getThreads();

  return (
    <>
      <div id="header">
        <div className="container">
          <Link id="logo" href="/">
            Live<span>Leak</span>
          </Link>

          <div id="header-right">
            <p>
              <Link href="/">Home</Link>&nbsp;|&nbsp;
              <FakeAccountLinks showCreate={false} />
            </p>

            <ul id="nav">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/#videos">Videos</Link></li>
              <li className="current"><Link href="/forum">Forum</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
            </ul>
          </div>

          <div className="clear" />
        </div>
      </div>

      <div id="content">
        <div className="container">
          <div id="content_box">
            <div id="leftcol">
              <div className="section_heading">
                <h1><strong>LIVELEAK Forum</strong>&nbsp;&nbsp; RSS</h1>
              </div>

              <ForumTable threads={threads} />

              <div className="form_box">
                <strong>Start a thread</strong>

                <form action={createForumThread}>
                  <label>Name</label>
                  <input name="display_name" maxLength="40" required />

                  <label>Title</label>
                  <input name="title" maxLength="120" required />

                  <label>Post</label>
                  <textarea name="body" maxLength="1200" required />

                  <input className="hidden-field" name="website" tabIndex="-1" autoComplete="off" />

                  <button className="era-button" type="submit">Create Thread</button>
                </form>
              </div>
            </div>

            <div id="rightcol">
              <span className="section_title">Forum Rules</span>
              <div className="stats_box">
                Keep it weird. Keep it readable.<br />
                No spam. No posting private info.<br />
                Threads are public.
              </div>

              <span className="section_title">Current Events</span>
              <div className="stats_box">
                Threads: {threads.length}<br />
                Status: accepting leaks<br />
                Category: Yoursay / Music
              </div>
            </div>

            <div className="clear" />
          </div>
        </div>
      </div>

      <div className="footer">band website. Not affiliated with LiveLeak.com</div>
    </>
  );
}
