import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import UserItem from "../UserItem/UserItem";
import NoLoginDialog from "../NoLoginDialog/NoLoginDialog";
import "swiper/css";
import "swiper/css/pagination";
import { Box, Chip, Modal } from "@mui/material";
import React from "react";
import { GoHeart, GoComment, GoShareAndroid } from "react-icons/go";
import { InfoUser } from "../../types/AuthType";
import { useSelector } from "react-redux";
import ButtonFollow from "../ButtonFollow/ButtonFollow";
import { AiFillPlusCircle } from "react-icons/ai";
import { RootState } from "../../app/store";
import { selectIsFollowing } from "../../selectors/followingSelectors";
import moment from "moment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
};

interface CommentProps {
  style?: string;
  user: Pick<
    InfoUser,
    | "id"
    | "avatarURL"
    | "username"
    | "displayName"
    | "introduction"
    | "follower"
    | "verified"
  >;
  content?: string;
  createdAt?: string;
}

const Comment = (props: CommentProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const user: InfoUser = useSelector((state: RootState) => state.auth);

  const isFollowing = useSelector((state: RootState) =>
    selectIsFollowing(state, props.user.id)
  );

  return (
    <div
      className={
        props.style
          ? props.style
          : "border border-slate-200 px-3 sm:px-5 py-3 sm:py-5 rounded-lg mb-2"
      }
    >
      <div className="flex flex-row items-start gap-2 sm:gap-3">
        <div className="relative cursor-pointer" onClick={handleOpen}>
          <img
            className="w-8 min-w-[32px] h-8 sm:w-[40px] sm:min-w-[40px] sm:h-[40px] rounded-full object-cover"
            src={props.user.avatarURL}
            alt="Avatar"
          />
          {user.username !== props.user.username && !isFollowing && (
            <div className="absolute bottom-0 right-0 bg-white rounded-[50%]">
              <AiFillPlusCircle size="1.2em" />
            </div>
          )}
        </div>
        <div className="w-full">
          <div className="flex flex-row items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <UserItem
                key={props.user.id}
                id={props.user.id}
                avatarURL={props.user.avatarURL}
                displayName={props.user.displayName}
                followersCount={props.user.follower}
                introduction={props.user.introduction}
                isVerified={props.user.verified}
                username={props.user.username}
              />
              <small>{moment(props.createdAt).fromNow()}</small>
            </div>
            <Chip
              label="Comment"
              variant="outlined"
              color="success"
              size="small"
            />
          </div>
          <p className="text-sm">{props.content}</p>
          {/* <Swiper
            effect={"coverflow"}
            slidesPerView={2}
            spaceBetween={10}
            grabCursor={true}
            pagination={true}
            modules={[Pagination]}
            className="overflow-hidden w-[70vh]"
          >
            <SwiperSlide>
              <img
                src="https://swiperjs.com/demos/images/nature-1.jpg"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "30px",
                }}
                alt="Slide 1"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="https://swiperjs.com/demos/images/nature-2.jpg"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "30px",
                }}
                alt="Slide 2"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="https://swiperjs.com/demos/images/nature-2.jpg"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "30px",
                }}
                alt="Slide 2"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="https://swiperjs.com/demos/images/nature-2.jpg"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "30px",
                }}
                alt="Slide 2"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="https://swiperjs.com/demos/images/nature-2.jpg"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "30px",
                }}
                alt="Slide 2"
              />
            </SwiperSlide>
          </Swiper> */}
          <div className="flex gap-5 mt-2">
            <div
            // className="flex items-center cursor-pointer gap-1 p-2 rounded-md hover:bg-slate-300 transition-all duration-300 ease-in-out"
            >
              <NoLoginDialog
                icon={<GoHeart />}
                type="react"
                dialogTitle="Bạn thích nội dung này ư? Bạn sẽ thích mê Threads."
                dialogContent="Hãy đăng ký để thích, trả lời và hơn thế nữa."
              />
            </div>
            <div
            // className="flex items-center cursor-pointer gap-1 p-2 rounded-md hover:bg-slate-300 transition-all duration-300 ease-in-out"
            >
              <NoLoginDialog
                icon={<GoComment />}
                type="react"
                dialogTitle="Đăng ký để trả lời"
                dialogContent="Chỉ còn một bước nữa là bạn có thể tham gia cuộc trò chuyện rồi."
              />
            </div>
            <div
            // className="flex items-center cursor-pointer gap-1 p-2 rounded-md hover:bg-slate-300 transition-all duration-300 ease-in-out"
            >
              <NoLoginDialog
                icon={<GoShareAndroid />}
                type="react"
                dialogTitle="Đăng ký để đăng lại"
                dialogContent="Bạn đã tiến thêm được một bước trong hành trình khơi mào cuộc trò chuyện."
              />
            </div>
          </div>
          <div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className="border border-slate-200 bg-white rounded-md shadow-lg p-5">
                  <div className="flex flex-col">
                    <Link to={`/profile/${props.user.username}`}>
                      <div className="flex flex-row items-center justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <p className="w-40 truncate text-[20px] font-bold">
                            {props.user.username}{" "}
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              style={{ color: "#74C0FC" }}
                            />
                          </p>
                          <p className="text-sm w-40 truncate">
                            {props.user.displayName}
                          </p>
                        </div>
                        <div>
                          <img
                            src={props.user.avatarURL}
                            alt="Avatar"
                            className="w-[80px] h-[80px] rounded-[50%] object-cover"
                          />
                        </div>
                      </div>
                    </Link>
                    <p className="text-sm mb-2 w-52 truncate">
                      {props.user.introduction || "Chưa có giới thiệu nào."}
                    </p>
                    <p className="text-sm mb-2">
                      {props.user.follower} người theo dõi
                    </p>
                    {user.username !== props.user.username && (
                      <ButtonFollow targetUserId={props.user.id} />
                    )}
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
