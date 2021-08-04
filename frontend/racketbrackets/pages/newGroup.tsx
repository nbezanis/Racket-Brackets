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
const newGroup = () => {

    const groupNameRef = useRef<HTMLInputElement>(null);

    const createGroup = () => {
        const db = firebase.database();
        const c = new Community(groupNameRef.current!.value,db);
        var s: string = " ";
        const name = localStorage.getItem("username");
        if(name) {
            s = name;
        }
        const u = new User(s,db);
        c.createCommunity(u,db);
        router.push(`/GroupProfile/?name=${c.getCommunityName()}`)
    }

    return (
        <div>
            <Head>
                <title>Create Group</title>
            </Head>
            <div className = {styles.main}>
            <div className = {styles.grid}>
            <form method="post">
                <input type="text" name="Group Name" placeholder = "Group Name" ref={groupNameRef}/>
                <input type="text" name="GroupLocation" placeholder = "Group Location"/>
                <button type="button" onClick={createGroup}>Create Group</button>
            </form>
            </div>
            </div>
        </div>
    );
}

export default newGroup;

