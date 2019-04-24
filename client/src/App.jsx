import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Nav from './commons/nav';
import Home from './home/home';
import Blog from './blog/blog';
import Article from './blog/article';

function BasicExample() {
  return (
    <Router>
      <Route children={({ location }) => (
        <Nav path={location.pathname} />
      )} />

      <Route exact path="/" component={Home} />
      <Route exact path="/blog" component={Blog} />
      <Route exact path="/blog/:page" component={Blog} />
      <Route exact path="/blog/article/:id" component={Article} />
    </Router>
  );
}

export default BasicExample;
