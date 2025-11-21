import axios from "axios"

export const SearchUserByQuery = async (username : string) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/search/${username}`)
        return response.data
    }
    catch (error) {
        throw error;
    }  
}