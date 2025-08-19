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
  Card,
  CardContent,
  Grid,
  Radio,
  RadioGroup,
  Slider,
} from "@mui/material";
// import {
//   Palette as PaletteIcon,
//   Language as LanguageIcon,
//   Brightness4 as DarkModeIcon,
//   Brightness7 as LightModeIcon,
//   SettingsBrightness as AutoModeIcon,
// } from "@mui/icons-material";

interface AppearanceSettings {
  darkMode: boolean;
  themeMode: "light" | "dark" | "auto";
  language: string;
  timezone: string;
  fontSize: number;
  primaryColor: string;
  compactMode: boolean;
}

interface AppearanceTabProps {
  settings: AppearanceSettings;
  onSettingsChange: (settings: AppearanceSettings) => void;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [localSettings, setLocalSettings] =
    React.useState<AppearanceSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange =
    (setting: keyof AppearanceSettings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      const newSettings = {
        ...localSettings,
        [setting]: value,
      };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
    };

  const handleSelectChange =
    (setting: keyof AppearanceSettings) => (event: any) => {
      const newSettings = {
        ...localSettings,
        [setting]: event.target.value,
      };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
    };

  const handleSliderChange =
    (setting: keyof AppearanceSettings) =>
    (event: Event, value: number | number[]) => {
      const newSettings = {
        ...localSettings,
        [setting]: value as number,
      };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
    };

  //   const themeOptions = [
  //     { value: 'light', label: 'Sáng', icon: <LightModeIcon /> },
  //     { value: 'dark', label: 'Tối', icon: <DarkModeIcon /> },
  //     { value: 'auto', label: 'Tự động', icon: <AutoModeIcon /> },
  //   ];

  const colorOptions = [
    { value: "#2196f3", label: "Xanh dương", color: "#2196f3" },
    { value: "#4caf50", label: "Xanh lá", color: "#4caf50" },
    { value: "#ff9800", label: "Cam", color: "#ff9800" },
    { value: "#f44336", label: "Đỏ", color: "#f44336" },
    { value: "#9c27b0", label: "Tím", color: "#9c27b0" },
    { value: "#607d8b", label: "Xám xanh", color: "#607d8b" },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 2 }}>
      <Typography variant="h6" display="flex" alignItems="center" gap={1}>
        {/* <PaletteIcon />  */}
        Cài đặt giao diện - (Đang phát triển)
      </Typography>

      {/* Theme Mode */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Chế độ hiển thị
          </Typography>
          <RadioGroup
            value={localSettings.themeMode}
            onChange={handleSettingChange("themeMode")}
          >
            {/* <Grid container spacing={2}>
              {themeOptions.map((option) => (
                <Grid item xs={4} key={option.value}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      border: localSettings.themeMode === option.value ? 2 : 1,
                      borderColor: localSettings.themeMode === option.value ? 'primary.main' : 'divider'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <FormControlLabel
                        value={option.value}
                        control={<Radio />}
                        label={
                          <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                            {option.icon}
                            <Typography variant="body2">{option.label}</Typography>
                          </Box>
                        }
                        sx={{ m: 0 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid> */}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Primary Color */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Màu chủ đạo
          </Typography>
          <RadioGroup
            value={localSettings.primaryColor}
            onChange={handleSettingChange("primaryColor")}
          >
            <Grid container spacing={1}>
              {colorOptions.map((option) => (
                <Grid item xs={2} key={option.value}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: option.color,
                      borderRadius: "50%",
                      cursor: "pointer",
                      border:
                        localSettings.primaryColor === option.value ? 3 : 2,
                      borderColor:
                        localSettings.primaryColor === option.value
                          ? "primary.main"
                          : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => {
                      const newSettings = {
                        ...localSettings,
                        primaryColor: option.value,
                      };
                      setLocalSettings(newSettings);
                      onSettingsChange(newSettings);
                    }}
                  >
                    <Radio
                      value={option.value}
                      checked={localSettings.primaryColor === option.value}
                      sx={{
                        color: "white",
                        "&.Mui-checked": { color: "white" },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Kích thước chữ
          </Typography>
          <Box px={2}>
            <Slider
              value={localSettings.fontSize}
              onChange={handleSliderChange("fontSize")}
              min={12}
              max={20}
              step={1}
              marks={[
                { value: 12, label: "Nhỏ" },
                { value: 16, label: "Vừa" },
                { value: 20, label: "Lớn" },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Kích thước chữ hiện tại: {localSettings.fontSize}px
          </Typography>
        </CardContent>
      </Card>

      {/* Language and Region */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Ngôn ngữ và khu vực
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <FormControl fullWidth>
              <InputLabel>
                <Box display="flex" alignItems="center" gap={1}>
                  {/* <LanguageIcon fontSize="small" /> */}
                  Ngôn ngữ
                </Box>
              </InputLabel>
              <Select
                value={localSettings.language}
                onChange={handleSelectChange("language")}
                label="Ngôn ngữ"
              >
                <MenuItem value="vi">🇻🇳 Tiếng Việt</MenuItem>
                <MenuItem value="en">🇺🇸 English</MenuItem>
                <MenuItem value="zh">🇨🇳 中文</MenuItem>
                <MenuItem value="ja">🇯🇵 日本語</MenuItem>
                <MenuItem value="ko">🇰🇷 한국어</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Múi giờ</InputLabel>
              <Select
                value={localSettings.timezone}
                onChange={handleSelectChange("timezone")}
                label="Múi giờ"
              >
                <MenuItem value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</MenuItem>
                <MenuItem value="Asia/Tokyo">Tokyo (UTC+9)</MenuItem>
                <MenuItem value="Asia/Shanghai">Shanghai (UTC+8)</MenuItem>
                <MenuItem value="America/New_York">New York (UTC-5)</MenuItem>
                <MenuItem value="Europe/London">London (UTC+0)</MenuItem>
                <MenuItem value="Australia/Sydney">Sydney (UTC+10)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Additional Settings */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Cài đặt khác
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={localSettings.compactMode}
                onChange={handleSettingChange("compactMode")}
              />
            }
            label={
              <Box>
                <Typography variant="body1">Chế độ thu gọn</Typography>
                <Typography variant="body2" color="text.secondary">
                  Hiển thị giao diện với khoảng cách nhỏ hơn
                </Typography>
              </Box>
            }
          />
        </CardContent>
      </Card>

      {/* Preview */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Xem trước
          </Typography>
          <Box
            p={2}
            border={1}
            borderColor="divider"
            borderRadius={1}
            sx={{
              fontSize: `${localSettings.fontSize}px`,
              backgroundColor:
                localSettings.themeMode === "dark"
                  ? "grey.900"
                  : "background.paper",
              color:
                localSettings.themeMode === "dark" ? "white" : "text.primary",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: localSettings.primaryColor, mb: 1 }}
            >
              Tiêu đề mẫu
            </Typography>
            <Typography variant="body1">
              Đây là đoạn văn bản mẫu để bạn xem trước giao diện với các cài đặt
              hiện tại.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AppearanceTab;
