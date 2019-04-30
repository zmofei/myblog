import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CSS from './message.module.scss';
import Cookie from 'js-cookie';
import axios from 'axios';
import md5 from 'spark-md5';
import moment from 'moment';

let avatarInvertId = 0;

function getListByID(id, callback) {
    axios.get(`/api/blog/messagelist?id=${id}`)
        .then(res => {
            callback(res.data.list || [])
        })
}

function Message(props) {
    if (!Cookie.get('userinfo')) {
        Cookie.set('userinfo', {
            name: `游客_` + Math.round(Math.random('1') * 10e3),
            isInit: true
        }, { expires: 999999 })
    }

    const [userinfo, setUserinfo] = useState(Cookie.getJSON('userinfo'));
    const [changingUserinfo, setChangingUserinfo] = useState(false);
    const [active, setActive] = useState(false);
    const [message, setMessage] = useState(localStorage.getItem('message') || '');
    const [avatar, setAvatra] = useState(`//avatar.zhuwenlong.com/avatar/${(userinfo && userinfo.email) ? md5.hash(userinfo.email) : ''}`);

    //
    const [messageList, setmessageList] = useState([]);

    // replay
    const [activeMessage, setActiveMessage] = useState(null);
    const [replyID, setReplyID] = useState(null);
    const [repMessage, setRepMessage] = useState(localStorage.getItem('repMessage') || '');

    useEffect(() => {
        getListByID(props.id, rst => {
            setmessageList(() => rst);
        })
    }, [])


    function updateUserinfo(key, value) {
        if (key === 'reset') {
            setUserinfo(info => {
                const userinfo = {
                    name: `游客_` + Math.round(Math.random('1') * 10e3),
                    isInit: true
                };
                Cookie.set('userinfo', userinfo, { expires: 999999 })
                return userinfo;
            });
        } else {
            setUserinfo(info => {
                const newInfo = { ...info };
                newInfo.isInit = false;
                newInfo[key] = value;
                Cookie.set('userinfo', newInfo, { expires: 999999 })
                return newInfo;
            });
        }
    }

    function repPbulish() {
        if (!repMessage) {
            alert('没写东西，不许你回复！！');
        } else {
            axios
                .post('/api/blog/message', { message: repMessage, id: props.id, avatar, replyID })
                .then(data => {
                    getListByID(props.id, rst => {
                        setmessageList(() => rst);
                    });
                    setRepMessage(() => '');
                    setActiveMessage(() => '');
                    setReplyID(() => '');
                    alert('发布成功啦！');
                })
                .catch(e => {
                    alert(e.response.data.err);
                })
        }
    }

    function usePbulish() {
        if (!message) {
            alert('你啥都就没写呐');
        } else {
            axios
                .post('/api/blog/message', { message, id: props.id, avatar })
                .then(data => {
                    getListByID(props.id, rst => {
                        setmessageList(() => rst);
                    });
                    setMessage(() => '');
                    alert('发布成功啦！');
                })
                .catch(e => {
                    alert(e.response.data.err);
                })
        }
    }

    function setUserInfo() {
        return (
            <>
                <div className={CSS["commend-pub-uname"]}
                    onClick={() => {
                        setChangingUserinfo(!changingUserinfo)
                    }}>
                    <span>{userinfo.name} </span>
                    <span>
                        {(changingUserinfo || !userinfo.isInit) ? '' : <span>&#xe906;</span>}
                    </span>
                </div>
                <div className={CSS["commend-input-box"]} style={{
                    display: (changingUserinfo ? 'block' : 'none')
                }}>
                    <input
                        type="text"
                        placeholder="昵称"
                        value={userinfo.name}
                        onChange={e => {
                            updateUserinfo('name', e.target.value)
                        }}
                        onBlur={e => {
                            if (e.target.value === '') {
                                updateUserinfo('reset');
                            }
                        }
                        } />
                    <input
                        type="text"
                        placeholder="邮箱（选填，用以展示头像和接收回复信息）"
                        value={userinfo.email}
                        onChange={e => {
                            const emailVal = e.target.value;
                            updateUserinfo('email', emailVal);
                            clearInterval(avatarInvertId);
                            avatarInvertId = setTimeout(() => {
                                const avatarHash = md5.hash(emailVal);
                                setAvatra(() => {
                                    return `//avatar.zhuwenlong.com/avatar/${avatarHash}`;
                                })
                            }, 500)
                        }}
                        onBlur={e => {
                            clearInterval(avatarInvertId);
                            const avatarHash = md5.hash(e.target.value);
                            setAvatra(() => {
                                return `//avatar.zhuwenlong.com/avatar/${avatarHash}`;
                            })
                        }} />
                    <input
                        type="text"
                        placeholder="网站（选填，友情链接）"
                        value={userinfo.blog} onChange={e => {
                            updateUserinfo('blog', e.target.value)
                        }} />
                </div>
            </>
        )
    }

    return (
        <>
            <section className={CSS["commend-box"]}>
                <section className={CSS["commend"]}>
                    <div className={CSS["commend-pub"]} onClick={() => { setActive(() => true) }}>
                        <div className={CSS["commend-pub-info"]}>
                            <div className={CSS["commend-avatar"]}>
                                <img
                                    id="useravatar"
                                    src={avatar || '//avatar.zhuwenlong.com/avatar/'}
                                    alt="avatar" />
                            </div>
                            <div className={CSS["commend-input"]}>
                                <div className={`${CSS["comment-handle"]} ${active ? CSS['active'] : ''}`}>
                                    {setUserInfo()}
                                    <div className={CSS["commend-input-box"]}>
                                        <textarea
                                            className={CSS.textarea}
                                            placeholder="写点什么吧（ 👻支持MarkDown哦 )"
                                            onChange={e => {
                                                const value = e.target.value;
                                                localStorage.setItem('message', value);
                                                setMessage(() => value)
                                            }} value={message} />
                                        <button className={CSS['commend-pub-btn']} onClick={usePbulish}>发布</button>
                                    </div>
                                </div>
                                <div style={{ display: active ? 'none' : '' }} className={CSS["commend-pub-text"]} id="commendTips">留言...</div>
                            </div>
                        </div>
                    </div>
                    {messageList.map(l => {
                        return (
                            <div
                                className={`${CSS["commend-pub"]} ${l._id === activeMessage ? CSS['commend-active'] : ''}`}
                                onMouseEnter={() => {
                                    setActiveMessage(() => {
                                        return l._id;
                                    });
                                }}
                                onMouseLeave={() => {
                                    setActiveMessage(() => {
                                        return null;
                                    });
                                }}
                            >
                                <div className={CSS["commend-avatar"]}>
                                    <img src={l.avatar || '//avatar.zhuwenlong.com/avatar/'} alt="avatar" />
                                </div>
                                <div className={CSS["commend-input"]}>
                                    <div className={CSS["commend-info"]}>
                                        <div className={CSS["commend-name"]}>
                                            {l.blog ?
                                                <Link
                                                    to={{
                                                        pathname: `/api/jump`,
                                                        search: `?url=${l.blog}`,
                                                    }}
                                                    target="_blank"
                                                >
                                                    {l.name}&nbsp;
                                                </Link> : <span>{l.name} </span>
                                            }
                                            <span className={CSS["commend-time"]}>
                                                {moment(l.time).format('YYYY-MM-DD HH:mm:ss')}
                                            </span>
                                            <div
                                                className={`${CSS["commend-replay"]} ${CSS["commend-replay-btn"]}`}
                                                onClick={() => {
                                                    setReplyID(() => l._id)
                                                }}
                                            >
                                                &#xe8af; 回复
                                            </div>
                                        </div>
                                    </div>
                                    <div className={CSS["commend-text"]}
                                        dangerouslySetInnerHTML={{ __html: (l.replyTxt || '') + l.content }}></div>
                                    <div className={CSS["commend-input-box"]}
                                        style={{ display: replyID === l._id ? 'block' : 'none' }}>
                                        {setUserInfo()}
                                        <textarea
                                            className={CSS.textarea}
                                            placeholder="写点什么吧（ 👻支持MarkDown哦 )"
                                            onChange={e => {
                                                const value = e.target.value;
                                                localStorage.setItem('repMessage', value);
                                                setRepMessage(() => value)
                                            }} value={repMessage}
                                            autoFocus={replyID === l._id ? true : false}
                                        />
                                        <button
                                            className={CSS['commend-pub-btn']}
                                            onClick={() => { repPbulish() }}
                                        >发布</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </section>
            </section>
        </>
    )
}

export default Message;