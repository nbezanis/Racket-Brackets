import React, { useContext, useRef } from 'react';
import firebase from 'firebase';
import Head from 'next/head';
import { AuthContext } from '../auth/AuthContext';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'next/dist/client/router';
import { User } from '../Classes/User';

/*
*This is the sign up page. It takes input from the user and calls the CreateUser fuction, which 
*adds the user to the database.
*/

//Linked from the Sign Up option on the Header Component

//SignUp Page
const SignUp = () => {
    const user = useContext(AuthContext);

    const router = useRouter();

    //Establish field refs to retrieve data from inputs later
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const db = firebase.database()

    //SignUp.validate()
    //Check to ensure that the username is taken, the passwords match, the passwords are long enough, and all fields are filled
    const validate = () => {
      //TO DO:
      //  Make sure username isn't taken (might be easier if we organize user db by username (unique) instead of uid)
      //  Make sure passwords match
      //  Make sure passwords are long enough?
    }

    //SignUp.createUser()
    //Creates a new User
    const createUser = async () => {
      try{
        //Establishes firebase authentication for the new user
        await auth.createUserWithEmailAndPassword(emailRef.current!.value,passwordRef.current!.value)
        .then(() => {
          //Then, collect username and email from input fields
          const u = new User(usernameRef.current!.value, db);
          u.createUser(emailRef.current!.value,db);
          User.TEMP_NAME = u.getUsername();
          //store username in localStorage for easy access
          localStorage.setItem("username",u.getUsername());
          //Push user to their new profile page
          router.push(`/Profile/?name=${u.getUsername()}`);
        });
      } catch(e) {
        console.error(e);
      }
    };
  

    //This code makes up what the user sees.
    //Displays fields for the username, email, password, confirming password, and a button to sign up
    //Email and password are used for firebase authentication
    //Username is used as database key for User objects
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
            <button type="button" onClick={createUser}>Sign Up</button>
      </form>
    </div>
    );
}

export default SignUp;
