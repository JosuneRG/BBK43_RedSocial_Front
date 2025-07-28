import { useParams } from "react-router-dom"

const PostDetail = () => {

    const { id } = useParams();

    console.log(id);

    return <div>PostDetail</div>
}

export default PostDetail