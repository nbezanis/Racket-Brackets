import React, { useContext, useRef } from 'react';
import firebase from 'firebase';
import Head from 'next/head';
import { AuthContext } from '../auth/AuthContext';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'next/dist/client/router';
import {User} from "../Classes/User";

/*
*This is the login page. It takes user input, verifies that a user with those credentials 
*exists in the database, and signs them in if so.
*/
const LogIn = () => {
    const user = useContext(AuthContext);

    const router = useRouter();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    //Helper function to help with redirecting to the profile page
    const cleanEmail = (email: String | null | undefined) => {
        if(email == null) return "user"
        return email.split("@")[0]
    }

    //Main sign in function
    const SignIn = async () => {
        try {
            const credentials = await auth.signInWithEmailAndPassword(emailRef.current!.value,passwordRef.current!.value);
            User.TEMP_NAME = cleanEmail(credentials.user?.email)
            router.push(`/Profile/?name=${cleanEmail(credentials.user?.email)}`);
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
