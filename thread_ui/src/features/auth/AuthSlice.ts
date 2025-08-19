import { createSlice } from "@reduxjs/toolkit";
import { InfoUser } from "../../types/AuthType";

const initialState : InfoUser = {
        id: "",
        username: "",
        displayName: "",
        follower: 0,
        avatarURL: "",
        introduction: "",
        anotherPath: "",
        verified: false,
        createdAt: new Date(),
        needMoreInfoUser: true
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers:{
        login: (state, action) => {
            return { ...state, ...action.payload}
        },
        logout: (state) => {
            return initialState;
        },
        updateUser: (state, action) => {
            return { ...state, ...action.payload }
        }
    }
})

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;