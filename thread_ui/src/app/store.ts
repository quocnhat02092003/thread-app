import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice"
import postUploadReducer from "../features/post/PostUploadSlice";
import followingReducer from "../features/follow/FollowingSlice";
import notificationsReducer from "../features/notifications/NotificationsSlice";
import likedPostReducer from "../features/is_liked_post/LikedPostSlice";

export const store = configureStore({
    reducer: {
        auth : authReducer,
        postUpload: postUploadReducer,
        likedPosts: likedPostReducer,
        following: followingReducer,
        notifications: notificationsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;