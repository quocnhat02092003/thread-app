import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import NoLoginCard from "../components/NoLoginCard/NoLoginCard";
import { useDispatch, useSelector } from "react-redux";
import { GetUserInformation } from "../services/authServices";
import { login } from "../features/auth/AuthSlice";
import { fetchFollowingIds } from "../features/follow/FollowingSlice";
import { AppDispatch, RootState } from "../app/store";
import { enqueueSnackbar } from "notistack";
import { fetchLikedPostIds } from "../features/is_liked_post/LikedPostSlice";

const HomeLayout: React.FC = () => {
  //Redirect to add-information
  const navigate = useNavigate();

  // Initialize Redux dispatch
  const dispatch = useDispatch<AppDispatch>();

  // Get user information from Redux store
  const user = useSelector((state: RootState) => state.auth);

  // Fetch user information if not already available
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await GetUserInformation();
        dispatch(login(userInfo));
        if (!userInfo.displayName) {
          navigate("/add-information");
        }
      } catch (error) {
        // console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch following IDs when the user logs in
  React.useEffect(() => {
    if (user.username) {
      dispatch(fetchFollowingIds());
    }
  }, [user.username]);

  // Fetch liked post IDs when the user logs in
  React.useEffect(() => {
    if (user.username) {
      dispatch(fetchLikedPostIds());
    }
  }, [user.username]);

  // Handle offline event to show a notification
  React.useEffect(() => {
    const handleOffline = () => {
      enqueueSnackbar(
        "Bạn đã mất kết nối Internet. Vui lòng kiểm tra lại kết nối của bạn.",
        {
          variant: "error",
          autoHideDuration: 5000,
        }
      );
    };

    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex flex-row w-full h-screen">
      {/* Navbar */}
      <div className="fixed">
        <Sidebar />
      </div>
      {/* Home-body */}
      <div className="flex flex-row items-start justify-center w-full gap-5">
        <div className="-ml-32">
          <Outlet />
        </div>
        {!user.username && (
          <div className="mt-16">
            <div className="fixed">
              <NoLoginCard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeLayout;
