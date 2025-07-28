import axios from "axios"

const API_URL = "http://localhost:3001"

const getAll = async () => {
    const res = await axios.get(API_URL + "/posts/getAllPosts")
    return res.data.posts
}

const getById = async (id) => {
    const res = await axios.get(API_URL + "/posts/" + id)
    return res.data
}


const postsService = {
    getAll,
    getById 
}

export default postsService