import { createSlice } from "@reduxjs/toolkit";
import { PostData } from "../../types/PostType";

const initialState : PostData =  {
  commentCount: 0,
  shareCount: 0,
  reupCount: 0,
  likeCount: 0,
  id: "",
  content: "",
  images: [],
  user: {
    id: "",
    follower: 0,
    username: "",
    verified: false,
    displayName: "",
    introduction: "",
    avatarURL: "",
    isFollowing: false,},
  isLiked: false,
  createdAt: "",
  visibility: "",
  updatedAt: "",
}

const PostUploadSlice = createSlice({
    initialState : initialState,
    name : "PostUpload",
    reducers : {
      postUpload : (state, action) => {
        return { ...state, ...action.payload };
      },
      clearPostUpload: () => initialState,
    }
})

export const { postUpload, clearPostUpload } = PostUploadSlice.actions;
export default PostUploadSlice.reducer;