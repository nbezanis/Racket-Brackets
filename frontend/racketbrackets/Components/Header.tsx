import { useRouter } from "next/dist/client/router";
import React, { Component, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { auth } from "../config/firebaseConfig";
import Link from 'next/link'
import { User } from '../Classes/User';

//Header Component
//Present on every page, displays logo, holds login/signup/signout options, creates navbar
const Header = () => {    
    //Establishes Authorization Context from /auth/ files
    const user = useContext(AuthContext);
    const router = useRouter();

    //SignOut function
    //Triggered by signout button
    //clears the cached user data, kicks them back to homepage
    const SignOut = async () => {
        await auth.signOut();
        router.push('/');
        localStorage.removeItem("username");
        };

    //Creates JSX content of the Header
    //Logo is always present
    //Displays LogIn and SignUp if user is not logged in
    //Displays SignOut if user is logged in
    //Populates Navbar if user is logged in
    return (
        <div className="header">
          <Link href = "/">
            <a><h1><span style ={{color: "forestgreen"}}>Racket</span>Brackets</h1></a>
          </Link>
            {user && 
                <p className="userStatus">
                    <a id="signOut" onClick={SignOut}>Sign Out</a>
                </p>}
            {!user && 
                <p className="userStatus" id="login-signup">
                  <Link href="LogIn">
                    <a>Log In</a>
                  </Link>
                  <Link href="SignUp">
                    <a>Sign Up</a>
                  </Link>
                </p>
            }
            <div className="navbar">
                {
                    user &&
                    <p>
                      <Link href={`Profile/?name=${localStorage.getItem("username")}`}>
                        <a>My Profile</a>
                      </Link>
                      <Link href={`GroupList/?name=${localStorage.getItem("username")}`}>
                        <a>My Clubs</a>
                      </Link>
                      <Link href={`MyMatches/?name=${localStorage.getItem("username")}`}>
                        <a>My Matches</a>
                      </Link>
                      <Link href="/">
                        <a>Search</a>
                      </Link>
                    </p>
                }
            </div>
        </div>
    );
}

export default Header;
