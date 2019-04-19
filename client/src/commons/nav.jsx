import { Link } from "react-router-dom";
import React, { useRef } from "react";
import logo from '../static/img/logo-ico.png'
import CSS from './nav.module.scss'

function nav(props) {
  // console.log(props)
  const navDom = useRef(null);
  const onClickMenu = () => {
    navDom.current.style.display = getComputedStyle(navDom.current).display === 'none' ? 'block' : 'none';
  }

  return (
    <div className={`${CSS.head} ${(props.path === '/' ? '' : CSS.dark)}`}>
      <div className={CSS.logo}>
        <img src={logo} alt="logo"></img>
        <span>Hi! I'm Mofei!</span>
      </div>
      <button className={CSS['global-nav-btn']} id="navTar" onClick={onClickMenu} />
      <ul className={CSS.nav} ref={navDom} >
        <li>
          <Link to="/">首页</Link>
        </li>
        <li>
          <Link to="/blog">博客</Link>
        </li>
        <li>
          <Link to="/lab">实验室</Link>
        </li>
        <li>
          <Link to="/message">留言</Link>
        </li>
        <li>
          <Link to="/links">小伙伴</Link>
        </li>
        <li>
          <Link to="/topics">English</Link>
        </li>
        <li>
          <Link to="/rss">RSS</Link>
        </li>
      </ul>
    </div>

  )
}

export default nav;