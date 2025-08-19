import { RootState } from "../app/store";

export const selectIsLikedPost = (state: RootState, postId: string) =>
  state.likedPosts.likedPostIds.includes(postId);