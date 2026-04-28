// app/forum/[id]/page.js
import Link from "next/link";
import { notFound } from "next/navigation";
import { addForumReply } from "@/app/actions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function getThread(id) {
  const db = supabaseAdmin();

  const { data: thread, error } = await db
    .from("forum_threads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !thread) return null;

  const { data: posts, error: postsError } = await db
    .from("forum_posts")
    .select("*")
    .eq("thread_id", id)
    .order("created_at", { ascending: true });

  if (postsError) throw new Error(postsError.message);

  return {
    thread,
    posts: posts || []
  };
}

export default async function ForumThreadPage({ params }) {
  const { id } = await params;
  const result = await getThread(id);

  if (!result) notFound();

  const { thread, posts } = result;

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
              <Link href="/admin">Log in</Link>
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
              <ul className="item_list">
                <h1><strong>{thread.title}</strong>&nbsp;&nbsp; RSS</h1>

                <li>
                  <div className="comment_box">
                    <strong>{thread.display_name}</strong><br />
                    {thread.body}<br />
                    <span style={{ color: "#777", fontSize: "10px" }}>
                      Posted: {new Date(thread.created_at).toLocaleString()}
                    </span>
                  </div>
                </li>

                {posts.map((post) => (
                  <li key={post.id}>
                    <div className="comment_box">
                      <strong>{post.display_name}</strong><br />
                      {post.body}<br />
                      <span style={{ color: "#777", fontSize: "10px" }}>
                        Posted: {new Date(post.created_at).toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="form_box">
                <strong>Reply</strong>

                <form action={addForumReply.bind(null, thread.id)}>
                  <label>Name</label>
                  <input name="display_name" maxLength="40" required />

                  <label>Reply</label>
                  <textarea name="body" maxLength="1200" required />

                  <input className="hidden-field" name="website" tabIndex="-1" autoComplete="off" />

                  <button className="era-button" type="submit">Submit Reply</button>
                </form>
              </div>
            </div>

            <div id="rightcol">
              <span className="section_title">Thread Stats</span>
              <div className="stats_box">
                Replies: {posts.length}<br />
                Started by: {thread.display_name}<br />
                Status: {thread.locked ? "locked" : "open"}<br />
                Category: Forum / Yoursay
              </div>

              <span className="section_title">Forum</span>
              <div className="stats_box">
                <Link href="/forum">Back to forum index</Link>
              </div>
            </div>

            <div className="clear" />
          </div>
        </div>
      </div>

      <div className="footer">LiveLeak.com - Redefining the Media</div>
    </>
  );
}