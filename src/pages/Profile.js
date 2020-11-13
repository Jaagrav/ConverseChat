import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import firebase from './components/FirebaseCreds'
import ShowAllChats from './components/ShowAllChats'
import ShowAllContacts from './components/ShowAllContacts'
import logoutBtn from './components/logoutBtn.svg';
import searchIcon from './components/searchIcon.png';
import userBackUpIcon from './components/userBackUpImg.png';
import addChatBtn from './components/addChatBtn.png';


const auth = firebase.auth();
const firebaseRef = firebase.database().ref("Converse Engine");


function Profile() {
    let history = useHistory();
    const [myInfo, setMyInfo] = useState({
        name: "User Name",
        profilePicture: userBackUpIcon,
        uid: ""
    });

    useEffect(() => {
        auth.onAuthStateChanged(userData => {
            if (userData) {
                let myUserData = {
                    name: userData.displayName,
                    profilePicture: userData.photoURL,
                    uid: userData.uid
                };
                setMyInfo(myUserData);
                firebaseRef.child("Profiles").child(userData.uid).set(myUserData);
            }
            else {
                history.push("/");
            }
        })
    }, [])

    function signOut() {
        auth.signOut();
    }

    function toggleContactsChats() {
        document.querySelector('.chats').classList.toggle("show");
        document.querySelector('.contacts').classList.toggle("show");
        document.querySelector('.addChatBtn').classList.toggle("show");
    }

    function searchPeople(e) {
        for (var i = 0; i < document.getElementsByClassName("chat").length; i++) {
            if (!document.getElementsByClassName("chat")[i].querySelector(".chat-name").textContent.toLowerCase().includes(e.target.value.trim().toLowerCase())) {
                document.getElementsByClassName("chat")[i].style.display = "none";
            }
            else {
                document.getElementsByClassName("chat")[i].style.display = "grid";
            }
        }
    }

    return (
        <div className="contacts-chats-bar">
            <div className="profile-header">
                <img src={myInfo.profilePicture} className="my-profile-picture" alt="" />
                <img src={logoutBtn} className="logoutBtn" onClick={signOut} alt="" />
                <div className="my-stage-name">{myInfo.name}</div>
            </div>

            <div className="search-contacts-chats">
                <img src={searchIcon} className="searchIcon" />
                <input type="text" className="search" placeholder="Search" onChange={searchPeople} />
            </div>

            <div className="contacts-chats">
                <ShowAllChats me={myInfo.uid} />
                <ShowAllContacts me={myInfo.uid} />
            </div>

            <img src={addChatBtn} className="addChatBtn" onClick={toggleContactsChats} />
        </div>
    )
}

export default Profile;