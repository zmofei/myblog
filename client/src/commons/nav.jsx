import { BrowserRouter as Router, Link } from "react-router-dom";
import React from "react";
import logo from '../static/img/logo-ico.png'
import CSS from './nav.module.scss'


function nav() {
  return (

    <div className={CSS.head}>
      <div className={CSS.logo}>
        <img src={logo} alt="logo"></img>
        <span>Hi! I AM Mofei!</span>
      </div>
      <ul className={CSS.nav}>
        <li>
          <Link to="/">首页</Link>
        </li>
        <li>
          <Link to="/about">博客</Link>
        </li>
        <li>
          <Link to="/topics">实验室</Link>
        </li>
        <li>
          <Link to="/topics">留言</Link>
        </li>
        <li>
          <Link to="/topics">小伙伴</Link>
        </li>
        <li>
          <Link to="/topics">English</Link>
        </li>
        <li>
          <Link to="/topics">RSS</Link>
        </li>
      </ul>
    </div>

  )
}

export default nav;