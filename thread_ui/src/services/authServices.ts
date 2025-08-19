import axios, {AxiosResponse} from "axios";
import {AuthType, InfoUser} from "../types/AuthType";
import {AddInformationAPIResponse, LoginAPIResponse, RegisterAPIResponse} from "../types/APITypeResponse";
import API from "./refreshTokenService"

const API_KEY : string = "http://localhost:5277/api/auth"

// Register user API
export async function RegisterUser(user: Pick<AuthType, "username" | "password">) {
    try{
        const response : AxiosResponse<RegisterAPIResponse> = await axios.post(`${API_KEY}/register`, user, {withCredentials: true});
        return response.data;
    }
    catch (error : any) {
        throw error;
    }
}

// Login user API
export async function LoginUser(user : Pick<AuthType, "username" | "password">) {
    try {
        const response : AxiosResponse<LoginAPIResponse> = await axios.post(`${API_KEY}/login`, user, {withCredentials: true});
        return response.data;
    }
    catch (error : any) {
        throw error;
    }
}

//Add information user after login
export async function AddInformation(user : Pick<AuthType, "displayName" | "anotherPath"| "introduction" | "avatarURL">) {
    try {
        const response:AxiosResponse<AddInformationAPIResponse> = await API.post("/api/auth/add-information", user);
        return response.data;
    }
    catch (error : any) {
        throw error;
    }
}

//Get user information API
export async function GetUserInformation() {
    try {
        const response: AxiosResponse<InfoUser> = await API.get("/api/auth/info-user");
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

//Logout user API
export async function LogoutUser() {
    try {
        const response: AxiosResponse = await API.post("/api/auth/logout");
        return response.data;
    } catch (error: any) {
        throw error;
    }
}