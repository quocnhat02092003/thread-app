import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/refreshTokenService";

interface LikedPostState {
    likedPostIds: string[];
    loading: boolean;
    error: string | null;
}

const initialState: LikedPostState = {
    likedPostIds: [],
    loading: false,
    error: null,
};

export const fetchLikedPostIds = createAsyncThunk(
    "likedPosts/fetchLikedPostIds",
    async () => {
        const response = await API.get<string[]>("/api/feature/is-liked-post");
        if (response) {
            return response.data;
        }
        throw new Error("Failed to fetch liked post IDs");
    }
);

export const toggleLikePost = createAsyncThunk(
    "likedPosts/toggleLikePost",
    async ({postId, isLiked}: {postId: string, isLiked: boolean}) => {
        if (isLiked) {
            await API.delete(`/api/post/unlike/${postId}`);
        }
        else{
            await API.post(`/api/post/like/${postId}`);
        }
        return {postId, isLiked};
    }
);

const likedPostSlice = createSlice({
    name: "likedPosts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLikedPostIds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLikedPostIds.fulfilled, (state, action) => {
                state.loading = false;
                state.likedPostIds = action.payload;
            })
            .addCase(fetchLikedPostIds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch liked post IDs";
            })
            .addCase(toggleLikePost.fulfilled, (state, action) => {
                const { postId, isLiked } = action.payload;
                if (isLiked) {
                    state.likedPostIds = state.likedPostIds.filter(id => id !== postId);
                } else {
                    state.likedPostIds.push(postId);
                }
            });
    },
});

export default likedPostSlice.reducer;
