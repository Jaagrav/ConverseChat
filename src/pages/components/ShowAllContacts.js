import firebase from './FirebaseCreds'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

let me;
const firebaseRef = firebase.database().ref("Converse Engine/Profiles")
const firebaseChatRef = firebase.database().ref("Converse Engine/User-Garbage");


function ShowAllContacts(props) {
    const [profiles, setProfiles] = useState([]);
    const [lastText, setLastText] = useState("");
    me = props.me;

    useEffect(() => {
        firebaseChatRef.on("child_added", snap => {
            console.log(snap.key)
            if (snap.key.includes(me)) {
                firebaseRef.child(snap.key.replace(me, "")).once("value").then(profile => {
                    setProfiles(prevProfiles => [...prevProfiles, profile.val()]);
                    setLastText(profile.val().name);
                })
            }
        })
        console.log("HI")
    }, [])

    return (
        <div className="contacts show">
            {
                profiles.map(profile => (
                    (profile.uid !== me) ? (
                        <Link to={"/Profile/" + me + "/Chat/" + (profile.uid.localeCompare(me) < 0 ? (me + profile.uid) : (profile.uid + me))} key={profile.uid}>
                            <div className="chat">
                                <img src={profile.profilePicture} className="chat-img" />
                                <div className="chat-info">
                                    <div className="chat-name">{profile.name}</div>
                                </div>
                            </div>
                        </Link>
                    ) : ""
                ))
            }
        </div>
    )
}

export default ShowAllContacts;
