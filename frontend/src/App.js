import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import RequestPushimi from "./pages/RequestPushimi"
import AdminPanel from "./pages/AdminPanel"

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/request-pushimi" component={RequestPushimi} />
        <Route path="/admin" component={AdminPanel} />
      </Switch>
    </Router>
  )
}

export default App

