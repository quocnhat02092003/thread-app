import * as SignalR from "@microsoft/signalr"
import React from "react"
import { NotificationPayload } from "../types/NotificationType"

export const useNotificationsHub = () => {
    const connectionRef = React.useRef<SignalR.HubConnection>()
      const [isConnected, setIsConnected] = React.useState<boolean>(false)
    
      React.useEffect(() => {
        const connection = new SignalR.HubConnectionBuilder()
          .withUrl(`${process.env.REACT_APP_SIGNALR_URL}/notificationsHub`, {
            withCredentials: true,
          })
          .withAutomaticReconnect()
          .build()
    
        connection
          .start()
          .then(() => {
            setIsConnected(true)
          })
          .catch((err) => {
            console.error("SignalR connection error:", err)
            setIsConnected(false)
          })
    
        connectionRef.current = connection
    
        return () => {
          connection.stop()
        }
      }, [])

      const ReceiverNotification = (callback: (data : NotificationPayload) => void) => {
    connectionRef.current?.on("SendNotification", callback)
  }

    return { isConnected, connection: connectionRef.current, ReceiverNotification }
    }