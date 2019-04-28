import React, { useState } from "react";
import CSS from './message.module.scss';
import Cookie from 'js-cookie';
import axios from 'axios';
import nobody from '../static/img/nobody.jpg';
import md5 from 'spark-md5';

let avatarInvertId = 0;

function Message(props) {
    if (!Cookie.get('userinfo')) {
        Cookie.set('userinfo', {
            name: `游客_` + Math.round(Math.random('1') * 10e3),
            isInit: true
        }, { expires: 999999 })
    }

    const [userinfo, setUserinfo] = useState(Cookie.getJSON('userinfo'));
    const [changingUserinfo, setChangingUserinfo] = useState(false);
    const [message, setMessage] = useState(null);
    const [avatar, setAvatra] = useState((userinfo && userinfo.email) ? md5.hash(userinfo.email) : '');

    function updateUserinfo(key, value) {
        setUserinfo(info => {
            const newInfo = { ...info };
            newInfo.isInit = false;
            newInfo[key] = value;
            Cookie.set('userinfo', newInfo, { expires: 999999 })
            return newInfo;
        });
    }

    function usePbulish() {
        if (!message) {
            alert('你啥都就没写呐');
        } else {
            axios
                .post('/api/blog/message', { message, id: props.id, avatar })
                .then(data => {
                    console.log(data);
                })
                .catch(e => {
                    alert(e.response.data.err);
                })
        }
    }

    return (
        <>
            <section className={CSS["commend-box"]}>
                <section className={CSS["commend"]}>
                    <div className={CSS["commend-pub"]}>
                        <div className={CSS["commend-pub-info"]}>
                            <div className={CSS["commend-avatar"]}>
                                <img id="useravatar" src={avatar ? `//avatar.zhuwenlong.com/avatar/${avatar}` : nobody} alt="avatar" />
                            </div>
                            <div className={CSS["commend-input"]}>
                                <div className={CSS["commend-pub-uname"]}
                                    onClick={() => {
                                        setChangingUserinfo(!changingUserinfo)
                                    }}>
                                    <span>{userinfo.name} </span>
                                    <span>
                                        {(changingUserinfo || !userinfo.isInit) ? '' : <span>&#xe900;</span>}
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
                                        }} />
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
                                                    return avatarHash;
                                                })
                                            }, 1000)
                                        }}
                                        onBlur={e => {
                                            clearInterval(avatarInvertId);
                                            const avatarHash = md5.hash(e.target.value);
                                            setAvatra(() => {
                                                return avatarHash;
                                            })
                                        }} />
                                    <input
                                        type="text"
                                        placeholder="网站（选填，友情链接）"
                                        value={userinfo.blog} onChange={e => {
                                            updateUserinfo('blog', e.target.value)
                                        }} />
                                </div>
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
                                <div className={CSS["commend-pub-text"]} id="commendTips">留言...</div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </>
    )
}

export default Message;