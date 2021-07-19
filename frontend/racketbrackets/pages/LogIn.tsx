import React, { useContext, useRef } from 'react';
import firebase from 'firebase';
import Head from 'next/head';
import { AuthContext } from '../auth/AuthContext';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'next/dist/client/router';

const LogIn = () => {
    const user = useContext(AuthContext);

    const router = useRouter();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const SignIn = async () => {
        try {
            await auth.signInWithEmailAndPassword(emailRef.current!.value,passwordRef.current!.value);
            router.push('/');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
      <Head>
        <title>Log In</title>
      </Head>
      <h1>Log In</h1>
      <form method="post">
            <input type="text" id="email" name="email" placeholder="Email" ref={emailRef}/><br/>
            <input type="password" id="password" name="password" placeholder="Password" ref={passwordRef}/><br/>
            <button type="button" onClick={SignIn}>Log In</button>
      </form>
    </div>
    );
}

export default LogIn;