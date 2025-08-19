interface NotificationPayload {
  id: string;
  type: number;
  user: {
    displayName: string;
    avatarURL: string;
    username: string;
  };
  content: string;
  createdAt: string;
  isRead: boolean;
  postPreview?: string;
}

export type { NotificationPayload };
