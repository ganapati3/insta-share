import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Header from '../Header'
import PostItem from '../PostItem'
import StoryItem from '../StoryItem'

import './index.css'

const apiConstants = {
  success: 'success',
  loading: 'loading',
  failure: 'failure',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
  ],
}

class HomePage extends Component {
  state = {
    storyApiStatus: '',
    storiesList: [],
    homeApiStatus: '',
    homePostsList: [],
  }

  componentDidMount() {
    this.getStoriesList()
    this.getHomePosts()
  }

  getStoriesList = async () => {
    this.setState({storyApiStatus: apiConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(
      'https://apis.ccbp.in/insta-share/stories',
      options,
    )
    const data = await response.json()
    if (response.ok) {
      const formattedData = data.users_stories.map(story => ({
        userId: story.user_id,
        userName: story.user_name,
        storyUrl: story.story_url,
      }))
      this.setState({
        storiesList: formattedData,
        storyApiStatus: apiConstants.success,
      })
    }
  }

  renderStoryView = () => {
    const {storyApiStatus, storiesList} = this.state
    switch (storyApiStatus) {
      case apiConstants.success:
        return (
          <div className="slick-container">
            <Slider {...settings}>
              {storiesList.map(item => (
                <StoryItem key={item.userId} storyDetails={item} />
              ))}
            </Slider>
          </div>
        )
      case apiConstants.loading:
        return (
          <div className="story-loader-container" data-testid="loader">
            <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
          </div>
        )

      default:
        return null
    }
  }

  getHomePosts = async () => {
    this.setState({homeApiStatus: apiConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(
      `https://apis.ccbp.in/insta-share/posts`,
      options,
    )
    const data = await response.json()
    if (response.ok) {
      const formattedData = data.posts.map(post => ({
        userId: post.user_id,
        userName: post.user_name,
        profilePic: post.profile_pic,
        postId: post.post_id,
        createdAt: post.created_at,
        likesCount: post.likes_count,
        caption: post.post_details.caption,
        imageUrl: post.post_details.image_url,
        comments: post.comments.map(comment => ({
          userName: comment.user_name,
          userId: post.user_id,
          comment: comment.comment,
        })),
      }))
      this.setState({
        homePostsList: formattedData,
        homeApiStatus: apiConstants.success,
      })
    } else {
      this.setState({homeApiStatus: apiConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onClickRetry = () => {
    this.getHomePosts()
  }

  renderFailureView = () => (
    <>
      <img
        className="failure-image"
        src="https://res.cloudinary.com/dkh18yhyi/image/upload/v1682337182/alert-triangle_qtasur.png"
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

  renderPostsView = () => {
    const {homePostsList} = this.state
    return (
      <>
        {homePostsList.map(eachPost => (
          <PostItem key={eachPost.postId} postDetails={eachPost} />
        ))}
      </>
    )
  }

  renderHomePosts = () => {
    const {homeApiStatus} = this.state
    switch (homeApiStatus) {
      case apiConstants.loading:
        return this.renderLoader()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.success:
        return this.renderPostsView()
      default:
        return null
    }
  }

  updateSearchInput = () => {}

  applyFilter = () => {
    this.getHomePosts()
  }

  render() {
    return (
      <>
        <Header
          updateSearchInput={this.updateSearchInput}
          applyFilter={this.applyFilter}
        />
        <div className="home-page">
          {this.renderStoryView()}
          <div className="home-posts-container">{this.renderHomePosts()}</div>
        </div>
      </>
    )
  }
}

export default HomePage
