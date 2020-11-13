import React, { useState, useEffect, useRef, memo } from 'react';
import firebase from './FirebaseCreds';
import profileCover from './profileCover.png';

const firebaseRef = firebase.database().ref("Converse Engine/Profiles");
const firebaseChatRef = firebase.database().ref("Converse Engine/User-Garbage");
let firebaseChatDBListener = firebase.database().ref("Converse Engine/Null");
let readMsgsFunc, lastTextBy;
function ChatMessages(props) {
    let theirPP = "";
    let chatServer = props.chatServer;
    let myUID = props.myUID;
    const chatBoxRef = useRef();
    let theirUID = props.chatServer.replace(myUID, "");
    const [messages, setMessage] = useState([]);
    const [textSpoiler, setTextSpoiler] = useState({});

    useEffect(() => {
        setTextSpoiler({
            myProfilePicture: "",
            text: "",
        });
        firebaseRef.child(theirUID).once("value").then(theirProfileInfo => {
            theirPP = theirProfileInfo.val().profilePicture;
            firebase.database().ref("Converse Engine/User-Garbage").child(chatServer).child(theirUID).on("child_changed", snap => {
                setTextSpoiler({
                    myProfilePicture: theirPP,
                    text: snap.val(),
                })
            })
        })
        lastTextBy = "";
        firebaseChatDBListener.off("child_added", readMsgsFunc);
        setMessage([]);
        chatServer = props.chatServer;
        myUID = props.myUID;
        firebaseChatDBListener = firebaseChatRef.child(chatServer);
        readMsgsFunc = snap => {
            lastTextBy = "";
            setMessage(previousMessage => [...previousMessage, snap.val()]);
        }
        firebaseChatDBListener.on("child_added", readMsgsFunc);
    }, [chatServer]);

    function scrollToBottom() {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }

    function GetImage(imagePath) {
        const storageRef = firebase.storage().ref("Converse/User-Shit/" + imagePath.pathName);

        const [src, setSrc] = useState("");
        storageRef.getDownloadURL().then(function (url) {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function (event) {
                var blob = xhr.response;
            };
            xhr.open('GET', url);

            setSrc(url)
        });
        return (
            <img src={src} className="shared-image" />
        );
    }

    return (
        <div ref={chatBoxRef} className='chat-box'>
            {
                messages.map(convo => (
                    (convo.type !== "typing-text") ?
                        ((convo.type === 'text') ?
                            ((convo.sentBy === myUID) ?
                                (
                                    <div className='text-holder my-text-holder' key={Math.random()}>
                                        <div>
                                            <span className="text">
                                                {convo.text}
                                            </span>
                                        </div>
                                        <img src={convo.myProfilePicture} className="my-text-preview" onLoad={(e) => { scrollToBottom(); lastTextBy = convo.sentBy; }} />
                                    </div>
                                ) : (
                                    <div className='text-holder their-text-holder' key={Math.random()} onLoad={scrollToBottom}>
                                        <img src={convo.myProfilePicture} className='their-text-preview' onLoad={(e) => { e.target.style.opacity = lastTextBy === convo.sentBy ? "0" : "1"; lastTextBy = convo.sentBy; }} />
                                        <div>
                                            <span className="text">
                                                {convo.text}
                                            </span>
                                        </div>
                                    </div>
                                )) : ((convo.sentBy === myUID) ?
                                    (
                                        <div className='text-holder my-text-holder' key={Math.random()}>
                                            <GetImage pathName={convo.text} />
                                            <img src={convo.myProfilePicture} className="my-text-preview" onLoad={(e) => { scrollToBottom(); lastTextBy = convo.sentBy; }} />
                                        </div>
                                    ) : (
                                        <div className='text-holder their-text-holder' key={Math.random()} onLoad={scrollToBottom}>
                                            <img src={convo.myProfilePicture} className='their-text-preview' onLoad={(e) => { e.target.style.opacity = lastTextBy === convo.sentBy ? "0" : "1"; lastTextBy = convo.sentBy; }} />
                                            <GetImage pathName={convo.text} />
                                        </div>
                                    ))) : ""
                ))
            }
            {
                (
                    (textSpoiler.text !== "") ? (
                        <div className='text-holder their-text-holder' key={Math.random()} >
                            <img src={textSpoiler.myProfilePicture} className='their-text-preview' onLoad={scrollToBottom} />
                            <div>
                                <span className="text">
                                    <i>Typing: </i>
                                    {textSpoiler.text}
                                </span>
                            </div>
                        </div>
                    ) : ""
                )
            }
        </div>
    )
}

export default memo(ChatMessages);