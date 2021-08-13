import Head from 'next/head'
import { Community } from '../Classes/Community';
import firebase from 'firebase';
import { useRef } from 'react';
import { User } from '../Classes/User';
import router from 'next/router';
import styles from '../styles/Home.module.css'
import { Match } from '../Classes/Match';
/*
*This page takes input from the user to create a new match and challenge another
* player to a game of tennis
*/

// Linked to from another player's profile from the "Challenge Player" button

//newGroup Page
//Provides interface for creating a new Community object
const newMatch = () => {

    //Establish refs to grab data from input fields
    const matchLocRef = useRef<HTMLInputElement>(null);
    const matchDateRef = useRef<HTMLInputElement>(null);

    //newGroup.createGroup()
    //This method creates a new group
    const createMatch = () => {
        const db = firebase.database();
        //Create new match to load data into
        const m = new Match(0,db);
        var s: string = " ";
        //Create user object from username to create first player
        const name = localStorage.getItem("username");
        if(name) {
            s = name;
        }
        const u = new User(s,db);
        const params = new URLSearchParams(router.query as unknown as string);
        const oppName = params.get("name");
        var sName: string = " ";
        if(oppName) {
            sName = oppName;
        }
        const opponent = new User(sName,db);
        var players: Array<User> = [];
        players.push(u);
        players.push(opponent);
        //TODO: Validate that the input date is in the future, show error to user
        const date = new Date(matchDateRef.current!.value);
        console.log(date.toString());
        console.log(date.toISOString());
        const date2 = new Date(date.toISOString());
        console.log(date2);
        //Create new database entry for this match with provided data
        m.createMatch(players,new Date(matchDateRef.current!.value),matchLocRef.current!.value,db);
        //Redirect user to new Group's profile page
        router.push(`/MyMatches/?name=${s}`);
    }

    //This is the code that makes up the page that the user sees
    //Provides field for the match location and date, as well as a button to submit
    return (
        <div>
            <Head>
                <title>Challenger User</title>
            </Head>
            <div className = {styles.main}>
            <div className = {styles.grid}>
            <form method="post">
                <input type="text" name="MatchLocation" placeholder = "Match Location" ref={matchLocRef}/>
                <input type="datetime-local"  name="MatchDate" ref={matchDateRef}/>
                <button type="button" onClick={createMatch}>Send Challenge</button>
            </form>
            </div>
            </div>
        </div>
    );
}

export default newMatch;

