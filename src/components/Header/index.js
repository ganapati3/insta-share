import {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import {IoCloseCircle} from 'react-icons/io5'
import {GiHamburgerMenu} from 'react-icons/gi'

import './index.css'

class Header extends Component {
  state = {isOpened: false}

  openMenu = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened,
    }))
  }

  closeMenu = () => {
    this.setState({isOpened: false})
  }

  render() {
    const {isOpened} = this.state
    const {location} = this.props
    const {pathname} = location
    const isHomeActive = pathname === '/' ? 'active-link' : 'link-style'
    const isProfileActive =
      pathname === '/profile' ? 'active-link' : 'link-style'
    return (
      <>
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
                type="search"
                className="header-search-bar"
                placeholder="Search Caption"
              />
              <button
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
              <Link to="/profile" className="link-item">
                <li className={isProfileActive}>Profile</li>
              </Link>
            </ul>
            <button type="button" className="logout-btn">
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
              <Link to="/profile" className="link-item">
                <li className={isProfileActive}>Profile</li>
              </Link>
              <li className="link-style">Search</li>
              <button type="button" className="logout-btn">
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
      </>
    )
  }
}

export default withRouter(Header)
