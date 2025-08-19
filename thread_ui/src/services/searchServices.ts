import axios from "axios"

export const SearchUserByQuery = async (username : string) => {
    try{
        const response = await axios.post(`http://localhost:5277/api/search/${username}`)
        return response.data
    }
    catch (error) {
        throw error;
    }  
}