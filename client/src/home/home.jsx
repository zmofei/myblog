import React, { useEffect, useState, useRef } from "react";
import CSS from './home.module.scss';
import http from '../commons/http.js';

import logo from '../static/img/index/logo.png';
import world from '../static/js/world.js';

function Home() {
  const [msgState, setMsgState] = useState(0); // 0: ready 1: sending 2: sended 3: faild
  // for scroll
  const scrollbody = useRef(null);
  const onClickMore = () => {
    var toTop = document.body.clientHeight || document.documentElement.clientHeight;
    var fromTop = scrollbody.current.scrollTop;
    var loop = setInterval(function () {
      if ((fromTop += 40) >= toTop) {
        clearInterval(loop)
      }
      scrollbody.current.scrollTo(0, fromTop);
    }, 16);
  }

  // for message
  var username = useRef(null);
  var email = useRef(null);
  var message = useRef(null);
  var sendBtn = useRef(null);
  var tips = useRef(null);
  var inputs = [username, email, message];

  const onSendMSG = () => {
    if (msgState === 1) return;
    setMsgState(() => 1);

    http({
      url: '/api/emailmessage',
      method: 'post',
      data: {
        username: username.value,
        email: email.value,
        message: message.value
      },
      success: function (data) {
        setMsgState(() => 2);
        for (var i in inputs) {
          inputs[i].current.value = '';
        }

        tips.current.innerText = 'Message sended';
        tips.current.style.color = '#A5A5A5';
        tips.current.style.opacity = 1;
        setTimeout(function () {
          tips.current.style.opacity = 0;
        }, 2000);
      },
      error: function (data) {
        setMsgState(() => 3);
        for (var i in inputs) {
          inputs[i].current.removeAttribute('disabled');
        }
        tips.current.innerText = 'Message send failed, Please try again';
        tips.current.style.color = '#FF5F5F';
        tips.current.style.opacity = 1;
        setTimeout(function () {
          tips.current.style.opacity = 0;
        }, 4000);
      }
    })
  }


  // for map
  useEffect(() => {
    // init map
    let _map = new world('map');

    let mapData = [
      [110, 19, '北京'],
      [108, 29, '香港'],
      [114, 25, '上海'],
      [106, 37, 'Phuket Island'],
      [101, 19, '敦煌'],
      [111, 24, '黄山'],
      [111, 24, '马鞍山'],
      [111, 24, '合肥'],
      [111, 24, '淮南'],
      [112, 25, '南京'],
      [107, 28, '深圳'],
      [107, 28, '广州'],
      [107, 28, '佛山'],
      [96, 24, '古格王朝'],
      [100, 26, '拉萨'],
      [104, 21, '西宁'],
      [114, 37, 'Semporna [2018/03/02 - 2018/03/07]'],
      [135, 60, 'Auckland'],
      [135, 60, 'Waitomo'],
      [135, 60, 'Matamata'],
      [132, 62, 'Christchurch'],
      [131, 62, 'FOX GLACIER'],
      [131, 63, 'Wanaka'],
      [131, 63, 'Queenstown'],
      [131, 63, 'Dunedin'],
      [130, 63, 'Te Anau'],
      [28, 19, 'Washington, DC [2018/03/24 - 2018/03/31]'],
      [8, 21, 'San Francisco [2018/04/01 - 2018/04/08]'],
      [106, 33, 'Bangkok'],
      [10, 24, 'Los Angeles']
    ]
    mapData.forEach(d => {
      _map.add([d[0], d[1]], {
        title: d[2]
      })
    });

  })

  return (
    <div className={CSS.homeBody} ref={scrollbody}>
      <video className={CSS.videoBg} id="bgvid" autoPlay loop muted poster="//static.zhuwenlong.com/image/index/cover-820e030cca.jpg">
        <source src="//static.zhuwenlong.com/video/bgvideo-0c73e2c57a.mp4" type="video/mp4" />
        <source src="//static.zhuwenlong.com/video/bgvideo-513397179e.webm" type="video/webm" />
        <source src="//static.zhuwenlong.com/video/bgvideo-5428b1617d.ogv" type="video/ogg" />
      </video>
      <div className={CSS.videobg}></div>

      <section className={`${CSS.index} ${CSS.indexCover}`}>
        <div className={CSS.title}>
          <svg
            id="title"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink='http://www.w3.org/1999/xlink'
            x="0px"
            y="0px"
            viewBox="0 0 1000 200"
            enableBackground="new 0 0 1000 200"
            xmlSpace="preserve" >
            <g>
              <path d="M139.8,155.7V51.1h7.1v104.6H139.8z"></path>
              <path d="M216.2,155.7l41.5-104.6h8.8l40.9,104.6h-8.1l-13.4-33.5h-48.3l-13.4,33.5H216.2zM283.2,115.5l-21.5-56.3l-22,56.3H283.2z"></path>
              <path d="M320.1,155.7V51.1h11.1l38.3,95.8l38.1-95.8h11.1v104.6h-7.1V59.2l-39,96.5h-6.5l-39-96.5v96.5H320.1z"></path>
              <path d="M497.7,155.7V51.1h11.1l38.3,95.8l38.1-95.8h11.1v104.6h-7.1V59.2l-39,96.5h-6.5l-39-96.5v96.5H497.7z"></path>
              <path d="M625.9,142.3c-8.5-9.8-12.7-22.7-12.7-38.8c0-16.7,4.2-30,12.7-40c8.5-10,19.8-15,33.9-15c14.1,0,25.4,5,33.9,15c8.5,10,12.7,23.3,12.7,40c0,16.1-4.2,29-12.7,38.8c-8.5,9.8-19.8,14.6-33.9,14.6C645.7,156.9,634.4,152,625.9,142.3zM688.6,137.5c7.2-8.5,10.8-19.8,10.8-34c0-14.6-3.6-26.3-10.8-35.1c-7.2-8.8-16.8-13.2-28.8-13.2s-21.6,4.4-28.8,13.2c-7.2,8.8-10.8,20.5-10.8,35.1c0,14.2,3.6,25.6,10.8,34c7.2,8.6,16.8,12.9,28.8,12.9S681.4,146.1,688.6,137.5z"></path>
              <path d="M723.3,155.7V51.1H788V58h-57.7v40.2h51v6.5h-51v51H723.3z"></path>
              <path d="M800.4,155.7V51.1h68.3V58h-61.2v40.2h55.9v6.5h-55.9V149h61.2v6.7H800.4z"></path>
              <path d="M881.9,155.7V51.1h7.1v104.6H881.9z"></path>
            </g>
          </svg>
          <h2>Open a coffee shop, travel around the world, that should be my life. </h2>
        </div>
        <button className={`${CSS.btn} ${CSS['cover-more']}`} id="More" onClick={onClickMore}>More</button>
      </section>
      <section className={CSS['index-about']}>
        <h2>WHO AM I.</h2>
        <div className={CSS['index-about-who']}>
          <div className={`${CSS['index-about-block']} ${CSS['index-about-identity']}`}>
            <div className={CSS.img}></div>
            <p>Mofei Zhu, 朱文龙。</p>
            <p>高级动物，人科，人属，智人种，公元1989年诞生于银河系-地球（北纬32.6167°，东经116.9833°）。</p>
            <p>性情温和，贱萌，脑袋中无时不刻充斥着奇怪的想法，爱憎分明，典型天蝎气质。</p>
          </div>
          <div className={`${CSS['index-about-block']} ${CSS['index-about-work']}`}>
            <div className={CSS.img}></div>
            <p>与时俱进的电脑迷、程序控。</p>
            <p>2010年接触前端，10-14年在上海易班刷了4年副本，14-18年坐标北京百度，目前带着走向世界的梦想在Mapbox打拼。</p>
            <p>已习得技能 HTML(5), CSS(3), JAVASCRIPT, NODE.JS, PHP, MONGODB, REDIS, LINUX等</p>
          </div>
          <div className={`${CSS['index-about-block']} ${CSS['index-about-dream']}`}>
            <div className={CSS.img}></div>
            <p>文艺的追梦者。</p>
            <p>去过西藏，南极、北极、珠峰是我觉得有机会一定要去的地方。</p>
            <p>梦想开间咖啡店，讲述着自己环游世界的见闻。</p>
          </div>
        </div>
      </section>
      <section className={CSS['index-travel']}>
        <h2>Travel around the world.</h2>
        <h3>That's one of my LIFE GOAL</h3>
        <div className={CSS['index-travel-world']} id="map"></div>
      </section>
      <section className={CSS['index-coffee']}>
        <h2>A Dream follower.</h2>
        <h3>This world , should a coffee shop called mofei</h3>
        <p>我想有家咖啡馆。</p>
        <p>不用很大，慵懒的午后，刚好能容下一群怀揣着梦想的追梦者。</p>
        <p>要有相片，散步在屋里的各个角落，总能吸引眼球，细细品味，这才是人生。</p>
        <p>一定要有故事角，每个阳光满满的下午，总会有位睿智的分享者，述说着他生命中的一个可以是平凡，但总是留给人遐想和回味的故事。偶尔还会有rose级别的人物出现，讲述着TA的“泰坦尼克号”。</p>
        <p>要温馨，难过或者不开心的时候，总能想到这家咖啡店，找个舒服的沙发，品味现磨的手工咖啡，听着娓娓道来的故事，突然忍俊不禁的笑出声来，然后不好意思的捂上嘴，换来身边所有人的会心一笑。</p>
      </section>
      <section className={CSS['index-content']}>
        <h2>联系我</h2>
        <h3>如果有任何问题，可以通过这里给我发邮件</h3>
        <div className={CSS['index-content-box']}>
          <div className={CSS['index-content-boxblock']}>
            <div className={CSS['index-content-boxhalf']}>
              <label>
                <p>昵称/姓名：</p>
                <p>
                  <input id="username" ref={username} />
                </p>
              </label>
            </div>
            <div className={CSS['index-content-boxhalf']}>
              <label>
                <p>联系方式：</p>
                <p>
                  <input id="email" ref={email} />
                </p>
              </label>
            </div>
          </div>
          <div className={CSS['index-content-message']}>
            <label>
              <p>内容：</p>
              <p>
                <textarea id="message" ref={message}></textarea>
              </p>
            </label>
          </div>
          <div className={CSS['index-content-btn']}>
            <button className={CSS['btn']} id="send" ref={sendBtn} onClick={onSendMSG}>
              {msgState === 1 ? 'Sending ...' : msgState === 3 ? 'Try again' : 'Send'}
            </button>
          </div><span className={CSS['index-content-tips']} id="tips" ref={tips}>Message Sended</span>
        </div>
      </section>
      <section className={CSS['index-media']}>
        <a className={CSS['btn']} href="http://weibo.com/zwl1027" target="_blank" rel="noopener noreferrer">微博</a>
        <a className={CSS['btn']} href="https://github.com/zmofei" target="_blank" rel="noopener noreferrer">Github</a>
        <span className={CSS['btn']} id="wechat">Wechat</span>
        <span className={CSS['btn']} id="qq">QQ</span>
        <a className={CSS['btn']} href="https://www.facebook.com/zhuwenlong" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a className={CSS['btn']} href="https://www.linkedin.com/in/mofei-zhu-0a391476" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </section>
      <section className={CSS['index-copyright']}>
        <div className={CSS['index-copyright-top']}></div>
        <div className={CSS['index-copyright-mid']}>
          <div className={CSS['index-copyright-midleft']}></div>
          <div className={CSS['index-copyright-midcenter']}><img src={logo} width="412" alt="logo" /></div>
          <div className={CSS['index-copyright-midright']}></div>
        </div>
        <div className={CSS['index-copyright-bottom']}></div>
      </section>
    </div>
  )
}

export default Home;