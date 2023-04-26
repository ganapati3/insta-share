import './index.css'

const NotFound = props => {
  const onClickHome = () => {
    const {history} = props
    history.replace('/')
  }
  return (
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dkh18yhyi/image/upload/v1682506609/erroring_1_yudihv.png"
        alt="page not found"
      />
      <h1>Page Not Found</h1>
      <p>
        we are sorry, the page you requested could not be found. Please go back
        to the homepage.
      </p>

      <button onClick={onClickHome} type="button" className="try-again-btn">
        Home Page
      </button>
    </div>
  )
}

export default NotFound
