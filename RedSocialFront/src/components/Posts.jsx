import React from 'react'
import Post from './Post'
import { useDispatch, useSelector } from "react-redux"
import { getAll, reset } from "../../redux/posts/postsSlice"

const Posts = () => {

    const { isLoading } = useSelector((state) => state.posts)

    const dispatch = useDispatch()
        useEffect(() => {
            const fetchPosts = async () => {
                await dispatch(getAll())
                await dispatch(reset())
            }
            fetchPosts()
        }, [dispatch])

    return (
        <>
            <h1>Posts</h1>
                {isLoading ? 'Cargando...' : <Post />}
        </>
    )
}

export default Posts