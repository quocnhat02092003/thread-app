import React, { ChangeEvent } from "react";
import Input from "../../components/Input/InputText";
import Button from "@mui/material/Button";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { AuthType } from "../../types/AuthType";
import { LoginUser } from "../../services/authServices";
import { enqueueSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth/AuthSlice";

const Login: React.FC = () => {
  //Dispatch
  const dispatch = useDispatch();

  //Get data user
  const [infomationUserLogin, setInfomationUserLogin] = React.useState<
    Pick<AuthType, "username" | "password">
  >({
    username: "",
    password: "",
  });

  const [loadingButtonLogin, setLoadingButtonLogin] =
    React.useState<boolean>(false);

  const navigate: NavigateFunction = useNavigate();

  async function HandleSubmitFormLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setLoadingButtonLogin(true);
    try {
      const response = await LoginUser(infomationUserLogin);
      enqueueSnackbar(response.message, { variant: "success" });
      dispatch(
        login({
          user: {
            id: response.id,
            username: response.username,
            needMoreInfoUser: response.needMoreInfoUser,
          },
        })
      );
      if (response.needMoreInfoUser) {
        navigate("/add-information");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      enqueueSnackbar(error.response.data, { variant: "error" });
    } finally {
      setLoadingButtonLogin(false);
    }
  }

  return (
    <div className="login-form">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center w-fit gap-5">
          <h2>Đăng nhập bằng tài khoản Threads</h2>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
              HandleSubmitFormLogin(event)
            }
            className="w-full flex flex-col gap-5"
            method="post"
          >
            <div className="w-full">
              <Input
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setInfomationUserLogin({
                    ...infomationUserLogin,
                    username: event.target.value,
                  })
                }
                type="text"
                placeholder="Tên người dùng, số điện thoại hoặc email"
              />
            </div>
            <div className="w-full">
              <Input
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setInfomationUserLogin({
                    ...infomationUserLogin,
                    password: event.target.value,
                  })
                }
                type="password"
                placeholder="Mật khẩu"
              />
            </div>
            <Button
              type="submit"
              fullWidth
              size="small"
              disabled={
                !infomationUserLogin.username || !infomationUserLogin.password
              }
              sx={{
                paddingY: 1,
              }}
              loading={loadingButtonLogin}
              variant="contained"
            >
              Đăng nhập
            </Button>
          </form>
          <div className="w-full text-right">
            <p>
              Bạn chưa có tài khoản?{" "}
              <Link className="text-blue-500" to="/register">
                Đăng kí tại đây.
              </Link>
            </p>
          </div>
          <div className="w-full text-center">
            <p>hoặc</p>
            <p className="mt-2">
              <Link className="text-blue-500" to="/forgot_password">
                Quên mật khẩu?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
