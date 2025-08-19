import React from "react";
import "./App.css";
import AppRouters from "./routers/AppRouters";
import { GetUserInformation } from "./services/authServices";
import { useDispatch } from "react-redux";
import { login } from "./features/auth/AuthSlice";

function App() {
  return <AppRouters />;
}

export default App;
