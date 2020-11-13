import firebase from './FirebaseCreds'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const firebaseRef = firebase.database().ref("Converse Engine/Profiles")

function ShowAllChats(props) {
    let me;
    const [profiles, setProfiles] = useState([]);
    me = props.me;

    useEffect(() => {
        firebaseRef.on("child_added", function (snap) {
            const profile = snap.val();
            setProfiles(prevProfiles => [...prevProfiles, profile]);
        })
    }, []);

    return (
        <div className="chats">
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
        </div >
    )
}

export default ShowAllChats;
