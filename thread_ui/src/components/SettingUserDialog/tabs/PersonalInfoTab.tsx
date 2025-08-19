import * as React from "react";
import { Box, TextField, Button, Avatar, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { InfoUser } from "../../../types/AuthType";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: "0 auto",
  position: "relative",
  cursor: "pointer",
  "&:hover": {
    opacity: 0.8,
  },
}));

interface PersonalInfoTabProps {
  user: InfoUser;
  onSave: (data: any) => void;
}

interface FormData {
  username: string;
  displayName: string;
  introduction: string;
  avatarURL: string;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ user, onSave }) => {
  const [formData, setFormData] = React.useState<FormData>({
    username: "",
    displayName: "",
    introduction: "",
    avatarURL: "",
  });
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        displayName: user.displayName || "",
        introduction: user.introduction || "",
        avatarURL: user.avatarURL || "",
      });
    }
  }, [user]);

  const handleFormChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSaveChanges = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleAvatarUpload = () => {
    const input = document.getElementById("avatar-upload") as HTMLInputElement;
    if (input && input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatarURL: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 2 }}>
      {/* Avatar Section */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Box position="relative">
          <Avatar
            src={formData.avatarURL ? formData.avatarURL : user.avatarURL}
            sx={{ width: 80, height: 80 }}
          />
        </Box>
        <label
          htmlFor="avatar-upload"
          className={`${
            !isEditing ? "cursor-not-allowed" : "cursor-pointer"
          } border py-1 px-2 border-black rounded-lg hover:bg-black transition ease-in-out duration-200 hover:text-white`}
        >
          Thay đổi ảnh đại diện
        </label>
        <input
          className="hidden"
          id="avatar-upload"
          type="file"
          accept="image/jpeg"
          disabled={!isEditing}
          onChange={handleAvatarUpload}
        />
      </Box>

      <Divider />

      {/* Form Fields */}
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Tên người dùng"
          value={formData.username}
          onChange={handleFormChange("username")}
          disabled={!isEditing}
          fullWidth
          InputProps={{
            startAdornment: user.avatarURL && (
              <Avatar
                src={user.avatarURL}
                sx={{ width: 24, height: 24, mr: 1 }}
              />
            ),
          }}
        />

        <TextField
          label="Họ và tên"
          value={formData.displayName}
          onChange={handleFormChange("displayName")}
          disabled={!isEditing}
          fullWidth
        />

        <TextField
          label="Giới thiệu"
          value={formData.introduction}
          onChange={handleFormChange("introduction")}
          disabled={!isEditing}
          fullWidth
          multiline
          rows={3}
          placeholder="Viết vài dòng về bản thân..."
        />

        <Box display="flex" justifyContent="flex-end" mt={2}>
          {!isEditing ? (
            <button
              className="border py-1 px-2 border-black rounded-lg hover:bg-black transition ease-in-out duration-200 hover:text-white"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </button>
          ) : (
            <Box display="flex" gap={1}>
              <button className="py-1 px-2" onClick={() => setIsEditing(false)}>
                Hủy
              </button>
              <button
                className="border py-1 px-2 border-black rounded-lg hover:bg-black transition ease-in-out duration-200 hover:text-white"
                onClick={handleSaveChanges}
              >
                Lưu chỉnh sứa
              </button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalInfoTab;
