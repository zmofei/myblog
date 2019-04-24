import React from "react";
import CSS from './message.module.scss';

import nobody from '../static/img/nobody.jpg';
function Message() {
    return (
        <>
            <section className={CSS["commend-box"]}>
                <section className={CSS["commend"]}>
                    <div className={CSS["commend-pub"]} id="commend">
                        <div className={CSS["commend-pub-info"]}>
                            <div className={CSS["commend-avatar"]}><img id="useravatar" src={nobody} alt="avatar" /></div>
                            <div className={CSS["commend-pub-text"]} id="commendTips">Write a response...</div>
                            <div className={CSS["commend-pub-uname"]} id="commendUsername">Mofei Zhu</div>
                        </div>
                        <div className={CSS["commend-pub-box"]} id="commendBox" contenteditable="contenteditable"></div>
                        <button className={CSS["commend-pub-btn"]} id="publish">publish</button>
                    </div>
                </section>
            </section>
        </>
    )
}

export default Message;