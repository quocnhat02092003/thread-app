import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Box,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Snackbar,
} from "@mui/material";
// import { Close as CloseIcon } from "@mui/icons-material";
import { InfoUser } from "../../types/AuthType";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import PersonalInfoTab from "./tabs/PersonalInfoTab";
import SecurityTab from "./tabs/SecurityTab";
import NotificationsTab from "./tabs/NotificationsTab";
import AppearanceTab from "./tabs/AppearanceTab";
import { UpdateDataUser } from "../../services/settingAccountServices";
import { enqueueSnackbar } from "notistack";
import { LogoutUser } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import { logout, updateUser } from "../../features/auth/AuthSlice";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
    minHeight: "500px",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
    justifyContent: "space-between",
  },
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(2),
    maxWidth: "800px",
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

// Define all settings interfaces
interface SecuritySettings {
  twoFactorAuth: boolean;
  profileVisibility: "public" | "friends" | "private";
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  friendRequests: boolean;
  comments: boolean;
  mentions: boolean;
  newFollowers: boolean;
}

interface AppearanceSettings {
  darkMode: boolean;
  themeMode: "light" | "dark" | "auto";
  language: string;
  timezone: string;
  fontSize: number;
  primaryColor: string;
  compactMode: boolean;
}

const SettingUserDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [logOutOpen, setLogoutOpen] = React.useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  // Settings state
  const [securitySettings, setSecuritySettings] =
    React.useState<SecuritySettings>({
      twoFactorAuth: false,
      profileVisibility: "public",
    });

  const [notificationSettings, setNotificationSettings] =
    React.useState<NotificationSettings>({
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      marketingEmails: false,
      securityAlerts: true,
      friendRequests: true,
      comments: true,
      mentions: true,
      newFollowers: false,
    });

  const [appearanceSettings, setAppearanceSettings] =
    React.useState<AppearanceSettings>({
      darkMode: false,
      themeMode: "light",
      language: "vi",
      timezone: "Asia/Ho_Chi_Minh",
      fontSize: 16,
      primaryColor: "#2196f3",
      compactMode: false,
    });

  const user: InfoUser = useSelector((state: RootState) => state.auth);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm(
        "Bạn có thay đổi chưa lưu. Bạn có chắc muốn đóng không?"
      );
      if (!confirmClose) return;
    }
    setOpen(false);
    setTabValue(0);
    setHasChanges(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePersonalInfoSave = (data: any) => {
    // console.log("Saving personal info:", data);
    const UpdatePersonalData = async () => {
      try {
        const response = await UpdateDataUser(data);
        if (response) {
          enqueueSnackbar(response.message, { variant: "success" });
          // Update user data in Redux store
          dispatch(updateUser(data));
        }
      } catch (error: any) {
        error.response &&
          enqueueSnackbar(error.response.data, { variant: "error" });
      }
    };
    UpdatePersonalData();
    setHasChanges(true);
  };

  const handleSecuritySettingsChange = (settings: SecuritySettings) => {
    setSecuritySettings(settings);
    setHasChanges(true);
  };

  const handleNotificationSettingsChange = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    setHasChanges(true);
  };

  const handleAppearanceSettingsChange = (settings: AppearanceSettings) => {
    setAppearanceSettings(settings);
    setHasChanges(true);
  };

  const handleSaveAllChanges = () => {
    //API calls to save all settings
    // console.log("Saving all settings:", {
    //   security: securitySettings,
    //   notifications: notificationSettings,
    //   appearance: appearanceSettings,
    // });

    setShowSuccess(true);
    setHasChanges(false);
  };

  const handleLogout = async () => {
    try {
      const response = await LogoutUser();
      if (response) {
        enqueueSnackbar(response.message, { variant: "success" });
        navigate("/login");
        dispatch(logout());
      }
    } catch (error: any) {
      error.response &&
        enqueueSnackbar(error.response.data, { variant: "error" });
    }
  };

  const tabLabels = ["Thông tin cá nhân", "Bảo mật", "Thông báo", "Giao diện"];

  return (
    <React.Fragment>
      <Avatar
        src={user.avatarURL}
        onClick={handleClickOpen}
        className="cursor-pointer"
        sx={{ width: 40, height: 40 }}
      />

      <BootstrapDialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" component="h2" fontWeight="bold">
              Cài đặt tài khoản
            </Typography>
            <IconButton onClick={handleClose} size="small">
              {/* <CloseIcon /> */}
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            {tabLabels.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <PersonalInfoTab user={user} onSave={handlePersonalInfoSave} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <SecurityTab
              settings={securitySettings}
              onSettingsChange={handleSecuritySettingsChange}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <NotificationsTab
              settings={notificationSettings}
              onSettingsChange={handleNotificationSettingsChange}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <AppearanceTab
              settings={appearanceSettings}
              onSettingsChange={handleAppearanceSettingsChange}
            />
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ marginX: 1 }}>
          <button
            className="border py-1 px-2 border-red-600 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition duration-200"
            onClick={() => setLogoutOpen(true)}
          >
            Đăng xuất
          </button>
          <button
            className="border py-1 px-2 border-black rounded-lg hover:bg-black transition ease-in-out duration-200 hover:text-white"
            onClick={handleSaveAllChanges}
            color="primary"
            disabled={!hasChanges}
          >
            {hasChanges ? "Lưu thay đổi" : "Đã lưu"}
          </button>
        </DialogActions>
      </BootstrapDialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Cài đặt đã được lưu thành công!
        </Alert>
      </Snackbar>

      {/* Log Out Dialog */}
      <Dialog
        open={logOutOpen}
        onClose={() => setLogoutOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle color="error">Xác nhận đăng xuất</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <button className="py-1 px-2" onClick={() => setLogoutOpen(false)}>
            Hủy
          </button>
          <button
            className="border py-1 px-2 border-red-600 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition duration-200"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default SettingUserDialog;
