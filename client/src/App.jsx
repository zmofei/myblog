import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Nav from './commons/nav';
import Home from './home/home';
import Blog from './blog/blog';

function BasicExample() {
  return (
    <Router>
      <Route children={({ location }) => (
        <Nav path={location.pathname} />
      )} />

      <Route exact path="/" component={Home} />
      <Route exact path="/blog" component={Blog} />
    </Router>
  );
}

export default BasicExample;
