import Head from 'next/head'
import { Community } from '../Classes/Community';
import firebase from 'firebase';
import { useRef } from 'react';
import { User } from '../Classes/User';
import router from 'next/router';
import styles from '../styles/Home.module.css'
/*
*This page takes input from the user including group name and location, and 
*creates a new group based on those things. 
*/

// Linked to from the "My Clubs" page after clickin "Create New Group" option

//newGroup Page
//Provides interface for creating a new Community object
const newGroup = () => {

    //Establish refs to grab data from input fields
    const groupNameRef = useRef<HTMLInputElement>(null);
    const groupLocRef = useRef<HTMLInputElement>(null);

    //newGroup.createGroup()
    //This method creates a new group
    const createGroup = () => {
        const db = firebase.database();
        //Create new community with input community name
        const commName = groupNameRef.current!.value
        const c = new Community(commName,db);
        let s = " ";
        //Create user object from username to create founding user
        const name = localStorage.getItem("username");
        if(name) {
            s = name;
        }
        const u = new User(s,db);
        //Create new database entry for this group with provided data
        c.createCommunity(u,groupLocRef.current!.value,db);
        const userRef = db.ref('users');
        userRef.once("value")
            .then(snapshot => {
                if(snapshot.hasChild(s)) {
                    const user = snapshot.child(s).val();
                    let comms: Array<string> = JSON.parse(user.groups);
                    if(!comms) {
                        console.log("blank user");
                        comms = [];
                    }
                    comms.push(commName);
                    userRef.child(s).update({
                        groups: JSON.stringify(comms)
                    });
                }
            });
        //Redirect user to new Group's profile page
        router.push(`/GroupProfile/?name=${c.getCommunityName()}`)
    }

    //This is the code that makes up the page that the user sees
    //Provides field for the group name, group location, and a button to create the group
    return (
        <div>
            <Head>
                <title>Create Group</title>
            </Head>
            <div className = {styles.main}>
            <div className = {styles.grid}>
            <form method="post">
                <input type="text" name="Group Name" placeholder = "Group Name" ref={groupNameRef}/>
                <input type="text" name="GroupLocation" placeholder = "Group Location" ref={groupLocRef}/>
                <button type="button" onClick={createGroup}>Create Group</button>
            </form>
            </div>
            </div>
        </div>
    );
}

export default newGroup;

