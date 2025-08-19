import React from "react";
import image_auth_login from "../assets/images/image.png";
import { enqueueSnackbar } from "notistack";
interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  React.useEffect(() => {
    const handleOffline = () => {
      enqueueSnackbar(
        "Bạn đã mất kết nối Internet. Vui lòng kiểm tra lại kết nối của bạn.",
        {
          variant: "error",
        }
      );
    };

    window.addEventListener("offline", handleOffline);

    // Cleanup khi component unmount
    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <div className="auth-header">
        {/*Header*/}
        <img className="mt-[-50px]" src={image_auth_login} alt="Image" />
      </div>
      <div className="auth-body">
        {/*Main Content*/}
        <main>{children}</main>
      </div>
      <div className="auth-footer">{/*Footer*/}</div>
    </div>
  );
};

export default AuthLayout;
