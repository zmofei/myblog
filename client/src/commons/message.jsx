import React from "react";
import CSS from './message.module.scss';

import nobody from '../static/img/nobody.jpg';
function Message() {
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
                                <div>
                                    <input type="text" placeholder="昵称"></input>
                                    <input type="text" placeholder="邮箱（选填，用以展示头像和接收回复信息）"></input>
                                    <input type="text" placeholder="网站（选填，用以点击昵称跳转到您的网站）"></input>
                                    <div className={CSS.textarea} contentEditable="true">写点什么吧</div>
                                    <button>发布</button>
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