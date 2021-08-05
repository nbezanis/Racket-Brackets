import React, { useContext, useRef } from 'react';
import firebase from 'firebase';
import Head from 'next/head';
import { AuthContext } from '../auth/AuthContext';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'next/dist/client/router';
import {User} from "../Classes/User";

//The page that allows existing users to log in to the app

const LogIn = () => {
    const user = useContext(AuthContext);

    const router = useRouter();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    //This takes in an email and returns the piece before the '@'
    const cleanEmail = (email: String | null | undefined) => {
        if(email == null) return "user"
        return email.split("@")[0]
    }

    //The sign in method that verifies the users credentials and signs them in if user exists
    const SignIn = async () => {
        try {
            const credentials = await auth.signInWithEmailAndPassword(emailRef.current!.value,passwordRef.current!.value);
            User.TEMP_NAME = cleanEmail(credentials.user?.email)
            localStorage.setItem("username",cleanEmail(credentials.user?.email));
            router.push(`/Profile/?name=${cleanEmail(credentials.user?.email)}`);
        } catch (e) {
            console.error(e);
        }
    };

    //The code that makes up the page that the user sees.
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
