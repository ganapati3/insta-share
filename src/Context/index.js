import {React} from 'react'

const HeaderContext = React.createContext({
  searchInput: '',
  updateSearchInput: () => {},
})

export default HeaderContext
