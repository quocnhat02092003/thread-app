import { RootState } from "../app/store";

export const selectIsFollowing = (state: RootState, userId: string) =>
  state.following.followingIds.includes(userId);