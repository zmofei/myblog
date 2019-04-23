import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CSS from './blog.module.scss';
import axios from 'axios';

function Blog() {
  const [tag, setTag] = useState(null);
  const [blogLists, setBlogLists] = useState(null);

  useEffect(() => {
    axios.get('/api/blog/tags')
      .then(res => {
        setTag(() => res.data.list);
      })
    axios.get('/api/blog/lists')
      .then(res => {
        setBlogLists(() => res.data.list);
      })
  }, []);

  function getSubNav() {
    if (tag && tag.length > 0) {
      return tag.map(t => (
        <Link to={`/blog/1${(t.classid ? `?tags=${t.classid}` : '')}`} >
          <span className={CSS.subNavIcon}>&#xe901;</span>
          <span>{t.classname}</span>
          <span className={CSS.subNavCount}>{t.classcount}</span>
        </Link>
      ))
    }
  }

  function getBlogLists() {
    if (blogLists && blogLists.length > 0) {
      return blogLists.map(blog => (
        <div className={CSS["blog-content-block"]}>
          <div className={`${CSS["blog-content-text"]} ${CSS["noimg"]}`}>
            <a href={`/blog/article/${blog._id}`}>
              <h2>{blog.title}</h2>
            </a>
            <div className={CSS["blog-tag"]}>&#xe901; Tags: &nbsp;
              <a href="/blog/1?tags=100">JavaScript</a>
              <a href="/blog/1?tags=350">前端基础</a>
            </div>
            <a href="/blog/article/5c36ba26b95a0e17952cffd6">
              <div className={CSS["blog-review"]}>经常处理财务数据的朋友可能会遇到这样一个需求：给定一个数值，转换成固定的长度的字符串，不足的地方前面补零，比如  123   &gt;  000123 。通常我们会尝试这样的做法：let num   123;// 把数值转换成字符串let numStr    num.toString();let strLen   5;// ...
              </div>
            </a>
            <div className={CSS["blog-info"]}>
              <div className={CSS["blog-time"]}>
                <span>&#xe904;</span>
                <span>2019-01-10</span>
              </div>
              <div className={CSS["blog-read"]}>
                <span>&#xe900; </span>
                <span>522 </span>
                <span>&#xe903; </span>
                <span>1 </span>
                <span>&#xe902; </span>
                <span>230</span>
              </div>
            </div>
          </div>
        </div>
      ));
    }
  }

  return (
    <div className={CSS.blogBody}>
      <div className={CSS.blogContent}>
        <div className={CSS.subNav}>
          {getSubNav(tag)}
        </div>
        <div>
          {getBlogLists()}
        </div>
      </div>
    </div>
  )
}

export default Blog;