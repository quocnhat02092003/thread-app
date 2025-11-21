import { Link } from "react-router-dom";
import NoLoginDialog from "../NoLoginDialog/NoLoginDialog";
import { useSelector } from "react-redux";
import React from "react";
import DialogUploadPost from "../UploadPost/DialogUploadPost";
import { PiThreadsLogoLight } from "react-icons/pi";
import {
  GoHome,
  GoSearch,
  GoPlusCircle,
  GoHeart,
  GoPerson,
  GoInfo,
  GoTab,
} from "react-icons/go";
import { InfoUser } from "../../types/AuthType";
import SettingUserDialog from "../SettingUserDialog/SettingUserDialog";
import { RootState } from "../../app/store";

const Sidebar = () => {
  const user: InfoUser = useSelector((state: any) => state.auth);

  const [openDialogUploadPost, setOpenDialogUploadPost] =
    React.useState<boolean>(false);

  const [styleIcon, setStyleIcon] = React.useState<string>("home");

  const notificationsRedux = useSelector(
    (state: RootState) => state.notifications
  );

  return (
    <div className="flex flex-row sm:flex-col items-center justify-around sm:justify-between py-3 sm:py-5 border-t sm:border-t-0 sm:border-r-2 w-full sm:w-20 h-16 sm:h-screen bg-white shadow-lg sm:shadow-none">
      <div className="hidden sm:block">
        <Link to="/">
          <PiThreadsLogoLight size="3em" />
        </Link>
      </div>
      <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-5 sm:my-10 w-full sm:w-auto justify-around sm:justify-center">
        <Link
          to="/"
          title="Trang chủ"
          onClick={() => setStyleIcon("home")}
          className={`p-2 hover:bg-slate-200 ${
            styleIcon === "home" && "text-blue-500"
          } transition-all duration-300 ease-in-out rounded-md`}
        >
          <GoHome size="1.8em" />
        </Link>
        <Link
          to="/search"
          title="Tìm kiếm"
          onClick={() => setStyleIcon("search")}
          className={`p-2 hover:bg-slate-200 ${
            styleIcon === "search" && "text-blue-500"
          } transition-all duration-300 ease-in-out rounded-md`}
        >
          <GoSearch size="1.8em" />
        </Link>
        {user.username ? (
          <div>
            <button
              title="Tạo bài viết mới"
              onClick={() => setOpenDialogUploadPost(true)}
              className="p-2 bg-slate-200 transition-all duration-300 ease-in-out rounded-md"
            >
              <GoPlusCircle size="1.8em" />
            </button>
            <DialogUploadPost
              open={openDialogUploadPost}
              handleClose={() => setOpenDialogUploadPost(false)}
            />
          </div>
        ) : (
          <NoLoginDialog
            icon={<GoPlusCircle size="1.8em" />}
            dialogTitle="Đăng ký để đăng"
            dialogContent="Tham gia Threads để chia sẻ ý tưởng, đặt câu hỏi, đăng những suy nghĩ bất chợt và hơn thế nữa."
          />
        )}
        {user.username ? (
          <Link
            onClick={() => setStyleIcon("heart")}
            className={`p-2 hover:bg-slate-200 ${
              styleIcon === "heart" && "text-blue-500"
            } transition-all duration-300 ease-in-out rounded-md relative
            `}
            to="/notifications"
            title="Thông báo"
          >
            <GoHeart size="1.8em" />
            {notificationsRedux.length > 0 &&
              notificationsRedux.some(
                (notification) => notification.user.username !== user.username
              ) && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-2 h-2"></span>
              )}
          </Link>
        ) : (
          <NoLoginDialog
            icon={<GoHeart size="1.8em" />}
            dialogTitle="Bày tỏ nhiều hơn với Threads"
            dialogContent="Tham gia Threads để chia sẻ suy nghĩ, nắm bắt những gì đang diễn ra, theo dõi những người bạn yêu mến và hơn thế nữa."
          />
        )}
        {user.username ? (
          <Link
            onClick={() => setStyleIcon("profile")}
            className={`p-2 hover:bg-slate-200 ${
              styleIcon === "profile" && "text-blue-500"
            } transition-all duration-300 ease-in-out rounded-md`}
            to={`/profile/${user.username}`}
            title="Trang cá nhân"
          >
            <GoPerson size="1.8em" />
          </Link>
        ) : (
          <NoLoginDialog
            icon={<GoPerson size="1.8em" />}
            dialogTitle="Bày tỏ nhiều hơn với Threads"
            dialogContent="Tham gia Threads để chia sẻ suy nghĩ, nắm bắt những gì đang diễn ra, theo dõi những người bạn yêu mến và hơn thế nữa."
          />
        )}
      </div>
      <div className="hidden sm:flex flex-col items-center gap-5">
        {!user.username ? (
          <NoLoginDialog
            icon={<GoInfo size="1.8em" />}
            dialogTitle="Bày tỏ nhiều hơn với Threads"
            dialogContent="Tham gia Threads để chia sẻ suy nghĩ, nắm bắt những gì đang diễn ra, theo dõi những người bạn yêu mến và hơn thế nữa."
          />
        ) : (
          <SettingUserDialog />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
