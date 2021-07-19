// cofig/firebaseConfig.tsx

import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyALhyf5yW8P97iarcaYik5nK5gBz_1mgcU",
    authDomain: "rb-test-330ae.firebaseapp.com",
    projectId: "rb-test-330ae",
    storageBucket: "rb-test-330ae.appspot.com",
    messagingSenderId: "777682031717",
    appId: "1:777682031717:web:6d130532464d7807b1628c",
    databaseURL: "https://rb-test-330ae-default-rtdb.firebaseio.com"
};

try {
    firebase.initializeApp(firebaseConfig);
} catch(error) {
    if(!/already exits/.test(error.message)) {
        console.error('Firebase initialization error',error.stack)
    }
}

const fire = firebase;
export default fire;

export const auth = firebase.auth();