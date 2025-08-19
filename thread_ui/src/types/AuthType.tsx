interface AuthType {
  id: string;
  username: string;
  password: string;
  displayName: string;
  createdAt: Date;
  follower: number;
  avatarURL: string;
  introduction: string;
  anotherPath: string;
  verified: boolean;
}

interface InfoUser {
  id: string;
  username: string;
  displayName: string;
  follower: number;
  avatarURL: string;
  introduction: string;
  anotherPath: string;
  verified: boolean;
  createdAt: Date;
  needMoreInfoUser: boolean;
  isFollowing?: boolean;
}

export type { AuthType, InfoUser };
