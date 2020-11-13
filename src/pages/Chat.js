import firebase from './components/FirebaseCreds';
import React, { useState, useEffect } from 'react';
import userBackUpImg from './components/userBackUpImg.png'
import sendBtn from './components/sendBtn.png'
import sendImageBtn from './components/sendImageBtn.png'
import ChatMessages from './components/ChatMessages'
import backBtn from './components/backBtn.png'
import { useHistory, useParams } from 'react-router-dom'

let firebaseProfilesRef = firebase.database().ref("Converse Engine/Profiles");
let firebaseMessagingRef = firebase.database().ref("Converse Engine/User-Garbage");

function Chat(props) {
    let history = useHistory();
    const { myUID, chatServer } = useParams();
    let theirUID = chatServer.replace(myUID, "");
    let [theirInfo, setTheirInfo] = useState({
        name: "User Name",
        profilePicture: userBackUpImg
    })
    let myProfilePicture = "";
    firebaseProfilesRef.child(myUID).once("value").then(snap => {
        myProfilePicture = snap.val().profilePicture;
    })

    useEffect(() => {
        firebaseMessagingRef.child(chatServer).child(theirUID).on("child_changed", snap => {
            if (snap.val() !== "")
                document.querySelector(".their-online-status").classList.add("typing");
            else
                document.querySelector(".their-online-status").classList.remove("typing");
        })
        firebaseProfilesRef.child(theirUID).once("value").then(snap => {
            setTheirInfo({
                name: snap.val().name,
                profilePicture: snap.val().profilePicture
            })
        })

    }, [chatServer]);

    function navigateBack() {
        firebaseMessagingRef.child(chatServer).child(myUID).set({
            myProfilePicture: myProfilePicture,
            sentBy: myUID,
            text: "",
            type: "typing-text"
        });
        history.push("/Profile");
    }

    function sendMessage() {
        if (document.querySelector(".message-input").value.trim() !== '')
            firebaseMessagingRef.child(chatServer).push({
                sentBy: myUID,
                text: document.querySelector(".message-input").value.trim(),
                myProfilePicture: myProfilePicture,
                type: "text"
            })
        firebaseMessagingRef.child(chatServer).child(myUID).set({
            myProfilePicture: myProfilePicture,
            sentBy: myUID,
            text: "",
            type: "typing-text"
        });
        document.querySelector(".message-input").value = "";
        document.querySelector(".input-img").style.display = "block";
        document.querySelector(".send-btn").style.display = "none";
        document.querySelector(".message-input").focus();
    }

    function sendImg(e) {
        const fileName = e.target.files[0].name;
        const storageRef = firebase.storage().ref("Converse/User-Shit/" + chatServer + fileName);
        storageRef
            .put(e.target.files[0])
            .on("state_changed", snap => {
                if (snap.bytesTransferred === snap.totalBytes) {
                    firebaseMessagingRef.child(chatServer).push({
                        sentBy: myUID,
                        text: chatServer + fileName,
                        myProfilePicture: myProfilePicture,
                        type: "img"
                    })
                }
            })
        console.log(e.target.files[0])
    }

    function sendMessageOnEnter(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    }

    function sendType(e) {
        if (e.target.value.trim() === "") {
            document.querySelector(".input-img").style.display = "none";
            document.querySelector(".send-btn").style.display = "none";
            firebaseMessagingRef.child(chatServer).child(myUID).set({
                myProfilePicture: myProfilePicture,
                sentBy: myUID,
                text: "",
                type: "typing-text"
            });
        }
        else {
            document.querySelector(".input-img").style.display = "none";
            document.querySelector(".send-btn").style.display = "block";
            firebaseMessagingRef.child(chatServer).child(myUID).set({
                myProfilePicture: myProfilePicture,
                sentBy: myUID,
                text: e.target.value,
                type: "typing-text"
            });
        }
    }

    return (
        <div className='chat-page-container'>
            <div className='chat-page-header'>
                <img className='backBtn' src={backBtn} onClick={navigateBack} />
                <div className='their-stage-name'>{theirInfo.name}</div>
                <img src={theirInfo.profilePicture} className='their-profile-picture' />
                <div className='their-online-status'></div>
            </div>
            <ChatMessages chatServer={chatServer} myUID={myUID} />
            <div className='chat-page-footer'>
                <div className='send-message'>
                    <input type='text' className='message-input' placeholder='Type a message' onKeyPress={sendMessageOnEnter} onChange={sendType} />
                    <img src={sendBtn} className='send-btn' onClick={sendMessage} />
                    <div className='input-img'>
                        {/* <input type='file' accept="image/*" className='send-img' onChange={sendImg} /> */}
                        <img src={sendImageBtn} className='send-img-btn' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;