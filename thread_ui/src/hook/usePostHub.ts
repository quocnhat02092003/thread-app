// useSignalR.ts
import { useEffect, useRef, useState } from "react"
import * as SignalR from "@microsoft/signalr"
import { HubConnectionState } from "@microsoft/signalr"

type CommentPayload = {
  postId: string;
  commentId: string;
  commentContent: string;
  commentCount: number;
  userId: string;
  user: {
    id: string;
    displayName: string;
    username: string;
    avatarURL: string;
  };
  parentCommentId: string | null;
  createdAt: string;
};

export const usePostHub = () => {
  const connectionRef = useRef<SignalR.HubConnection>()
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    const connection = new SignalR.HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_SIGNALR_URL}/postHub`)
      .withAutomaticReconnect()
      .build()

    connection
      .start()
      .then(() => {
        setIsConnected(true)
      })
      .catch((err) => {
        setIsConnected(false)
      })

    connectionRef.current = connection

    return () => {
      connection.stop()
    }
  }, [])

  const joinPost = async (postId: string) => {
  const conn = connectionRef.current;
  if (conn && conn.state === HubConnectionState.Connected) {
    try {
      await conn.invoke("JoinPost", postId);
    } catch (err) {
      console.error("JoinPost error:", err);
    }
  } else {
    console.warn("Cannot join, SignalR not ready");
  }
};

const leavePost = async (postId: string) => {
  const conn = connectionRef.current;
  if (conn && conn.state === HubConnectionState.Connected) {
    try {
      await conn.invoke("LeavePost", postId);
    } catch (err) {
      console.error("LeavePost error:", err);
    }
  }
};

  const onPostLikedChanged = (callback: (postId: string, likeCount: number) => void) => {
    connectionRef.current?.on("PostLikedChanged", callback)
  }

  const onPostCommented = (
  callback: (payload: CommentPayload) => void
) => {
  connectionRef.current?.on("PostCommented", callback);
};

  return {
    isConnected,
    joinPost,
    leavePost,
    onPostCommented,
    onPostLikedChanged
  }
}
