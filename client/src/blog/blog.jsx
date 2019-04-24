import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CSS from './blog.module.scss';
import axios from 'axios';
import moment from 'moment';


// console.log()
let blogReqSource;

function Blog(props) {
  const [tag, setTag] = useState(null);
  const [blogLists, setBlogLists] = useState(null);
  const [page, setPage] = useState({
    current: Number((props.match.params && props.match.params.page) || 1),
    total: 1
  });


  function getSearchObj() {
    const searchObj = {};
    props.location.search.substring(1).split('&').forEach(kv => {
      const kvArr = kv.split('=');
      searchObj[kvArr[0]] = kvArr[1];
    });
    return searchObj;
  }

  useEffect(() => {
    axios.get('/api/blog/tags')
      .then(res => {
        setTag(() => res.data.list);
      });
  }, []);


  useEffect(() => {
    const page = Number(props.match.params.page || 1);

    let { tags } = { ...getSearchObj() };
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    blogReqSource && blogReqSource();

    const CancelToken = axios.CancelToken;

    axios.get(`/api/blog/lists`, {
      cancelToken: new CancelToken(c => {
        blogReqSource = c;
      }),
      params: {
        page,
        tags
      }
    })
      .then(res => {
        setPage(data => {
          data.total = Math.ceil(res.data.page.count / res.data.page.limit);
          data.current = page;
          return data;
        });
        setBlogLists(() => res.data.list);


        // window.scrollTo(0, 0);
      });
  }, [props.match.params.page, props.location.search])


  function getSubNav() {
    if (tag && tag.length > 0) {
      let { tags } = { ...getSearchObj() };
      return tag.map((t, index) => (
        <Link
          className={tags ? Number(tags) === t.classid ? CSS.active : '' : index === 0 ? CSS.active : ''}
          key={t.classid + Math.random()}
          to={{
            pathname: '/blog/1',
            search: t.classid ? `?tags=${t.classid}` : ''
          }} >
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
              info && <a key={`blogclass_${info.classid}`} href={`/blog/1?tags=${info.classid}`}>{info.classname}</a>
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
        <div key={`blog_${blog._id}`} className={CSS["blog-content-block"]}>
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

  function getPageNav() {
    if (!(blogLists && blogLists.length > 0)) return false;
    const start = Math.max(1, page.current - 2);
    const end = Math.min(page.total, page.current + 2);
    const pageArr = [];

    const search = getSearchObj().tags

    for (let i = start; i <= end; i++) {
      pageArr.push(
        <Link key={`page_${i}`} to={{
          pathname: `/blog/${i}`,
          search: (search ? `?tags=${search}` : '')
        }}
          className={i === page.current ? CSS.active : ''}  >{i}</Link>
      )
    }

    return (
      <>
        {page.current > 1 ?
          (<Link
            to={{
              pathname: `/blog/${page.current - 1}`,
              search: (search ? `?tags=${search}` : '')
            }}
            className={`/blog/${page.current - 1}`}>
            Previous
            </Link>) : ''}
        {page.current > 3 ? (
          <>
            <Link
              to={{
                pathname: `/blog/1`,
                search: (search ? `?tags=${search}` : '')
              }}
              className={`/blog/1`}>
              1
          </Link>
            <span>...</span>
          </>
        ) : ''}
        {pageArr}
        {page.total - page.current > 3 ? <span>...</span> : ''}
        {page.current < page.total - 3 ? (
          <Link to={{
            pathname: `/blog/${page.total}`,
            search: (search ? `?tags=${search}` : '')
          }} className={`/blog/${page.total}`}  >{page.total}</Link>
        ) : ''}
        {page.current < page.total ? (
          <Link to={{
            pathname: `/blog/${page.current + 1}`,
            search: (search ? `?tags=${search}` : '')
          }} className={`/blog/${page.current + 1}`}  >Next</Link>
        ) : ''}

      </>
    )
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
        <div className={CSS['blog-pages']}>
          {getPageNav()}
        </div>
      </div>
    </div>
  )
}

export default Blog;