import { createSlice } from "@reduxjs/toolkit";
import { NotificationPayload } from "../../types/NotificationType";

const initialState: NotificationPayload[] = [];

const NotificationsSlice = createSlice({
    initialState,
    name: "Notifications",
    reducers: {
      addNotification: (state, action) => {
        const exists = state.some(n => n.id === action.payload.id);
        if (!exists) {
          state.push(action.payload);
        }
      },
      clearNotifications: () => initialState,
    }
})

export const { addNotification, clearNotifications } = NotificationsSlice.actions;
export default NotificationsSlice.reducer;