import firebase from "firebase"

var firebaseConfig = {
    apiKey: "AIzaSyCFQsM7jg7OnsTHNKp_pxJojFjzo8Vnby0",
    authDomain: "app-clones.firebaseapp.com",
    databaseURL: "https://app-clones.firebaseio.com",
    projectId: "app-clones",
    storageBucket: "app-clones.appspot.com",
    messagingSenderId: "513139469670",
    appId: "1:513139469670:web:29ec37731f283e4d8beca7",
    measurementId: "G-Z9EC53V372"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;