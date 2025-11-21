import React, { ChangeEvent, FormEvent } from "react";
import Input from "../../components/Input/InputText";
import Button from "@mui/material/Button";
import { AuthType, InfoUser } from "../../types/AuthType";
import { Link, useNavigate } from "react-router-dom";
import { InputAdornment, TextField } from "@mui/material";
import {
  AddInformation,
  GetUserInformation,
} from "../../services/authServices";
import { enqueueSnackbar } from "notistack";

const AddInformationUser: React.FC = () => {
  const navigate = useNavigate();

  const [infoUser, setInfoUser] = React.useState<InfoUser>({
    id: "",
    username: "",
    displayName: "",
    follower: 0,
    avatarURL: "",
    introduction: "",
    anotherPath: "",
    verified: false,
    createdAt: new Date(),
    needMoreInfoUser: false,
  });

  React.useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await GetUserInformation();
      setInfoUser(userInfo);
    };
    getUserInfo();
  }, [infoUser.id]);

  const [getInformationUser, setGetInformationUser] = React.useState<
    Pick<AuthType, "displayName" | "introduction" | "anotherPath" | "avatarURL">
  >({
    displayName: "",
    introduction: "",
    anotherPath: "",
    avatarURL:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Golden_tabby_and_white_kitten_n01.jpg/1200px-Golden_tabby_and_white_kitten_n01.jpg",
  });

  const [checkErrorDisplayName, setCheckErrorDisplayName] =
    React.useState<boolean>(true);

  const ValidateDisplayName = (displayName: string) => {
    displayName.trim().length > 0
      ? setCheckErrorDisplayName(false)
      : setCheckErrorDisplayName(true);
  };

  React.useEffect(() => {
    ValidateDisplayName(getInformationUser.displayName);
  }, [getInformationUser.displayName]);

  function HandleAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setGetInformationUser({
        ...getInformationUser,
        avatarURL: URL.createObjectURL(event.target.files[0]),
      });
    }
  }

  async function SubmitFormAddInformation(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    try {
      const response = await AddInformation(getInformationUser);
      enqueueSnackbar(response.message, { variant: "success" });
      navigate("/");
    } catch (error: any) {
      error.response &&
        enqueueSnackbar("Lỗi khi thêm thông tin", { variant: "error" });
    }
  }

  return (
    <div className="add-information-user px-4 sm:px-0 overflow-y-auto">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-5 lg:gap-10">
          <div className="w-full lg:w-auto">
            <h1 className="text-lg sm:text-xl lg:text-2xl text-center lg:text-left mb-3">
              Bạn sẽ được hiển thị dưới dạng
            </h1>
            <div className="border border-gray-400 p-4 sm:p-5 rounded-3xl">
              <div className="flex flex-col gap-10">
                <div className="flex items-start gap-10 h-[250px]">
                  <div>
                    <div className="w-[300px]">
                      <div className="w-[250px]">
                        <h2 className="truncate">
                          {getInformationUser.displayName
                            ? getInformationUser.displayName
                            : "Pham Quoc Nhat"}
                        </h2>
                        <p className="truncate">{infoUser.username}</p>
                      </div>
                      <div className="mt-5">
                        <small className="line-clamp-[6] font-bold">
                          {getInformationUser.introduction
                            ? getInformationUser.introduction
                            : "Lorem Ipsum is simply dummy text " +
                              "of the printing and typesetting industry. " +
                              "Lorem Ipsum has been the industry's " +
                              "standard dummy text ever since the 1500s, " +
                              "when an unknown printer took a galley of" +
                              "type and scrambled it to make a " +
                              "type specimen book."}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center w-[150px] h-[150px]">
                    <img
                      className="object-cover rounded-xl mb-5 w-[150px] h-[150px]"
                      src={getInformationUser.avatarURL}
                      alt="avatar"
                    />
                    <input
                      onChange={(event) => HandleAvatar(event)}
                      className="hidden"
                      id="upload-photo"
                      type="file"
                      accept="image/jpeg"
                    />
                    <p>
                      <label
                        className="border p-2 cursor-pointer border-black rounded-lg hover:bg-black transition ease-in-out duration-200 hover:text-white"
                        htmlFor="upload-photo"
                      >
                        Chọn ảnh đại diện
                      </label>
                    </p>
                  </div>
                </div>
                <div className="flex justify-around">
                  <div className="border-r border-gray-500 pr-20">
                    <p className="truncate hover:underline cursor-pointer">
                      999 người theo dõi
                    </p>
                  </div>
                  <div className="text-blue-900 max-w-[150px] truncate">
                    <Link
                      target="_blank"
                      to={
                        getInformationUser.anotherPath
                          ? getInformationUser.anotherPath
                          : "https://example.com"
                      }
                    >
                      {getInformationUser.anotherPath
                        ? getInformationUser.anotherPath
                        : "Liên kết khác"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-fit gap-5">
            <h2 className="whitespace-nowrap">Thêm thông tin hồ sơ của bạn</h2>
            <form
              onSubmit={(event: FormEvent<HTMLFormElement>) =>
                SubmitFormAddInformation(event)
              }
              className="w-full flex flex-col gap-5"
              method="post"
            >
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setGetInformationUser({
                    ...getInformationUser,
                    displayName: e.target.value,
                  })
                }
                type="text"
                placeholder="Tên hiển thị"
              />
              <TextField
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setGetInformationUser({
                    ...getInformationUser,
                    anotherPath: e.target.value,
                  })
                }
                label="Liên kết khác"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">https://</InputAdornment>
                    ),
                  },
                }}
              />
              <textarea
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setGetInformationUser({
                    ...getInformationUser,
                    introduction: e.target.value,
                  })
                }
                className="px-4 py-2 max-h-[200px] min-h-[100px] outline-0 rounded-xl"
                placeholder="Phần giới thiệu, ..."
              />
              <Button
                type="submit"
                fullWidth
                size="small"
                disabled={checkErrorDisplayName}
                sx={{
                  paddingY: 1,
                }}
                variant="contained"
              >
                Hoàn thành
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInformationUser;
