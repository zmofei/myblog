import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './home/home';
import Nav from './commons/nav';

function BasicExample() {
  return (
    <Router>
      <Nav />
      <Route exact path="/" component={Home} />
    </Router>
  );
}

export default BasicExample;
