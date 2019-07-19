import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAIXUkhnSfa9YJ9jXQvjnPBmrzNRDp_SfQ",
    authDomain: "chatkuy-ffeab.firebaseapp.com",
    databaseURL: "https://chatkuy-ffeab.firebaseio.com",
    projectId: "chatkuy-ffeab",
    storageBucket: "chatkuy-ffeab.appspot.com",
    messagingSenderId: "682272875357",
    appId: "1:682272875357:web:e5d235c74d80540f"
};
// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);