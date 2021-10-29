import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './views/Home'
import Letter from './views/Letter'
import Login from './views/Login'
import Results from './views/Results'

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/results" component={Results} />
          <Route path="/login" component={Login} />
          <Route path="/test/:id" component={Letter} />
          <Route path="/" strict component={Home} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
