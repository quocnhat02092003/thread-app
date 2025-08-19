import React from "react";
import { Link } from "react-router-dom";
import UserItem from "../UserItem/UserItem";
import ButtonFollow from "../ButtonFollow/ButtonFollow";
import { InfoUser } from "../../types/AuthType";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";

interface UserListProps {
  id: string;
  avatarURL: string;
  username: string;
  displayName: string;
  follower: number;
  introduction: string;
  lastUser: boolean;
}

const UserList = (props: UserListProps) => {
  const user: InfoUser = useSelector((state: RootState) => state.auth);

  return (
    <div
      className={`px-5 py-3 my-2 ${
        props.lastUser ? "" : "border-b"
      } border-slate-300`}
    >
      <div className="flex flex-row items-start gap-3">
        <div className="">
          <Link to={`/profile/${props.username}`}>
            <img
              className="w-[50px] min-w-[50px] h-[50px] rounded-[50%] object-cover"
              src={props.avatarURL}
              alt="Avatar"
            />
          </Link>
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-between mb-2">
              <div className="flex flex-col gap-1">
                <UserItem
                  avatarURL={props.avatarURL}
                  displayName={props.displayName}
                  username={props.username}
                  id={props.id}
                  followersCount={props.follower}
                  introduction={props.introduction}
                  isVerified
                />
                <span className="text-sm w-40 truncate">
                  {props.displayName}
                </span>
              </div>
              {user.username && user.username !== props.username && (
                <ButtonFollow targetUserId={props.id} />
              )}
            </div>
            <p className="text-sm mb-2">{props.introduction}</p>
            <p className="text-sm mb-2">{props.follower} người theo dõi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
