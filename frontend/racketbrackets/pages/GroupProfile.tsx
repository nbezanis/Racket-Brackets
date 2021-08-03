import React, { useContext, useRef, useRouter } from 'react';
import styles from "../styles/profile.module.css";
import Image from 'next/image'
import profilePic from './images/default.png'
import firebase from 'firebase'
import { Community } from '../Classes/Community';

const GroupProfile = () => {

    const router = useRouter();
    const params = new URLSearchParams(router.query as unknown as string);
    const name = params.get("name");
    const db = firebase.database();
    const c = new Community(String(name), db);
    const cname = c.getCommunityName();
    const rating = c.getRating();
    const picture = c.getPicture();

    return (
        <div className={styles.container}>
            <main className={styles.main}>

                <div className = {styles.imgWithText}>
                    {/*<Image*/}
                    {/*  priority*/}
                    {/*  src={profilePic}*/}
                    {/*  className={styles.borderCircle}*/}
                    {/*  height={288}*/}
                    {/*  width={288}*/}
                    {/*  alt={name}*/}
                    {/*/>*/}
                    <p>Group name: {name}</p>
                    <p>Average rating: {rating}</p>
                    <button className={styles.profileButton}>See group ranking</button>
                </div>

                <h2>Discussion Board</h2>
                <ul>
                    <li><u>Profile 1:</u> This is a comment</li>
                </ul>
                <button className={`${styles.postButton} ${styles.profileButton}`}>Post to Group</button>
                <h2>Upcoming Events</h2>
                <ul>
                    <li><u>Tennis tournament, Wednesday, July 17th</u></li>
                </ul>
            </main>

        </div>
    );
}

export default GroupProfile;
