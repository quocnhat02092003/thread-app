import { PostData } from "./PostType";

interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  follower: number;
  avatarURL: string;
  introduction: string;
  anotherPath: string | undefined;
  verified: boolean;
  isFollowing?: boolean;
  post?: [PostData];
}

export type { ProfileData };
