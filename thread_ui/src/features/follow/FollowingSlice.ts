import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/refreshTokenService";

interface FollowingState {
  followingIds: string[];
  loading: boolean;
  error: string | null;
}

const initialState: FollowingState = {
  followingIds: [],
  loading: false,
  error: null,
};

// Lấy danh sách userId mà user hiện tại đang theo dõi
export const fetchFollowingIds = createAsyncThunk(
  "following/fetchFollowingIds",
  async () => {
    const response = await API.get<string[]>("/api/feature/following-ids");
    return response.data;
  }
);

// Gửi toggle follow/unfollow
export const toggleFollowUser = createAsyncThunk(
  "following/toggleFollowUser",
  async ({ targetUserId, isFollowing }: { targetUserId: string; isFollowing: boolean }) => {
  if (isFollowing) {
      await API.delete(`/api/feature/follow/${targetUserId}`);
    } else {
      await API.post(`/api/feature/follow/${targetUserId}`);
    }
    return { targetUserId, isFollowing };
  }
);

const followingSlice = createSlice({
  name: "following",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowingIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowingIds.fulfilled, (state, action) => {
        state.followingIds = action.payload;
        state.loading = false;
      })
      .addCase(fetchFollowingIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi không xác định";
      })
      .addCase(toggleFollowUser.fulfilled, (state, action) => {
        const { targetUserId, isFollowing } = action.payload;
        if (isFollowing) {
          // Hủy theo dõi
          state.followingIds = state.followingIds.filter((id) => id !== targetUserId);
        } else {
          // Bắt đầu theo dõi
          state.followingIds.push(targetUserId);
        }
      });
  },
});

export default followingSlice.reducer;

