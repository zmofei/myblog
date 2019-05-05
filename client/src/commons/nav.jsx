import { NavLink } from "react-router-dom";
import React, { useRef } from "react";
import logo from '../static/img/logo-ico.png'
import CSS from './nav.module.scss'

function nav(props) {
  const navDom = useRef(null);
  const onClickMenu = () => {
    navDom.current.style.display = getComputedStyle(navDom.current).display === 'none' ? 'block' : 'none';
  }

  return (
    <div className={`${CSS.head} ${(props.path === '/' ? CSS.index : CSS.dark)}`}>
      <div className={CSS.logo}>
        <img src={logo} alt="logo"></img>
        <span>Hi! I'm Mofei!</span>
      </div>
      <button className={CSS['global-nav-btn']} id="navTar" onClick={onClickMenu} />
      <ul className={CSS.nav} ref={navDom} >
        <li>
          <NavLink to="/" exact={true} activeClassName={CSS.active} onClick={onClickMenu}>首页</NavLink>
        </li>
        <li>
          <NavLink to="/blog" activeClassName={CSS.active} onClick={onClickMenu}>博客</NavLink>
        </li>
        <li>
          <NavLink to="/lab" activeClassName={CSS.active} onClick={onClickMenu}>实验室</NavLink>
        </li>
        <li>
          <NavLink to="/message" activeClassName={CSS.active} onClick={onClickMenu}>留言</NavLink>
        </li>
        <li>
          <NavLink to="/links" activeClassName={CSS.active} onClick={onClickMenu}>小伙伴</NavLink>
        </li>
        <li>
          <NavLink to="/english" activeClassName={CSS.active} onClick={onClickMenu}>English</NavLink>
        </li>
        <li>
          <NavLink to="/rss" target="_blank" activeClassName={CSS.active} onClick={onClickMenu}>
            &#xe905;
          </NavLink>
        </li>
      </ul>
    </div>

  )
}

export default nav;