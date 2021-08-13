import React, { useContext, useRef } from 'react';
import firebase from 'firebase';
import Head from 'next/head';
import { AuthContext } from '../auth/AuthContext';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'next/dist/client/router';
import {User} from "../Classes/User";

const LogIn = () => {
    const user = useContext(AuthContext);

    const router = useRouter();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const cleanEmail = (email: String | null | undefined) => {
        if(email == null) return "user"
        return email.split("@")[0]
    }

    const SignIn = async () => {
        try {
            const credentials = await auth.signInWithEmailAndPassword(emailRef.current!.value,passwordRef.current!.value);
            User.TEMP_NAME = cleanEmail(credentials.user?.email)
            var query = firebase.database().ref("users");
            var name = "aaa";
            query.once("value").then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var childData = childSnapshot.val();
                    if(childData.email == credentials.user?.email) {
                        name = childData.username;
                        console.log(name);
                        localStorage.setItem("username",cleanEmail(credentials.user?.email));
                        router.push(`/Profile/?name=${name}`);
                    }

                    /*var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    console.log(childData.email);*/
                });
            });
            
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
      <Head>
        <title>Log In</title>
      </Head>
      <h1 id="pageTitle">Log In</h1>
      <form className="logIn" method="post">
            <input type="text" id="email" name="email" placeholder="Email" ref={emailRef}/><br/>
            <input type="password" id="password" name="password" placeholder="Password" ref={passwordRef}/><br/>
            <button type="button" onClick={SignIn}>Log In</button>
      </form>
    </div>
    );
}

export default LogIn;
