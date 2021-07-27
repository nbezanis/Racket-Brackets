// pages/SignIn.tsx

import React, { useContext, useRef } from 'react';
import firebase from 'firebase';
import Head from 'next/head';
import { AuthContext } from '../auth/AuthContext';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'next/dist/client/router';
import { User } from '../Classes/User';


const SignUp = () => {
    const user = useContext(AuthContext);

    const router = useRouter();

    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const db = firebase.database()

    const validate = () => {
      //TO DO:
      //  Make sure username isn't taken (might be easier if we organize user db by username (unique) instead of uid)
      //  Make sure passwords match
      //  Make sure passwords are long enough?
    }

    const CreateUser = async () => {
      try{
        await auth.createUserWithEmailAndPassword(emailRef.current!.value,passwordRef.current!.value)
        .then(() => {
          //console.log("user!");
          const u = new User(usernameRef.current!.value);
          u.createUser(emailRef.current!.value,db);
        });
        //Replace this push with a push to the correct profile page
        router.push("/Profile");
      } catch(e) {
        console.error(e);
      }
    };
  
    return (
    <div>
      <Head>
        <title>Sign Up</title>
      </Head>
      <h1 id="pageTitle">Sign Up</h1>
      <form className="logIn" method="post">
            <input type="text" id="username" name="username" placeholder="Username" ref={usernameRef}/><br/>
            <input type="text" id="email" name="email" placeholder="Email" ref={emailRef}/><br/>
            <input type="password" id="password" name="password" placeholder="Password" ref={passwordRef}/><br/>
            <input type="password" id="confPassword" name="confPassword" placeholder="Confirm Password"/><br/>
            <button type="button" onClick={CreateUser}>Sign Up</button>
      </form>
    </div>
    );
}

export default SignUp;