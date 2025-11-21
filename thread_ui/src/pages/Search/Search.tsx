import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import UserList from "../../components/UserList/UserList";
import useDebounce from "../../hook/useDebounce";
import { SearchUserByQuery } from "../../services/searchServices";

const Search: React.FC = () => {
  document.title = "Tìm kiếm | Threads.net";

  const [getUsernameForSearch, setGetUsernameForSearch] =
    React.useState<string>("");

  const [userResponse, setUserResponse] = React.useState<any[]>([]);

  const searchDebounced = useDebounce({
    value: getUsernameForSearch,
    delay: 1000,
  });

  React.useEffect(() => {
    const searchUser = async () => {
      try {
        const response = await SearchUserByQuery(searchDebounced as string);
        setUserResponse(response);
      } catch (err) {
        setUserResponse([]);
      }
    };

    searchUser();
  }, [searchDebounced]);
  return (
    <div className="w-full">
      <div className="text-center my-3 sm:my-5">
        <h3 className="text-lg sm:text-xl font-semibold">Tìm kiếm</h3>
      </div>
      <div className="w-full px-3 sm:px-5 py-3 sm:py-5 border-0 sm:border border-slate-200 rounded-none sm:rounded-md">
        <TextField
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => setGetUsernameForSearch(e.target.value)}
          label="Tìm kiếm"
          id="outlined-start-adornment"
          sx={{ width: "100%" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputAdornment>
              ),
            },
          }}
        />
        <div className="mt-5">
          {!getUsernameForSearch ? (
            <p className="text-slate-500">Gợi ý theo dõi</p>
          ) : (
            <p className="text-slate-500">
              Kết quả tìm kiếm cho: {getUsernameForSearch}
            </p>
          )}
          {userResponse.length > 0 &&
            userResponse.map((user, index) => (
              <UserList
                key={index}
                id={user.id}
                avatarURL={user.avatarURL}
                displayName={user.displayName}
                follower={user.follower}
                introduction={user.introduction}
                username={user.username}
                lastUser={index === userResponse.length - 1 ? true : false}
              />
            ))}
          {getUsernameForSearch && userResponse.length >= 0 && (
            <p className="text-slate-500 text-center">
              {userResponse.length} kết quả tìm kiếm
            </p>
          )}
          {!getUsernameForSearch && (
            <p className="text-slate-500 text-center my-5">
              Vui lòng nhập tên người dùng để tìm kiếm
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
