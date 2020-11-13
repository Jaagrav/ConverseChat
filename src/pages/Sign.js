import React from 'react'
import { useHistory } from 'react-router-dom'
import firebase from './components/FirebaseCreds'
import desktopIllustration from './components/SignpageartDesktop.png'
import mobileIllustration from './components/SignpageartMobile.png'
import twitterSign from './components/TwitterSign.png'
import googleSign from './components/GoogleSign.png'

const auth = firebase.auth();

function Sign() {
    let history = useHistory();

    function logInWithGoogle() {
        var provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
        console.log("Logging In with Google")
    }

    function logInWithTwitter() {
        var provider = new firebase.auth.TwitterAuthProvider();
        auth.signInWithPopup(provider);
        console.log("Logging In with Twitter")
    }

    auth.onAuthStateChanged(userData => {
        console.log(userData)
        if (userData) {
            history.push("/Profile");
        }
    })

    return (
        <div className="sign-page">
            <div className="sign-components">
                <div className="brand-name">Converse</div>
                <div className="signOptions">
                    <img className="googleSign" src={googleSign} onClick={logInWithGoogle} />
                    <img className="twitterSign" src={twitterSign} onClick={logInWithTwitter} />
                </div>
            </div>
            <img className="desktopIllustration" src={desktopIllustration} />
            <img className="mobileIllustration" src={mobileIllustration} />

        </div>

    )
}

export default Sign;