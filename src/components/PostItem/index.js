import {Link} from 'react-router-dom'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import './index.css'

const PostItem = props => {
  const {postDetails, postLike} = props
  const {
    userId,
    userName,
    profilePic,
    likeStatus,
    postId,
    createdAt,
    likesCount,
    caption,
    imageUrl,
    comments,
  } = postDetails

  const onClickLike = () => {
    postLike(postId)
  }

  return (
    <li className="post-item">
      <div className="profile-container">
        <img
          className="profile-img with-linear-gradient"
          src={profilePic}
          alt="post author profile"
        />
        <Link className="link-item" to={`/users/${userId}`}>
          <p className="post-user-name">{userName}</p>
        </Link>
      </div>

      <img className="post-image" src={imageUrl} alt="post" />
      <div className="reaction-icons-container">
        {likeStatus ? (
          <button
            onClick={onClickLike}
            type="button"
            className="reaction-btn"
            data-testid="unLikeIcon"
          >
            <FcLike fontSize="23px" />
          </button>
        ) : (
          <button
            onClick={onClickLike}
            type="button"
            className="reaction-btn"
            data-testid="likeIcon"
          >
            <BsHeart />
          </button>
        )}

        <button type="button" className="reaction-btn">
          <FaRegComment />
        </button>
        <button type="button" className="reaction-btn">
          <BiShareAlt />
        </button>
      </div>
      <div className="post-bottom-container">
        <p className="post-user-name">{parseInt(likesCount)} likes</p>
        <p className="post-caption">{caption}</p>
        {comments.map(comment => (
          <p key={comment.userName} className="post-caption">
            <span className="post-user-name">{comment.userName}</span>
            {comment.comment}
          </p>
        ))}
        <p className="posted-at">{createdAt}</p>
      </div>
    </li>
  )
}

export default PostItem
