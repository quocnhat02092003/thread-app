import * as React from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
// import { Notifications as NotificationsIcon } from "@mui/icons-material";

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

interface NotificationsTabProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [localSettings, setLocalSettings] =
    React.useState<NotificationSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange =
    (setting: keyof NotificationSettings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSettings = {
        ...localSettings,
        [setting]: event.target.checked,
      };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
    };

  const notificationSections = [
    {
      title: "Phương thức thông báo",
      items: [
        {
          key: "emailNotifications" as keyof NotificationSettings,
          label: "Thông báo qua email",
          description: "Nhận thông báo qua địa chỉ email của bạn",
        },
        {
          key: "pushNotifications" as keyof NotificationSettings,
          label: "Thông báo đẩy",
          description: "Nhận thông báo trực tiếp trên thiết bị",
        },
        {
          key: "smsNotifications" as keyof NotificationSettings,
          label: "Thông báo SMS",
          description: "Nhận thông báo qua tin nhắn SMS",
        },
      ],
    },
    {
      title: "Loại thông báo",
      items: [
        {
          key: "securityAlerts" as keyof NotificationSettings,
          label: "Cảnh báo bảo mật",
          description: "Thông báo về hoạt động đăng nhập và bảo mật",
        },
        {
          key: "friendRequests" as keyof NotificationSettings,
          label: "Lời mời kết bạn",
          description: "Thông báo khi có người gửi lời mời kết bạn",
        },
        {
          key: "comments" as keyof NotificationSettings,
          label: "Bình luận",
          description: "Thông báo khi có người bình luận bài viết của bạn",
        },
        {
          key: "mentions" as keyof NotificationSettings,
          label: "Nhắc đến",
          description: "Thông báo khi có người nhắc đến bạn",
        },
        {
          key: "newFollowers" as keyof NotificationSettings,
          label: "Người theo dõi mới",
          description: "Thông báo khi có người theo dõi bạn",
        },
      ],
    },
    {
      title: "Marketing",
      items: [
        {
          key: "marketingEmails" as keyof NotificationSettings,
          label: "Email marketing",
          description: "Nhận email về sản phẩm mới và khuyến mãi",
        },
      ],
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 2 }}>
      <Typography variant="h6" display="flex" alignItems="center" gap={1}>
        {/* <NotificationsIcon />  */}
        Cài đặt thông báo
      </Typography>

      {notificationSections.map((section, sectionIndex) => (
        <Box key={section.title}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            {section.title}
          </Typography>

          <List disablePadding>
            {section.items.map((item, itemIndex) => (
              <ListItem key={item.key} disablePadding>
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={localSettings[item.key]}
                    onChange={handleSettingChange(item.key)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {sectionIndex < notificationSections.length - 1 && (
            <Divider sx={{ my: 2 }} />
          )}
        </Box>
      ))}

      <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
        <Typography variant="body2" color="text.secondary">
          💡 <strong>Mẹo:</strong> Bạn có thể tắt tất cả thông báo bằng cách tắt
          "Thông báo đẩy" và "Thông báo qua email". Tuy nhiên, chúng tôi khuyên
          bạn nên giữ "Cảnh báo bảo mật" để đảm bảo an toàn tài khoản.
        </Typography>
      </Box>
    </Box>
  );
};

export default NotificationsTab;
