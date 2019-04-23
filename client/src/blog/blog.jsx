import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CSS from './blog.module.scss';
import axios from 'axios';
import moment from 'moment';

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

  function getBlogClass(classinfo) {
    if (classinfo.length > 0) {
      return (
        <div className={CSS["blog-tag"]}>&#xe901; Tags: &nbsp;
          {
            classinfo.map(info => (
              <a href={`/blog/1?tags=${info.classid}`}>{info.classname}</a>
            ))
          }
        </div>
      )
    } else {
      return '';
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
            {getBlogClass(blog.classid)}
            <a href="/blog/article/5c36ba26b95a0e17952cffd6">
              <div className={CSS["blog-review"]}>
                {blog.content}...
              </div>
            </a>
            <div className={CSS["blog-info"]}>
              <div className={CSS["blog-time"]}>
                <span>&#xe904;</span>
                <span>{moment(blog.pubtime).format('YYYY-MM-DD HH:mm:ss')}</span>
              </div>
              <div className={CSS["blog-read"]}>
                <span>&#xe900; </span>
                <span>{blog.visited} </span>
                <span>&#xe903; </span>
                <span>{blog.like} </span>
                <span>&#xe902; </span>
                <span>{blog.comment}</span>
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