import React from "react";
import { GoComment, GoHeart, GoShareAndroid } from "react-icons/go";
import { Link } from "react-router-dom";
import { usePostHub } from "../../hook/usePostHub";
import { useNotificationsHub } from "../../hook/useNotificationsHub";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../../features/notifications/NotificationsSlice";
import { AppDispatch, RootState } from "../../app/store";
import { toggleLikePost } from "../../features/is_liked_post/LikedPostSlice";

interface PostActionsProps {
  likes: number;
  comments: number;
  shares: number;
  postId: string;
  postUsername?: string;
}

const PostActions: React.FC<PostActionsProps> = ({
  likes,
  comments,
  shares,
  postId,
  postUsername,
}) => {
  const [likeCount, setLikeCount] = React.useState(likes);

  const dispatch = useDispatch<AppDispatch>();

  const likedPostIds = useSelector(
    (state: RootState) => state.likedPosts.likedPostIds
  );
  const isLiked = likedPostIds.includes(postId);

  const { isConnected, joinPost, leavePost, onPostLikedChanged } = usePostHub();
  const { connection, ReceiverNotification } = useNotificationsHub();

  React.useEffect(() => {
    if (!connection) return;

    ReceiverNotification((data) => {
      dispatch(addNotification(data));
    });

    return () => {
      connection.off("SendNotification");
    };
  }, [connection, ReceiverNotification, dispatch]);

  React.useEffect(() => {
    if (!isConnected) return;

    joinPost(postId);

    onPostLikedChanged((id, count) => {
      if (id === postId) {
        setLikeCount(count);
      }
    });

    return () => {
      leavePost(postId);
    };
  }, [isConnected, postId, joinPost, leavePost, onPostLikedChanged]);

  const likePostAction = () => {
    try {
      dispatch(toggleLikePost({ postId, isLiked }));
    } catch (error) {
      console.error("Failed to toggle like post:", error);
    }
  };

  return (
    <div className="flex gap-5 mt-2">
      <button
        onClick={likePostAction}
        className={`flex items-center gap-1 p-2 hover:bg-slate-200 rounded-md ${
          isLiked ? "text-red-500" : ""
        }`}
      >
        <GoHeart /> <small>{likeCount}</small>
      </button>
      <Link to={"/@" + postUsername + "/post/" + postId}>
        <button className="flex items-center gap-1 p-2 hover:bg-slate-200 transition-all duration-300 ease-in-out rounded-md">
          <GoComment /> <small>{comments}</small>
        </button>
      </Link>
      <button className="flex items-center gap-1 p-2 hover:bg-slate-200 transition-all duration-300 ease-in-out rounded-md">
        <GoShareAndroid />
        <small>{shares}</small>
      </button>
    </div>
  );
};

export default PostActions;
