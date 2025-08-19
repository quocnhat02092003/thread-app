import { PostUploadData } from "../types/PostType";
import API from "./refreshTokenService";

export const uploadPost = async (data : PostUploadData) => {
    try {
        const response = await API.post("/api/post/upload",data);
        return response.data;
    } catch (err) {
        throw err;
    }
}


export const likeAction = async (postID : string) => {
    try{
        const response = await API.post(`/api/post/like/${postID}`)
        return response.data
    }
    catch(err) {
        throw err;
    }
}

export const commentAction = async (postID : string, commentContent: string) => {
    try{
        const response = await API.post(`/api/post/comment/${postID}`, commentContent, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response.data
    }
    catch(err) {
        throw err;
    }
}