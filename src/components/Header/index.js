import {Component} from 'react'
import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import {IoCloseCircle} from 'react-icons/io5'
import {GiHamburgerMenu} from 'react-icons/gi'

import './index.css'

class Header extends Component {
  state = {isOpened: false, isSearchBarShow: false}

  openMenu = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened,
      isSearchBarShow: false,
    }))
  }

  closeMenu = () => {
    this.setState({isOpened: false})
  }

  enableSearchBar = () => {
    this.setState({isOpened: false, isSearchBarShow: true})
  }

  enterSearchInput = event => {
    const {updateSearchInput} = this.props
    updateSearchInput(event.target.value)
  }

  onClickLogout = () => {
    const {history} = this.props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onClickFilter = () => {
    const {applyFilter} = this.props
    applyFilter()
  }

  render() {
    const {isOpened, isSearchBarShow} = this.state
    const {location} = this.props
    const {pathname} = location
    const isHomeActive = pathname === '/' ? 'active-link' : 'link-style'
    const isProfileActive =
      pathname === '/my-profile' ? 'active-link' : 'link-style'
    return (
      <div className="sm-main-container">
        <nav className="nav-bar">
          <div className="logo-container">
            <Link to="/" className="link-item">
              <img
                className="header-logo"
                src="https://res.cloudinary.com/dkh18yhyi/image/upload/v1681713063/Standard_Collection_8_sgml2s.png"
                alt="website logo"
              />
            </Link>
            <h1 className="header-logo-name">Insta Share</h1>
          </div>
          <div className="search-links-container">
            <div className="header-search-container">
              <input
                onChange={this.enterSearchInput}
                type="search"
                className="header-search-bar"
                placeholder="Search Caption"
              />
              <button
                onClick={this.onClickFilter}
                type="button"
                data-testid="searchIcon"
                className="header-search-btn"
              >
                <FaSearch />
              </button>
            </div>
            <ul className="nav-link-container">
              <Link to="/" className="link-item">
                <li className={isHomeActive}>Home</li>
              </Link>
              <Link to="/my-profile" className="link-item">
                <li className={isProfileActive}>Profile</li>
              </Link>
            </ul>
            <button
              onClick={this.onClickLogout}
              type="button"
              className="logout-btn"
            >
              Logout
            </button>
          </div>
          <button
            onClick={this.openMenu}
            type="button"
            className="hamburger-btn"
          >
            <GiHamburgerMenu />
          </button>
        </nav>
        {isOpened && (
          <div className="sm-menu">
            <ul className="nav-link-container">
              <Link to="/" className="link-item">
                <li className={isHomeActive}>Home</li>
              </Link>
              <Link to="/my-profile" className="link-item">
                <li className={isProfileActive}>Profile</li>
              </Link>
              <li onClick={this.enableSearchBar} className="link-style">
                Search
              </li>
              <button
                onClick={this.onClickLogout}
                type="button"
                className="logout-btn"
              >
                Logout
              </button>
              <button
                onClick={this.closeMenu}
                className="close-btn"
                type="button"
              >
                <IoCloseCircle />
              </button>
            </ul>
          </div>
        )}
        {isSearchBarShow && (
          <div className="sm-search-container">
            <div className="header-search-container">
              <input
                onChange={this.enterSearchInput}
                type="search"
                className="header-search-bar"
                placeholder="Search Caption"
              />
              <button
                onClick={this.onClickFilter}
                type="button"
                data-testid="searchIcon"
                className="header-search-btn"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(Header)
