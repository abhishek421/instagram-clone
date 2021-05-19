import firebase from "firebase";

   const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBTf8GBGOvaFwi3VqDFXTJFFrdCurICQL4",
    authDomain: "instagram-clone-react-fdc4d.firebaseapp.com",
    projectId: "instagram-clone-react-fdc4d",
    storageBucket: "instagram-clone-react-fdc4d.appspot.com",
    messagingSenderId: "888989367547",
    appId: "1:888989367547:web:b7ee79734cc27b574c845e",
    measurementId: "G-E67TCEWBNG"

   });

   const db = firebaseApp.firestore();
   const auth = firebase.auth();
   const storage = firebase.storage();

   export {db, auth, storage};
    