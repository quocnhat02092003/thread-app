import API from "./refreshTokenService";

export const UpdateDataUser = async (data: {
    displayName: string;
    avatarURL: string;
    introduction: string;
    username: string;
}) => {
    try {
        const response = await API.put("api/setting-account/update-data", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const ChangePasswordUser = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) => {
    try {
        const response = await API.put("api/setting-account/change-password", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
