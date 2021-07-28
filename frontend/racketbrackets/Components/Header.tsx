import { useRouter } from "next/dist/client/router";
import React, { Component, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { auth } from "../config/firebaseConfig";

const Header = () => {    
    const user = useContext(AuthContext);
    const router = useRouter();

    const SignOut = async () => {
        await auth.signOut();
        router.push('/');
        };
    
    //May want to replace RacketBrackets Header with Logo?
    return (
        <div className="header">
            <h1><span style ={{color: "forestgreen"}}>Racket</span>Brackets</h1>
            {user && 
                <p className="userStatus">
                    <a id="signOut" onClick={SignOut}>Sign Out</a>
                </p>}
            {!user && 
                <p className="userStatus" id="login-signup">
                    <a href="/LogIn">Log In</a>
                    <a href="/SignUp">Sign Up</a>
                </p>
            }
            <div className="navbar">
                {
                    user &&
                    <p>
                        <a href="/Profile">My Profile</a>
                        <a href="GroupProfile">My Clubs</a>
                        <a>My Matches</a>
                        <a href="/">Search</a>
                    </p>
                }
            </div>
        </div>
    );
}

export default Header;