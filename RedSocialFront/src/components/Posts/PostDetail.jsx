import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getById } from '../../redux/posts/postsSlice'

const PostDetail = () => {
    const { id } = useParams()
    
    const dispatch = useDispatch()
    
    const { post } = useSelector((state) => state.posts)
    
    useEffect(() => {
        dispatch(getById(id))
    }, [])

    return (
        <div>
            <h1>PostDetail</h1>
            <p>{post.content}</p>
        </div>
    )
}
export default PostDetail