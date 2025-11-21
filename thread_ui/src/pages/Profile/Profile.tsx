import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Link, Params, useParams } from "react-router-dom";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { GetDataProfileUser } from "../../services/featureServices";
import { CircularProgress } from "@mui/material";
import NoData from "./NoData";
import UploadPost from "../../components/UploadPost/UploadPost";
import { useSelector, useDispatch } from "react-redux";
import Post from "../../components/Post/Post";
import { clearPostUpload } from "../../features/post/PostUploadSlice";
import { PostData } from "../../types/PostType";
import { ProfileData } from "../../types/ProfileType";
import { InfoUser } from "../../types/AuthType";
import ButtonFollow from "../../components/ButtonFollow/ButtonFollow";

const Profile = () => {
  let param: Readonly<Params<string>> = useParams();

  const dispatch = useDispatch();

  const newPost: PostData = useSelector((state: any) => state.postUpload);

  const [type, setType] = React.useState<string>("thread");
  const [loading, setLoading] = React.useState<boolean>(true);

  const [dataProfile, setDataProfile] = React.useState<ProfileData>();

  const user: InfoUser = useSelector((state: any) => state.auth);

  React.useEffect(() => {
    const userData = GetDataProfileUser(param.username || "");
    setLoading(true);
    userData
      .then((data) => {
        setLoading(false);
        setDataProfile(data);
        console.log("Fetched user data:", data);
        document.title = `${data.displayName} (@${data.username}) | Threads, bày tỏ nhiều hơn`;
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [param]);

  const tabs: {
    label: string;
    value: string;
  }[] = [
    { label: "Thread", value: "thread" },
    { label: "File phương tiện", value: "media" },
    { label: "Thread đăng lại", value: "reposts" },
  ];

  React.useEffect(() => {
    if (newPost && newPost.id && dataProfile?.post && dataProfile.id) {
      // add if post doesn't exist and is from current user
      const isCurrentUserPost =
        newPost.user?.username === dataProfile?.username;
      const postExists = dataProfile.post?.some(
        (post: PostData) => post.id === newPost.id
      );

      if (isCurrentUserPost && !postExists) {
        setDataProfile((prev: any) => ({
          ...prev,
          post: [newPost, ...prev.post],
        }));
        dispatch(clearPostUpload());
      }
    }
  }, [newPost, dataProfile?.id, dataProfile?.username]);

  return (
    <div className="profile w-full">
      <div className="text-center my-3 sm:my-5">
        <h3 className="text-lg sm:text-xl font-semibold">Trang cá nhân</h3>
      </div>

      <div className="w-full px-2 sm:px-4 border-0 sm:border border-slate-200 rounded-none sm:rounded-md">
        {loading ? (
          <div className="flex justify-center items-center h-[80vh]">
            <CircularProgress color="success" />
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-3 sm:gap-5 mx-0 sm:mx-2 px-3 sm:px-5 py-3 sm:py-5">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {dataProfile?.displayName}
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      style={{ color: "#74C0FC", marginLeft: "5px" }}
                    />
                  </h3>
                  <p className="text-sm sm:text-base">
                    {dataProfile?.username}
                  </p>
                </div>
                <div>
                  <img
                    className="w-16 min-w-[64px] h-16 sm:w-[100px] sm:min-w-[100px] sm:h-[100px] rounded-full object-cover"
                    src={dataProfile?.avatarURL}
                    alt="Avatar"
                  />
                </div>
              </div>
              <div>
                <p className="mt-2 mb-5">{dataProfile?.introduction}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <p className="mt-2 mb-3 sm:mb-5 w-full sm:w-[40vh] truncate text-sm sm:text-base">
                  {dataProfile?.follower} người theo dõi •{" "}
                  <Link to={dataProfile?.anotherPath || "#"}>
                    {dataProfile?.anotherPath}
                  </Link>
                </p>
                <div className="flex gap-3 sm:gap-5 items-center">
                  <FontAwesomeIcon
                    icon={faChartLine}
                    size="lg"
                    title="Thông tin chi tiết"
                  />
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </div>
              </div>
              {user.username && user.username !== dataProfile?.username && (
                <div className="grid grid-cols-2 gap-5">
                  <ButtonFollow targetUserId={dataProfile?.id || ""} />
                  <button className="border border-slate-300 px-3 py-2 rounded-lg mt-3 transition duration-200">
                    <p>Nhắc đến</p>
                  </button>
                </div>
              )}
            </div>
            <div className="mt-5 grid grid-cols-3 text-center">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setType(tab.value)}
                  style={{ fontWeight: type === tab.value ? "bold" : "normal" }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-5">
              {type === "thread" && (
                <div>
                  {dataProfile?.username === user.username && (
                    <UploadPost style="w-full border-y px-5 py-5" />
                  )}
                  {!dataProfile?.post && (
                    <NoData message="Chưa có thread nào." />
                  )}
                  {/* Assuming you will map through posts here */}
                  {dataProfile?.post &&
                    dataProfile?.post.map((post: any, index) => (
                      <Post
                        style={`w-full ${
                          index === 0 ? "" : "border-t"
                        } px-5 py-5`}
                        key={post.id}
                        avatarURL={post.user.avatarURL}
                        commentCount={post.commentCount}
                        displayName={post.user.displayName}
                        followersCount={post.user.follower}
                        introduction={post.user.introduction}
                        likeCount={post.likeCount}
                        postCreatedAt={post.createdAt}
                        isLiked={post.isLiked}
                        postId={post.id}
                        postUser={{
                          id: post.user.id,
                          avatarURL: post.user.avatarURL,
                          displayName: post.user.displayName,
                          username: post.user.username,
                        }}
                        repostCount={post.reupCount}
                        shareCount={post.shareCount}
                        username={post.user.username}
                        isVerified={post.user.verified}
                        postContent={post.content}
                        postImage={post.images}
                      />
                    ))}
                </div>
              )}

              {type === "media" &&
                (dataProfile?.post && dataProfile.post.length > 0 ? (
                  dataProfile.post.map((post: any, index) =>
                    post.images.length === 0 ? null : (
                      <Post
                        style={`w-full ${
                          index === 0 ? "" : "border-t"
                        } px-5 py-5`}
                        key={post.id}
                        avatarURL={post.user.avatarURL}
                        commentCount={post.commentCount}
                        displayName={post.user.displayName}
                        followersCount={post.user.follower}
                        introduction={post.user.introduction}
                        likeCount={post.likeCount}
                        postCreatedAt={post.createdAt}
                        postId={post.id}
                        postUser={{
                          avatarURL: post.user.avatarURL,
                          displayName: post.user.displayName,
                          username: post.user.username,
                          id: post.user.id,
                        }}
                        repostCount={post.reupCount}
                        shareCount={post.shareCount}
                        username={post.user.username}
                        isVerified={post.user.verified}
                        postContent={post.content}
                        postImage={post.images}
                      />
                    )
                  )
                ) : (
                  <NoData message="Chưa có file phương tiện nào." />
                ))}
              {type === "reposts" && (
                <NoData message="Chưa có bài đăng lại nào." />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
