import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

const apiConstants = {
  success: 'success',
  loading: 'loading',
  failure: 'failure',
}

class UserProfile extends Component {
  state = {userProfile: {}, apiStatus: ''}

  componentDidMount() {
    this.getMyProfile()
  }

  getMyProfile = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(
      `https://apis.ccbp.in/insta-share/users/${id}`,
      options,
    )
    const data = await response.json()
    if (response.ok) {
      const formattedData = {
        followersCount: data.user_details.followers_count,
        followingCount: data.user_details.following_count,
        id: data.user_details.id,
        postsCount: data.user_details.posts_count,
        userBio: data.user_details.user_bio,
        userName: data.user_details.user_name,
        userId: data.user_details.user_id,
        profilePic: data.user_details.profile_pic,
        posts: data.user_details.posts.map(post => ({
          id: post.id,
          image: post.image,
        })),
        stories: data.user_details.stories,
      }
      this.setState({
        userProfile: formattedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiConstants.failure,
      })
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onClickRetry = () => {
    this.getMyProfile()
  }

  renderFailureView = () => (
    <>
      <img
        className="profile-failure-image"
        src="https://res.cloudinary.com/dkh18yhyi/image/upload/v1682495172/Group_7522_s5m7ua.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong. Please try again</h1>
      <button
        onClick={this.onClickRetry}
        type="button"
        className="try-again-btn"
      >
        Try Again
      </button>
    </>
  )

  renderProfile = () => {
    const {userProfile} = this.state
    const {
      followersCount,
      followingCount,
      postsCount,
      userBio,
      userName,
      userId,
      profilePic,
      posts,
      stories,
    } = userProfile
    return (
      <div className="my-profile">
        <div className="profile-description-container">
          <h1 className="profile-user-name sm-username">{userName}</h1>
          <img
            className="my-profile-img md-username"
            src={profilePic}
            alt="user profile"
          />
          <div className="description-container">
            <img
              className="my-profile-img sm-username"
              src={profilePic}
              alt="user profile"
            />
            <h1 className="profile-user-name md-username">{userName}</h1>
            <div className="post-follower-counter">
              <p className="followers">
                <span className="followers-count">{postsCount}</span> Posts
              </p>
              <p className="followers">
                <span className="followers-count">{followersCount}</span>{' '}
                Followers
              </p>
              <p className="followers">
                <span className="followers-count">{followingCount}</span>{' '}
                following
              </p>
            </div>
            <p className="follower-count md-username">{userId}</p>
            <p className="followers md-username">{userBio}</p>
          </div>
          <p className="follower-count sm-username">{userId}</p>
          <p className="followers sm-username">{userBio}</p>
        </div>
        <ul className="user-stories">
          {stories.map(eachItem => (
            <li key={eachItem.id}>
              <img
                className="user-story"
                src={eachItem.image}
                alt="user story"
              />
            </li>
          ))}
        </ul>
        <hr />
        <div className="posts-header">
          <BsGrid3X3 />
          <h1 className="post-header-heading">Posts</h1>
        </div>
        <div className="posts-container">
          {postsCount > 0 ? (
            <ul className="grid-posts-container">
              {posts.map(item => (
                <li key={item.id}>
                  <img className="post" src={item.image} alt="user post" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-posts-container">
              <p className="no-post-icon">
                <BiCamera />
              </p>
              <h1>No Posts Yet</h1>
            </div>
          )}
        </div>
      </div>
    )
  }

  renderMyProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.loading:
        return this.renderLoader()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.success:
        return this.renderProfile()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="my-profile-container">{this.renderMyProfile()}</div>
      </>
    )
  }
}

export default UserProfile
