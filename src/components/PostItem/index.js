import {Link} from 'react-router-dom'
import './index.css'

const PostItem = props => {
  const {postDetails} = props
  const {
    userId,
    userName,
    profilePic,
    postId,
    createdAt,
    likesCount,
    caption,
    imageUrl,
    comments,
  } = postDetails
  return (
    <div className="post-item">
      <div className="profile-container">
        <img
          className="profile-img"
          src={profilePic}
          alt="post author profile"
        />
      </div>
    </div>
  )
}

export default PostItem
