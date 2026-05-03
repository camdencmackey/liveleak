// app/forum/page.js
import Link from "next/link";
import { createForumThread } from "@/app/actions";
import { FakeAccountLinks } from "@/components/SiteActions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function getThreads() {
  const db = supabaseAdmin();

  const { data, error } = await db
    .from("forum_threads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
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
              <ul className="item_list">
                <h1><strong>LIVELEAK Forum</strong>&nbsp;&nbsp; RSS</h1>

                {threads.length === 0 && (
                  <li>
                    <div className="thumbnail_column">
                      <div className="thumb_blank" />
                      <span className="rating_icon rating_raw">RAW</span>
                    </div>

                    <div className="item_info_column">
                      <h2>No threads yet.</h2>
                      <span>▶</span>&nbsp;<h3>pending</h3><br />
                      <h4>Start the first discussion below.</h4>
                    </div>
                  </li>
                )}

                {threads.map((thread) => (
                  <li key={thread.id}>
                    <div className="thumbnail_column">
                      <div className="thumb_blank" />
                      <span className="rating_icon rating_raw">RAW</span>
                    </div>

                    <div className="item_info_column">
                      <h2><Link href={`/forum/${thread.id}`}>{thread.title}</Link></h2>
                      <span>▶</span>&nbsp;<h3>{thread.locked ? "locked" : "approved"}</h3><br />
                      <h4>
                        By: <a href="#" className="liveleak-link">{thread.display_name}</a> | Posted: {new Date(thread.created_at).toLocaleString()}<br />
                        Leaked in <a href="#">Forum</a>, <a href="#">Yoursay</a>
                      </h4>
                    </div>
                  </li>
                ))}
              </ul>

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

      <div className="footer">LiveLeak.com - Redefining the Media<br />band website. Not affiliated with LiveLeak.com</div>
    </>
  );
}
