import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', errMsg: ''}

  enterUsername = event => {
    this.setState({username: event.target.value})
  }

  enterPassword = event => {
    this.setState({password: event.target.value})
  }

  submitUserDetails = async () => {
    const {username, password} = this.state
    const {history} = this.props
    const userDetails = {
      username,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      history.replace('/')
    } else {
      this.setState({errMsg: data.error_msg})
    }
  }

  submitLoginForm = event => {
    event.preventDefault()
    this.submitUserDetails()
  }

  render() {
    const {errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <img
          className="login-img"
          src="https://res.cloudinary.com/dkh18yhyi/image/upload/v1681712875/Layer_2_h3f7p9.png"
          alt="website login"
        />
        <form className="login-form" onSubmit={this.submitLoginForm}>
          <img
            className="logo"
            src="https://res.cloudinary.com/dkh18yhyi/image/upload/v1681713063/Standard_Collection_8_sgml2s.png"
            alt="website logo"
          />
          <h1 className="logo-name">Insta Share</h1>

          <div className="input-container">
            <label htmlFor="username">USERNAME</label>
            <input
              placeholder="Username"
              onChange={this.enterUsername}
              type="text"
              className="input-bar"
              id="username"
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">PASSWORD</label>
            <input
              placeholder="Password"
              onChange={this.enterPassword}
              type="password"
              className="input-bar"
              id="password"
            />
            {errMsg !== '' && <p className="err_msg">{errMsg}</p>}
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default LoginForm
