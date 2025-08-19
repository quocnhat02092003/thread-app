import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "../app/store";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import AddInformationUser from "../pages/AddInfomationUser/AddInformationUser";
import { SnackbarProvider } from "notistack";
import PrivateRoute from "./PrivateRoute";
import HomeLayout from "../layouts/HomeLayout";
import Search from "../pages/Search/Search";
import Profile from "../pages/Profile/Profile";
import PostInfo from "../pages/Post/PostInfo";
import Notifications from "../pages/Notifications/Notifications";
import GuestRoute from "./GuestRouters";
import { BrowserRouter } from "react-router-dom";

const AppRouters: React.FC = () => {
  return (
    <div>
      <SnackbarProvider
        maxSnack={5}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              {/*Main layout*/}
              <Route path="/" element={<HomeLayout />}>
                <Route index element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/:id_user/post/:id_post" element={<PostInfo />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>
              {/*Add information use AuthLayout*/}
              <Route
                path="/add-information"
                element={
                  <PrivateRoute
                    element={
                      <AuthLayout>
                        <AddInformationUser />
                      </AuthLayout>
                    }
                  />
                }
              />

              {/*Auth layout*/}
              <Route
                path="/login"
                element={
                  <GuestRoute
                    element={
                      <AuthLayout>
                        <Login />
                      </AuthLayout>
                    }
                  />
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute
                    element={
                      <AuthLayout>
                        <Register />
                      </AuthLayout>
                    }
                  />
                }
              />
              <Route
                path="/forgot_password"
                element={
                  <GuestRoute
                    element={
                      <AuthLayout>
                        <Register />
                      </AuthLayout>
                    }
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        </Provider>
      </SnackbarProvider>
    </div>
  );
};

export default AppRouters;
