import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Nav from './commons/nav';
import Home from './home/home';
import Blog from './blog/blog';
import Article from './blog/article';
import Lab from './lab/lab';
import Links from './links/links';
import Message from './message/message';
import Copyright from './commons/copyright';


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
      <Route exact path="/lab" component={Lab} />
      <Route exact path="/links" component={Links} />
      <Route exact path="/message" component={Message} />

      <Route path="/" render={(props) => {
        console.log(props)
        if (props.location.pathname !== '/') {
          console.log('111')
          return <Copyright />
        }
      }} />
    </Router>
  );
}

export default BasicExample;
