import { Dialog, DialogContent, styled } from "@mui/material";
import Thread_Logo from "../../assets/images/Threads-app-Logo.png";
import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { PiThreadsLogoLight, PiTrademarkRegisteredLight } from "react-icons/pi";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface NoLoginDialogProps {
  icon: ReactElement;
  dialogTitle?: string;
  dialogContent?: string;
  type?: string;
  likes?: number;
  comments?: number;
  shares?: number;
}

const NoLoginDialog = (props: NoLoginDialogProps) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleClickOpen}
        className="p-2 hover:bg-slate-200 transition-all duration-300 ease-in-out rounded-md"
      >
        <div className="flex items-center">
          {props.icon}
          {props.type === "react" && (
            <small className="ml-1">
              {props.likes || props.comments || props.shares}
            </small>
          )}
        </div>
      </button>
      <BootstrapDialog onClose={handleClose} open={open}>
        <DialogContent className="text-center">
          {props.type === "react" && props.icon}
          <h1>{props.dialogTitle}</h1>
          <p className="text-md text-slate-500 mb-5">{props.dialogContent}</p>
          <div className="w-full">
            <button className="mb-4">
              <Link
                className="flex flex-row gap-2 items-center justify-center px-8 py-5 border rounded-lg"
                to="/login"
              >
                <PiThreadsLogoLight size="2em" />
                <p>Tiếp tục bằng tài khoản Threads</p>
              </Link>
            </button>
            <button className="mb-4">
              <Link
                className="flex flex-row gap-2 items-center justify-center px-8 py-5 border rounded-lg"
                to="/register"
              >
                <PiTrademarkRegisteredLight size="2em" />
                <p>Đăng kí ngay vào Threads</p>
              </Link>
            </button>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

export default NoLoginDialog;
