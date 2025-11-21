import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFollowUser } from "../../features/follow/FollowingSlice";
import { AppDispatch, RootState } from "../../app/store";
import { enqueueSnackbar } from "notistack";

interface ButtonFollowProps {
  targetUserId: string;
  style?: string;
}

const ButtonFollow = ({ targetUserId, style = "" }: ButtonFollowProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const followingIds = useSelector(
    (state: RootState) => state.following.followingIds
  );
  const isFollowing = followingIds.includes(targetUserId);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleToggle = () => {
    try {
      setLoading(true);
      dispatch(toggleFollowUser({ targetUserId, isFollowing }));
      enqueueSnackbar(
        isFollowing ? "Đã hủy theo dõi người dùng" : "Đã theo dõi người dùng",
        { variant: isFollowing ? "warning" : "success" }
      );
    } catch (error) {
      enqueueSnackbar("Lỗi khi thay đổi trạng thái theo dõi", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1.5 sm:py-2 rounded-lg mt-3 transition duration-200 ${
        isFollowing
          ? "border border-black bg-white text-black"
          : "bg-slate-900 text-white"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""} ${style}`}
    >
      <p className="font-bold text-xs sm:text-sm">
        {loading ? "Đang xử lý..." : isFollowing ? "Đang theo dõi" : "Theo dõi"}
      </p>
    </button>
  );
};

export default ButtonFollow;
