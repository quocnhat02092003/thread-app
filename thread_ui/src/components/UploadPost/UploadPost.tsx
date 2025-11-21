import React from "react";
import { Link } from "react-router-dom";
import DialogUploadPost from "./DialogUploadPost";
import { useSelector } from "react-redux";
import { InfoUser } from "../../types/AuthType";

interface UploadPostProps {
  style?: string;
}

const UploadPost = (props: UploadPostProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const user: InfoUser = useSelector((state: any) => state.auth);
  return (
    <div
      className={
        props.style
          ? props.style
          : "border border-slate-200 px-3 sm:px-5 py-3 sm:py-5 rounded-lg mb-2 overflow-hidden"
      }
    >
      <div className="flex flex-row items-center gap-2 sm:gap-3">
        <div className="">
          <Link to={`/profile/${user.username}`}>
            <img
              className="w-10 min-w-[40px] h-10 sm:w-[50px] sm:min-w-[50px] sm:h-[50px] rounded-full object-cover"
              src={user.avatarURL}
              alt="Avatar"
            />
          </Link>
        </div>
        <div onClick={handleOpen} className="w-full cursor-text">
          <p className="text-sm text-slate-500">Có gì mới?</p>
        </div>
        <button
          onClick={handleOpen}
          className="border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap"
        >
          Đăng
        </button>
        <DialogUploadPost open={open} handleClose={handleClose} />
      </div>
    </div>
  );
};

export default UploadPost;
