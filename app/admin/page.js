// app/admin/page.js
import { cookies } from "next/headers";
import Link from "next/link";
import {
  createVideo,
  updateVideo,
  deleteVideo,
  deleteComment,
  loginAdmin,
  logoutAdmin,
  deleteForumThread,
  deleteForumPost
} from "@/app/actions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import BlobVideoUpload from "@/components/BlobVideoUpload";
import { VideoThumb } from "@/components/VideoMedia";
import { getVideoUrl } from "@/lib/videoSource";

async function isAdminSessionValid() {
  const cookieStore = await cookies();
  const expected = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  return cookieStore.get("liveleak_admin")?.value === expected;
}

async function getAdminData() {
  const db = supabaseAdmin();

  const { data: videos, error: videoError } = await db
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (videoError) throw new Error(videoError.message);

  const { data: comments, error: commentError } = await db
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (commentError) throw new Error(commentError.message);

  const { data: threads, error: threadError } = await db
    .from("forum_threads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (threadError) throw new Error(threadError.message);

  const { data: posts, error: postError } = await db
    .from("forum_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);

  if (postError) throw new Error(postError.message);

  return {
    videos: videos || [],
    comments: comments || [],
    threads: threads || [],
    posts: posts || []
  };
}

function AdminHeader() {
  return (
    <div id="header">
      <div className="container">
        <Link id="logo" href="/">
          Live<span>Leak</span>
        </Link>

        <div id="header-right">
          <p>
            <Link href="/">Home</Link>&nbsp;|&nbsp;
            <Link href="/forum">Forum</Link>&nbsp;|&nbsp;
            <Link href="/admin">Admin</Link>
          </p>

          <ul id="nav">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#videos">Videos</Link></li>
            <li><Link href="/forum">Forum</Link></li>
            <li className="current"><Link href="/admin">Admin</Link></li>
          </ul>
        </div>

        <div className="clear" />

        <ul id="subnav">
          <li><a href="#">News &amp; Politics</a>&nbsp;|</li>
          <li><a href="#">Yoursay</a>&nbsp;|</li>
          <li><a href="#">Must See</a>&nbsp;|</li>
          <li><a href="#">Entertainment</a>&nbsp;|</li>
          <li><a href="#">Staff Blog</a>&nbsp;|</li>
          <li><a href="#">Top Leakers</a>&nbsp;|</li>
          <li><a href="#"><strong>PREMIUM MEMBERSHIPS</strong></a></li>
        </ul>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const authed = await isAdminSessionValid();

  if (!authed) {
    return (
      <>
        <AdminHeader />

        <div id="content">
          <div className="container">
            <div id="content_box">
              <div id="leftcol">
                <div className="tab_nav_large">
                  <ul className="tabs">
                    <li><a href="#" className="current">Admin Login</a></li>
                    <li><a href="#">Manage Items</a></li>
                    <li><a href="#">Settings</a></li>
                  </ul>

                  <div className="clear" />

                  <div className="tab_nav_contents">
                    <div className="form_box">
                      <strong>Log in</strong>
                      <form action={loginAdmin}>
                        <label>Admin Password</label>
                        <input name="password" type="password" required />
                        <button className="era-button" type="submit">Log In</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div id="rightcol">
                <span className="section_title">Admin Notes</span>
                <div className="stats_box">
                  This admin panel uses a lightweight cookie session. No public user accounts yet.
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

  const { videos, comments, threads, posts } = await getAdminData();

  return (
    <>
      <AdminHeader />

      <div id="content">
        <div className="container">
          <div id="content_box">
            <div id="leftcol">
              <div className="tab_nav_large">
                <ul className="tabs">
                  <li><a href="#">Upload</a></li>
                  <li><a href="#" className="current">Manage Items</a></li>
                  <li><a href="#">Forum</a></li>
                  <li><a href="#">Recent Comments</a></li>
                </ul>

                <div className="clear" />

                <div className="tab_nav_contents">
                  <div className="form_box">
                    <strong>Add new video</strong>

                    <form action={createVideo}>
                      <label>Title</label>
                      <input name="title" placeholder="LIVELEAK live footage" required />

                      <label>Video File URL</label>
                      <input name="video_url" placeholder="Paste Vercel Blob URL here" required />

                      <label>Rating Tag</label>
                      <select name="rating_tag" defaultValue="MA">
                        <option value="GA">GA</option>
                        <option value="MA">MA</option>
                        <option value="WTF">WTF</option>
                        <option value="RAW">RAW</option>
                      </select>

                      <label>Mini Tag</label>
                      <select name="mini_tag" defaultValue="HD">
                        <option value="HD">HD</option>
                        <option value="RAW">RAW</option>
                        <option value="">None</option>
                      </select>

                      <button className="era-button" type="submit">Add Video</button>
                    </form>
                  </div>

                  <BlobVideoUpload />
                </div>
              </div>

              <ul className="item_list">
                <h1><strong>Existing Videos</strong>&nbsp;&nbsp; RSS</h1>

                {videos.length === 0 && (
                  <li>
                    <div className="thumbnail_column">
                      <div className="thumb_blank" />
                      <span className="rating_icon rating_raw">RAW</span>
                    </div>

                    <div className="item_info_column">
                      <h2>No videos yet.</h2>
                      <span>▶</span>&nbsp;<h3>pending</h3><br />
                      <h4>Add one with the form above.</h4>
                    </div>
                  </li>
                )}

                {videos.map((video) => (
                  <li key={video.id}>
                    <div className="thumbnail_column">
                      <VideoThumb video={video} linked={false} />
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
                      <span>▶</span>&nbsp;<h3>{video.published ? "approved, featured" : "hidden"}</h3><br />

                      <h4>
                        By: <a href="#" className="liveleak-link">{video.author}</a> | Views: {video.views} | Votes: {video.likes} | Shared: {video.shares}<br />
                        Status: {video.published ? "published" : "hidden"} | Created: {new Date(video.created_at).toLocaleString()}
                      </h4>

                      <div className="form_box" style={{ marginTop: "7px" }}>
                        <strong>Edit video</strong>

                        <form action={updateVideo}>
                          <input type="hidden" name="id" value={video.id} />

                          <label>Title</label>
                          <input name="title" defaultValue={video.title} required />

                          <label>Video File URL</label>
                          <input name="video_url" defaultValue={getVideoUrl(video)} />

                          <label>Rating Tag</label>
                          <select name="rating_tag" defaultValue={video.rating_tag || "MA"}>
                            <option value="GA">GA</option>
                            <option value="MA">MA</option>
                            <option value="WTF">WTF</option>
                            <option value="RAW">RAW</option>
                          </select>

                          <label>Mini Tag</label>
                          <select name="mini_tag" defaultValue={video.mini_tag || ""}>
                            <option value="HD">HD</option>
                            <option value="RAW">RAW</option>
                            <option value="">None</option>
                          </select>

                          <label>
                            <input
                              type="checkbox"
                              name="published"
                              defaultChecked={video.published}
                              style={{ width: "auto", marginRight: "5px" }}
                            />
                            Published
                          </label>

                          <button className="era-button" type="submit">Update Video</button>
                        </form>

                        <form action={deleteVideo} style={{ marginTop: "7px" }}>
                          <input type="hidden" name="id" value={video.id} />
                          <button className="era-button" type="submit" style={{ background: "#9b0000", color: "#fff" }}>
                            Delete Video
                          </button>
                        </form>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div id="rightcol">
              <form action={logoutAdmin} style={{ marginBottom: "10px" }}>
                <button className="era-button" type="submit">Log Out</button>
              </form>

              <span className="section_title">Forum Threads</span>
              <div className="scroll_list">
                <ul>
                  {threads.length === 0 && (
                    <li>
                      <h4>No forum threads yet.</h4>
                      <span>Threads will appear here.</span>
                    </li>
                  )}

                  {threads.map((thread) => (
                    <li key={thread.id}>
                      <h4><Link href={`/forum/${thread.id}`}>{thread.title}</Link></h4>
                      <span>By {thread.display_name}</span>

                      <form action={deleteForumThread} style={{ marginTop: "5px" }}>
                        <input type="hidden" name="id" value={thread.id} />
                        <button className="era-button" type="submit" style={{ background: "#9b0000", color: "#fff" }}>
                          Delete Thread
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              </div>

              <span className="section_title">Recent Comments</span>
              <div className="scroll_list">
                <ul>
                  {comments.length === 0 && (
                    <li>
                      <h4>No comments yet.</h4>
                      <span>Comments will appear here.</span>
                    </li>
                  )}

                  {comments.map((comment) => (
                    <li key={comment.id}>
                      <h4>{comment.display_name}</h4>
                      <span>{comment.body}</span>

                      <form action={deleteComment} style={{ marginTop: "5px" }}>
                        <input type="hidden" name="id" value={comment.id} />
                        <input type="hidden" name="video_id" value={comment.video_id} />
                        <button className="era-button" type="submit" style={{ background: "#9b0000", color: "#fff" }}>
                          Delete Comment
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              </div>

              <span className="section_title">Recent Forum Replies</span>
              <div className="scroll_list">
                <ul>
                  {posts.length === 0 && (
                    <li>
                      <h4>No replies yet.</h4>
                      <span>Replies will appear here.</span>
                    </li>
                  )}

                  {posts.map((post) => (
                    <li key={post.id}>
                      <h4>{post.display_name}</h4>
                      <span>{post.body}</span>

                      <form action={deleteForumPost} style={{ marginTop: "5px" }}>
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="thread_id" value={post.thread_id} />
                        <button className="era-button" type="submit" style={{ background: "#9b0000", color: "#fff" }}>
                          Delete Reply
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
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
