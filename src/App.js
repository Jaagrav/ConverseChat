import React from 'react';
import './App.css';
import './index.css';
import Sign from './pages/Sign'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Route path="/" exact component={Sign} />
      <Route path="/Profile/" component={Profile} />
      <Route path="/Profile/:myUID/Chat/:chatServer" exact component={Chat} />
    </Router>
  );
}

export default App;
