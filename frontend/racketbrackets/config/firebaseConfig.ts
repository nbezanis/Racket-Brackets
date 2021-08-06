import firebase from 'firebase';

//Firebase API keys
const firebaseConfig = {
    apiKey: "AIzaSyDldes9_aTzqiItbx1G-i0oowPwzKtEs4w",
    authDomain: "racket-bracket.firebaseapp.com",
    databaseURL: "https://racket-bracket-default-rtdb.firebaseio.com",
    projectId: "racket-bracket",
    storageBucket: "racket-bracket.appspot.com",
    messagingSenderId: "1044887724451",
    appId: "1:1044887724451:web:a2a0653c7ec6582545fa16",
    measurementId: "G-ZRWHJ5Z31T"
};

//Singleton to ensure that only one instance of firebase is running at any given time
try {
     firebase.initializeApp(firebaseConfig);
} catch(error) {
    if(!/already exits/.test(error.message)) {
        console.error('Firebase initialization error',error.stack)
    }
}

//Authorization key used to allow user authentication to function
export const auth = firebase.auth();
