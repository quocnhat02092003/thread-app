import * as React from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { ChangePasswordUser } from "../../../services/settingAccountServices";

interface SecuritySettings {
  twoFactorAuth: boolean;
  profileVisibility: "public" | "friends" | "private";
}

interface SecurityTabProps {
  settings: SecuritySettings;
  onSettingsChange: (settings: SecuritySettings) => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [localSettings, setLocalSettings] =
    React.useState<SecuritySettings>(settings);
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = React.useState(false);
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange =
    (setting: keyof SecuritySettings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSettings = {
        ...localSettings,
        [setting]: event.target.checked,
      };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
    };

  const handleSelectChange =
    (setting: keyof SecuritySettings) => (event: any) => {
      const newSettings = {
        ...localSettings,
        [setting]: event.target.value,
      };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
    };

  const handlePasswordChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const ValidatePassword = (password: string): string | null => {
    const patternTestPassword: RegExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/;
    if (
      password &&
      !patternTestPassword.test(password) &&
      password.length >= 8
    ) {
      return "Password yêu cầu chữ hoa, chữ thường, có số, không chứa ký tự đặc biệt";
    } else if (password && password.length < 8) {
      return "Độ dài password phải lớn hơn hoặc bằng 8 ký tự";
    }
    return null;
  };

  const handleChangePassword = () => {
    const newPasswordError = ValidatePassword(passwordData.newPassword);
    const passwordError = ValidatePassword(passwordData.currentPassword);
    const confirmPasswordError = ValidatePassword(passwordData.confirmPassword);
    if (newPasswordError || passwordError || confirmPasswordError) {
      enqueueSnackbar(
        newPasswordError || passwordError || confirmPasswordError,
        { variant: "error" }
      );
      return;
    }
    const ChangePassword = async () => {
      try {
        const response = await ChangePasswordUser({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        });
        if (response) {
          enqueueSnackbar("Đổi mật khẩu thành công!", { variant: "success" });
          setChangePasswordOpen(false);
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch (error: any) {
        error.response &&
          enqueueSnackbar(error.response.data, { variant: "error" });
        setChangePasswordOpen(true);
      }
    };
    ChangePassword();
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account");
    setDeleteAccountOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 2 }}>
      <Typography variant="h6" display="flex" alignItems="center" gap={1}>
        {/* <SecurityIcon />  */}
        Cài đặt bảo mật
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={localSettings.twoFactorAuth}
            onChange={handleSettingChange("twoFactorAuth")}
          />
        }
        label={
          <Box>
            <p>Xác thực hai yếu tố (2FA) - Đang phát triển</p>
            <p>Tăng cường bảo mật với xác thực qua SMS hoặc ứng dụng</p>
          </Box>
        }
      />

      <FormControl fullWidth>
        <InputLabel>Hiển thị hồ sơ</InputLabel>
        <Select
          value={localSettings.profileVisibility}
          onChange={handleSelectChange("profileVisibility")}
          label="Hiển thị hồ sơ"
        >
          <MenuItem value="public">
            <Box>
              <Typography variant="body1">Công khai</Typography>
              <Typography variant="body2" color="text.secondary">
                Mọi người có thể xem hồ sơ của bạn
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem value="friends">
            <Box>
              <Typography variant="body1">Chỉ bạn bè</Typography>
              <Typography variant="body2" color="text.secondary">
                Chỉ bạn bè mới có thể xem hồ sơ
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem value="private">
            <Box>
              <Typography variant="body1">Riêng tư</Typography>
              <Typography variant="body2" color="text.secondary">
                Chỉ bạn mới có thể xem hồ sơ
              </Typography>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      <Box mt={2} display="flex" flexDirection="column" gap={2}>
        <button
          className="border py-1 px-2 border-black rounded-lg hover:bg-black transition ease-in-out duration-200 hover:text-white"
          onClick={() => setChangePasswordOpen(true)}
        >
          Đổi mật khẩu
        </button>

        <button
          className="border py-1 px-2 border-red-600 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition duration-200"
          onClick={() => setDeleteAccountOpen(true)}
        >
          Xóa tài khoản
        </button>
      </Box>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Mật khẩu hiện tại"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange("currentPassword")}
              fullWidth
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange("newPassword")}
              fullWidth
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange("confirmPassword")}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <button
            className="py-1 px-2"
            onClick={() => setChangePasswordOpen(false)}
          >
            Hủy
          </button>
          <button
            className="border py-1 px-2 border-black rounded-lg hover:bg-black transition ease-in-out duration-200 hover:text-white"
            onClick={handleChangePassword}
          >
            Đổi mật khẩu
          </button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle color="error">Xác nhận xóa tài khoản</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn
            tác và tất cả dữ liệu của bạn sẽ bị mất vĩnh viễn.
          </Typography>
        </DialogContent>
        <DialogActions>
          <button
            className="py-1 px-2"
            onClick={() => setDeleteAccountOpen(false)}
          >
            Hủy
          </button>
          <button
            className="border py-1 px-2 border-red-600 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition duration-200"
            onClick={handleDeleteAccount}
          >
            Xóa tài khoản
          </button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecurityTab;
