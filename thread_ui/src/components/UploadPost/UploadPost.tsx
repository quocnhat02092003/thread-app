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
          : "border border-slate-200 px-5 py-5 rounded-lg mb-2 overflow-hidden"
      }
    >
      <div className="flex flex-row items-center gap-3">
        <div className="">
          <Link to={`/profile/${user.username}`}>
            <img
              className="w-[50px] min-w-[50px] h-[50px] rounded-[50%] object-cover"
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
          className="border border-slate-300 px-2 py-2 rounded-lg"
        >
          <small>Đăng</small>
        </button>
        <DialogUploadPost open={open} handleClose={handleClose} />
      </div>
    </div>
  );
};

export default UploadPost;
