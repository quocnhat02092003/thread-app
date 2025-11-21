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
    <div className="flex flex-col sm:flex-row w-full min-h-screen bg-white">
      {/* Sidebar - Fixed on desktop, bottom nav on mobile */}
      <div className="hidden sm:block sm:fixed sm:left-0 sm:top-0 sm:h-screen z-20">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col sm:flex-row items-start justify-center w-full sm:pl-20 pb-16 sm:pb-0">
        {/* Center Content - Expanded width for better content display */}
        <div className="w-full max-w-3xl lg:max-w-4xl px-0 sm:px-4">
          <Outlet />
        </div>

        {/* Right Column - No Login Card */}
        {!user.username && (
          <div className="hidden lg:block lg:mt-16 lg:ml-5">
            <div className="sticky top-16">
              <NoLoginCard />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="block sm:hidden fixed bottom-0 left-0 right-0 z-30">
        <Sidebar />
      </div>
    </div>
  );
};

export default HomeLayout;
