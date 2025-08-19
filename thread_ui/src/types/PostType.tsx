interface PostUploadData {
  content: string;
  images: (string | ArrayBuffer | null)[];
  visibility: string;
  userId: string;
}

interface PostData {
  commentCount: number;
  shareCount: number;
  reupCount: number;
  likeCount: number;
  id: string;
  content: string;
  comments?: [
    {
      id: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        follower: number;
        username: string;
        verified: boolean;
        displayName: string;
        introduction: string;
        avatarURL: string;
        isFollowing: boolean;
      };
    }
  ];
  images: [];
  user: {
    isFollowing: boolean;
    id: string;
    follower: number;
    username: string;
    verified: boolean;
    displayName: string;
    introduction: string;
    avatarURL: string;
  };
  isLiked: boolean;
  createdAt: string;
  visibility: string;
  updatedAt: string;
}

export type { PostUploadData, PostData };
