import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CSS from './article.module.scss';
import axios from 'axios';
import moment from 'moment';

import avatra from '../static/img/avatar.jpg';
import blogMoney from '../static/img/blog/money.png';

function Article(props) {
  const id = props.match.params.id;
  const [blog, setBlog] = useState(null);
  useEffect(() => {
    axios.get(`/api/blog/article/${id}`)
      .then(res => {
        setBlog(() => {
          return res.data.data;
        })
      })
  }, [])

  function getBlog() {
    if (blog) {
      return (
        <div className={CSS.articleBody}>
          <section className={CSS.blog}>
            <section className={CSS.article}>
              <section className={CSS["article-content"]}>
                <h1>{blog.title}</h1>
                <div className={`${CSS["commend-user"]} ${CSS["article-pubinfo"]}`}>
                  <div className={CSS["commend-avatar"]}><img src={avatra} alt="avatar" /></div>
                  <div className={CSS["commend-info"]}>
                    <div className={CSS["commend-name"]}>
                      <Link to="/">Mofei Zhu </Link>
                    </div>
                    <div className={CSS["commend-time"]}>
                      <time>{moment(blog.pubtime).format('YYYY-MM-DD HH:mm:ss')}</time>
                    </div>
                  </div>
                </div>
                <div className={CSS["blog-content"]}>
                  <div dangerouslySetInnerHTML={{ __html: blog.html }} />
                  <div className={CSS["blog-money"]}><img src={blogMoney} alt="sponsorship" /></div>
                </div>
              </section>
              <section className={CSS["article-tags"]}>
                {
                  blog.classid.map(klass => <a href={`/blog/1?tags=${klass.classid}`}>{klass.classname}</a>)
                }
                <section className={CSS["article-info"]}>
                  <div className={CSS["article-fns"]}>
                    <div className={`${CSS["article-info-makegood"]} ${CSS["article-fns-block"]}`} id="makegood">&#xe903;</div>
                  </div>
                  <span className={CSS["article-info-icon"]}>&#xe900;</span>
                  <span>{blog.visited}</span>
                  <span className={CSS["article-info-icon"]}>&nbsp;&#xe903;</span>
                  <span className={CSS["count"]} id="goodCount">{blog.like}</span>
                  <span className={CSS["article-info-icon"]}>&nbsp;&#xe902;</span>
                  <span>{blog.comment}</span>
                </section>
              </section>
            </section>
          </section>
        </div >
      )
    } else {
      return ''
    }
  }

  return getBlog()
}

export default Article;