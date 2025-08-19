import { AiFillPlusCircle } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import UserItem from "../UserItem/UserItem";
import NoLoginDialog from "../NoLoginDialog/NoLoginDialog";
import "swiper/css";
import "swiper/css/pagination";
import { Box, Modal } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import PostActions from "./PostActions";
import moment from "moment";
import { GoHeart, GoComment, GoShareAndroid } from "react-icons/go";
import { InfoUser } from "../../types/AuthType";
import ButtonFollow from "../ButtonFollow/ButtonFollow";
import { RootState } from "../../app/store";
import { selectIsFollowing } from "../../selectors/followingSelectors";
import { selectIsLikedPost } from "../../selectors/likedPostSelectors";

interface PostProps {
  style?: string;
  avatarURL: string;
  username: string;
  displayName: string;
  introduction: string;
  followersCount: number;
  isVerified?: boolean;
  likeCount: number;
  isLiked?: boolean;
  commentCount: number;
  shareCount: number;
  repostCount: number;
  postId: string;
  postContent?: string;
  postImage?: [];
  postUser: {
    id: string;
    username: string;
    displayName: string;
    avatarURL: string;
  };
  postCreatedAt: string;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
};

const Post = (props: PostProps) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const user: InfoUser = useSelector((state: RootState) => state.auth);

  const isFollowing = useSelector((state: RootState) =>
    selectIsFollowing(state, props.postUser.id)
  );

  return (
    <div
      className={
        props.style
          ? props.style
          : "border border-slate-200 px-5 py-5 rounded-lg mb-2"
      }
    >
      <div className="flex flex-row items-start gap-3">
        <div className="relative cursor-pointer" onClick={handleOpen}>
          <img
            className="w-[50px] min-w-[50px] h-[50px] rounded-[50%] object-cover"
            src={props.avatarURL || "https://i.pravatar.cc/150?img=3"}
            alt="Avatar"
          />
          {user.username !== props.username && !isFollowing && (
            <div className="absolute bottom-0 right-0 bg-white rounded-[50%]">
              <AiFillPlusCircle size="1.2em" />
            </div>
          )}
        </div>
        <div className="w-full ">
          <div className="flex flex-row items-center gap-2">
            <UserItem
              id={props.postUser.id}
              avatarURL={props.avatarURL}
              displayName={props.displayName}
              followersCount={props.followersCount}
              introduction={props.introduction}
              isVerified={props.isVerified}
              username={props.username}
            />
            <small className="text-slate-600">
              {moment(props.postCreatedAt)
                .utcOffset(420)
                .startOf("day")
                .fromNow()}
            </small>
          </div>
          {props.postContent && <p className="text-sm">{props.postContent}</p>}
          {props.postImage?.length !== 0 && (
            <Swiper
              effect={"coverflow"}
              slidesPerView={2}
              spaceBetween={10}
              grabCursor={true}
              pagination={true}
              modules={[Pagination]}
              className="w-[70vh] overflow-hidden mt-4"
            >
              {props.postImage?.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "30px",
                    }}
                    alt={`Slide ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {!user.username ? (
            <div className="flex items-center gap-5 mt-2">
              <NoLoginDialog
                likes={props.likeCount || 0}
                icon={<GoHeart />}
                type="react"
                dialogTitle="Bạn thích nội dung này ư? Bạn sẽ thích mê Threads."
                dialogContent="Hãy đăng ký để thích, trả lời và hơn thế nữa."
              />
              <NoLoginDialog
                comments={0}
                icon={<GoComment />}
                type="react"
                dialogTitle="Đăng ký để trả lời"
                dialogContent="Chỉ còn một bước nữa là bạn có thể tham gia cuộc trò chuyện rồi."
              />
              <NoLoginDialog
                shares={props.shareCount || 0}
                icon={<GoShareAndroid />}
                type="react"
                dialogTitle="Đăng ký để đăng lại"
                dialogContent="Bạn đã tiến thêm được một bước trong hành trình khơi mào cuộc trò chuyện."
              />
            </div>
          ) : (
            <PostActions
              key={props.postId}
              postId={props.postId}
              postUsername={props.username}
              likes={props.likeCount}
              comments={props.commentCount}
              shares={props.shareCount}
            />
          )}
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
                    <Link to={`/profile/${props.username}`}>
                      <div className="flex flex-row items-center justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <p className="w-40 truncate text-[20px] font-bold">
                            {props.username}{" "}
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              style={{ color: "#74C0FC" }}
                            />
                          </p>
                          <p className="text-sm w-40 truncate">
                            {props.displayName}
                          </p>
                        </div>
                        <div>
                          <img
                            src={
                              props.avatarURL ||
                              "https://i.pravatar.cc/150?img=3"
                            }
                            alt="Avatar"
                            className="w-[80px] h-[80px] rounded-[50%] object-cover"
                          />
                        </div>
                      </div>
                    </Link>
                    <p className="text-sm mb-2 w-52 truncate">
                      {props.introduction ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                    </p>
                    <p className="text-sm mb-2">
                      {props.followersCount} người theo dõi
                    </p>
                    {user.username && user.username !== props.username && (
                      <ButtonFollow targetUserId={props.postUser.id} />
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

export default Post;
