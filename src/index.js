import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './index.css'
import App from './App'
import Place from './Place'

ReactDOM.render(
<BrowserRouter>
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/place/:id" component={Place} />
    </Switch>
  </BrowserRouter>,
document.getElementById('root'))
