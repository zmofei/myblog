import React, { useState } from "react";
import CSS from './message.module.scss';
import Cookie from 'js-cookie';

import nobody from '../static/img/nobody.jpg';

function Message() {
    if (!Cookie.get('userinfo')) {
        Cookie.set('userinfo', {
            username: `游客_` + Math.round(Math.random('1') * 10e3),
            isInit: true
        }, { expires: 999999 })
    }

    const [userinfo, setUserinfo] = useState(Cookie.getJSON('userinfo'));
    const [changingUserinfo, setChangingUserinfo] = useState(false);

    function updateUserinfo(key, value) {
        setUserinfo(info => {
            const newInfo = { ...info };
            newInfo.isInit = false;
            newInfo[key] = value;
            Cookie.set('userinfo', newInfo, { expires: 999999 })
            return newInfo;
        })
    }

    return (
        <>
            <section className={CSS["commend-box"]}>
                <section className={CSS["commend"]}>
                    <div className={CSS["commend-pub"]}>
                        <div className={CSS["commend-pub-info"]}>
                            <div className={CSS["commend-avatar"]}>
                                <img id="useravatar" src={nobody} alt="avatar" />
                            </div>
                            <div className={CSS["commend-input"]}>
                                <div className={CSS["commend-pub-uname"]}
                                    onClick={() => {
                                        setChangingUserinfo(!changingUserinfo)
                                    }}>
                                    <span>{userinfo.username} </span>
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
                                        value={userinfo.username}
                                        onChange={e => {
                                            updateUserinfo('username', e.target.value)
                                        }} />
                                    <input
                                        type="text"
                                        placeholder="邮箱（选填，用以展示头像和接收回复信息）"
                                        value={userinfo.email}
                                        onChange={e => {
                                            updateUserinfo('email', e.target.value)
                                        }} />
                                    <input
                                        type="text"
                                        placeholder="网站（选填，友情链接）"
                                        value={userinfo.link} onChange={e => {
                                            updateUserinfo('link', e.target.value)
                                        }} />
                                </div>
                                <div className={CSS["commend-input-box"]}>
                                    <div className={CSS.textarea} contentEditable="true">写点什么吧</div>
                                    <button className={CSS['commend-pub-btn']}>发布</button>
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