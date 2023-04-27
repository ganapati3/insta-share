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
    searchInput: '',
    searchResult: false,
    searchPostList: [],
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
    } else {
      this.setState({storyApiStatus: apiConstants.failure})
    }
  }

  onClickStoryRetry = () => {
    this.getStoriesList()
  }

  renderStoryView = () => {
    const {storyApiStatus, storiesList} = this.state
    switch (storyApiStatus) {
      case apiConstants.success:
        return (
          <ul className="slick-container">
            <Slider {...settings}>
              {storiesList.map(item => (
                <StoryItem key={item.userId} storyDetails={item} />
              ))}
            </Slider>
          </ul>
        )
      case apiConstants.loading:
        return (
          <div data-testid="loader" className="story-loader-container">
            <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
          </div>
        )
      case apiConstants.failure:
        return (
          <>
            <img
              className="failure-image"
              src="https://res.cloudinary.com/dkh18yhyi/image/upload/v1682337182/alert-triangle_qtasur.png"
              alt="failure view"
            />
            <h1 className="failure-text">
              Something went wrong. Please try again
            </h1>
            <button
              onClick={this.onClickStoryRetry}
              type="button"
              className="try-again-btn"
            >
              Try Again
            </button>
          </>
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
        likeStatus: false,
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

  onClickRetry = () => {
    this.getSearchResults()
  }

  renderFailureView = () => (
    <>
      <img
        className="failure-image"
        src="https://res.cloudinary.com/dkh18yhyi/image/upload/v1682337182/alert-triangle_qtasur.png"
        alt="failure view"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        onClick={this.onClickRetry}
        type="button"
        className="try-again-btn"
      >
        Try Again
      </button>
    </>
  )

  postLike = async id => {
    const jwtToken = Cookies.get('jwt_token')
    const {homePostsList} = this.state
    const post = homePostsList.find(eachPost => eachPost.postId === id)
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({like_status: !post.likeStatus}),
    }
    const response = await fetch(
      `https://apis.ccbp.in/insta-share/posts/${id}/like`,
      options,
    )
    if (response.ok) {
      this.setState(prevState => ({
        homePostsList: prevState.homePostsList.map(eachItem => {
          if (eachItem.postId === id) {
            return {
              ...eachItem,
              likeStatus: !eachItem.likeStatus,
              likesCount: eachItem.likeStatus
                ? parseInt(eachItem.likesCount) - parseInt(1)
                : parseInt(eachItem.likesCount) + parseInt(1),
            }
          }
          return eachItem
        }),
      }))
    }
  }

  renderPostsView = () => {
    const {homePostsList} = this.state
    return (
      <ul className="home-posts-container">
        {homePostsList.map(eachPost => (
          <PostItem
            postLike={this.postLike}
            key={eachPost.postId}
            postDetails={eachPost}
          />
        ))}
      </ul>
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

  postLikeSearch = async id => {
    const jwtToken = Cookies.get('jwt_token')
    const {searchPostList} = this.state
    const post = searchPostList.find(eachPost => eachPost.postId === id)
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({like_status: !post.likeStatus}),
    }
    const response = await fetch(
      `https://apis.ccbp.in/insta-share/posts/${id}/like`,
      options,
    )
    if (response.ok) {
      this.setState(prevState => ({
        searchPostList: prevState.searchPostList.map(eachItem => {
          if (eachItem.postId === id) {
            return {
              ...eachItem,
              likeStatus: !eachItem.likeStatus,
              likesCount: eachItem.likeStatus
                ? parseInt(eachItem.likesCount) - parseInt(1)
                : parseInt(eachItem.likesCount) + parseInt(1),
            }
          }
          return eachItem
        }),
      }))
    }
  }

  getSearchResults = async () => {
    this.setState({searchApiStatus: apiConstants.loading})
    const {searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(
      `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`,
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
        likeStatus: false,
        comments: post.comments.map(comment => ({
          userName: comment.user_name,
          userId: post.user_id,
          comment: comment.comment,
        })),
      }))
      this.setState({
        searchPostList: formattedData,
        searchApiStatus: apiConstants.success,
      })
    } else {
      this.setState({searchApiStatus: apiConstants.failure})
    }
  }

  updateSearchInput = input => {
    this.setState({searchInput: input})
  }

  applyFilter = () => {
    const {searchInput} = this.state
    if (searchInput !== '') {
      this.getSearchResults()
      this.setState({searchResult: true})
    }
  }

  renderSearchView = () => {
    const {searchPostList} = this.state
    return (
      <div className="search-results">
        {searchPostList.length > 0 ? (
          <>
            <ul className="search-posts-container">
              <h1>Search Results</h1>
              {searchPostList.map(eachPost => (
                <PostItem
                  postLike={this.postLikeSearch}
                  key={eachPost.postId}
                  postDetails={eachPost}
                />
              ))}
            </ul>
          </>
        ) : (
          <>
            <img
              className="search-not-found"
              src="https://res.cloudinary.com/dkh18yhyi/image/upload/v1682337941/Group_rqsosr.png"
              alt="search not found"
            />
            <h1>Search Not Found</h1>
            <p>Try different keyword or search again</p>
          </>
        )}
      </div>
    )
  }

  renderSearchResults = () => {
    const {searchApiStatus} = this.state
    switch (searchApiStatus) {
      case apiConstants.loading:
        return this.renderLoader()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.success:
        return this.renderSearchView()
      default:
        return null
    }
  }

  render() {
    const {searchResult} = this.state
    return (
      <>
        <Header
          updateSearchInput={this.updateSearchInput}
          applyFilter={this.applyFilter}
        />
        <div className="home-page">
          {searchResult ? (
            this.renderSearchResults()
          ) : (
            <>
              {this.renderStoryView()}
              <div className="home-posts-container">
                {this.renderHomePosts()}
              </div>
            </>
          )}
        </div>
      </>
    )
  }
}

export default HomePage
