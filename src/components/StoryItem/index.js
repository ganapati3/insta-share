import './index.css'

const StoryItem = props => {
  const {storyDetails} = props
  const {userName, storyUrl} = storyDetails
  return (
    <div className="story-item">
      <img className="story-img" src={storyUrl} alt="user story" />
      <p className="story-name">{userName}</p>
    </div>
  )
}

export default StoryItem
