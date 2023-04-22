import {Switch, Route} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import HomePage from './components/HomePage'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <Route exact path="/" component={HomePage} />
  </Switch>
)

export default App
