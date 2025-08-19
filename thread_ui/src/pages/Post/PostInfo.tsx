import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

import Post from "../../components/Post/Post";
import Comment from "../../components/Comment/Comment";
import NoData from "../Profile/NoData";

import { usePostHub } from "../../hook/usePostHub";
import { GetPostById } from "../../services/featureServices";
import { commentAction } from "../../services/postServices";

import { InfoUser } from "../../types/AuthType";
import { PostData } from "../../types/PostType";

const PostInfo: React.FC = () => {
  const user: InfoUser = useSelector((state: any) => state.auth);
  const { id_post } = useParams();
  const { isConnected, joinPost, leavePost, onPostCommented } = usePostHub();

  const [post, setPost] = React.useState<PostData | undefined>();
  const [loading, setLoading] = React.useState(true);
  const [commentInput, setCommentInput] = React.useState("");
  const [allComments, setAllComments] = React.useState<any[]>([]);

  // Change page title
  React.useEffect(() => {
    if (post?.content) {
      document.title = `${post.content} • Threads.net`;
    }
  }, [post?.content]);

  // Fetch post + comments
  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response: PostData = await GetPostById(id_post || "");
        setPost(response);
        setAllComments(response.comments ?? []);
        console.log("Fetched post:", response);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id_post]);

  // Handle realtime comment payload
  const handleCommentPayload = (payload: {
    postId: string;
    commentId: string;
    commentContent: string;
    commentCount: number;
    userId: string;
    user: any;
    createdAt: string;
    parentCommentId: string | null;
  }) => {
    if (payload.postId !== post?.id) return;

    const newComment = {
      id: payload.commentId,
      content: payload.commentContent,
      userId: payload.userId,
      user: payload.user,
      postId: payload.postId,
      parentCommentId: payload.parentCommentId,
      createdAt: payload.createdAt,
    };

    setAllComments((prev) => {
      // Check if comment already exists
      const exists = prev.some((c) => c.id === newComment.id);
      if (exists) return prev; // Do not add duplicate comment
      // Add new comment
      return [...prev, newComment];
    });

    setPost((prev) =>
      prev ? { ...prev, commentCount: payload.commentCount } : prev
    );
  };

  // Setup SignalR
  React.useEffect(() => {
    if (!isConnected || !post?.id) return;

    joinPost(post.id);

    onPostCommented(handleCommentPayload);

    return () => {
      leavePost(post.id);
    };
  }, [isConnected, post?.id, joinPost, leavePost, onPostCommented]);

  // Submit comment
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await commentAction(post?.id || "", commentInput);
    if (response) {
      setCommentInput("");
    }
  };

  return (
    <div className="w-[90vh] max-w-[90vh] mt-5">
      <div className="text-center mb-5">
        <h3>Thread</h3>
      </div>
      <div className="border border-slate-200 rounded-xl w-[90vh]">
        {loading ? (
          <div className="flex justify-center py-10">
            <CircularProgress />
          </div>
        ) : (
          <>
            {post && (
              <Post
                style={"w-full px-5 py-5"}
                avatarURL={post.user.avatarURL}
                displayName={post.user.displayName}
                introduction={post.user.introduction}
                isVerified={post.user.verified}
                username={post.user.username}
                postImage={post.images}
                postContent={post.content}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                shareCount={post.shareCount}
                postId={post.id}
                postCreatedAt={post.createdAt}
                repostCount={post.reupCount}
                postUser={post.user}
                followersCount={post.user.follower}
                isLiked={post.isLiked}
              />
            )}

            {allComments.length > 0 ? (
              allComments.map((comment, index) => (
                <Comment
                  key={comment.id}
                  user={comment.user}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  style={`border-t px-10 py-5 w-full ${
                    index === allComments.length - 1 ? "pb-14" : ""
                  } z-[999]`}
                />
              ))
            ) : (
              <NoData message="No comments yet." />
            )}
          </>
        )}

        {user.username && (
          <div className="flex flex-row items-center gap-3 px-5 py-2 fixed bottom-0 z-10 bg-white border border-slate-200 rounded-t-lg w-[90vh] max-w-[90vh]">
            <Link to={`/profile/${user.username}`}>
              <img
                className="w-[30px] min-w-[30px] h-[30px] rounded-full object-cover"
                src={user.avatarURL}
                alt="Avatar"
              />
            </Link>
            <form
              className="flex items-center justify-between w-full"
              onSubmit={submitComment}
            >
              <input
                className="text-sm text-slate-500 w-full outline-none"
                placeholder={`Trả lời @${post?.user.username}...`}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!commentInput || !commentInput.trim()}
                className="border py-1 px-2 border-black rounded-lg hover:bg-black transition ease-in-out duration-200 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500"
              >
                <small>Comment</small>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostInfo;
