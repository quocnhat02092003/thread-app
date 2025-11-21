import { PiThreadsLogoLight, PiTrademarkRegisteredLight } from "react-icons/pi";
import { Link } from "react-router-dom";

const NoLoginCard = () => {
  return (
    <div className="flex flex-col items-center justify-center border bg-gray-100 w-full max-w-[350px] rounded-3xl px-4 py-4">
      <h3 className="text-base sm:text-lg font-semibold">
        Đăng nhập hoặc đăng ký Threads
      </h3>
      <small className="text-center text-xs sm:text-sm">
        Xem mọi người đang nói về điều gì và tham gia cuộc trò chuyện.
      </small>
      <Link to="/login">
        <button className="flex items-center gap-1 bg-blue-200 px-4 py-2 rounded-md my-2 text-sm">
          <PiThreadsLogoLight size="2em" />{" "}
          <p>Tiếp tục bằng tài khoản Threads</p>
        </button>
      </Link>
      <small>Hoặc</small>
      <Link to="/register">
        <button className="flex items-center gap-1 bg-blue-200 px-4 py-2 rounded-md my-2 text-sm">
          <PiTrademarkRegisteredLight size="2em" />
          <p>Đăng ký tài khoản Threads</p>
        </button>
      </Link>
    </div>
  );
};

export default NoLoginCard;
