import React, { useContext, useRef } from 'react';
import styles from "../styles/profile.module.css";
import Image from 'next/image'
import profilePic from './images/default.png'
import firebase from 'firebase'
import { Community } from '../Classes/Community';
import Router from 'next/router'
import { useRouter } from 'next/router'
import {DiscussionBoard} from '../Classes/DiscussionBoard';

const GroupProfile = () => {

    const router = useRouter();
    const params = new URLSearchParams(router.query as unknown as string);
    const name = params.get("name");
    const db = firebase.database();
    const c = new Community(String(name), db);
    const cname = c.getCommunityName();
    const rating = c.getRating();
    const picture = c.getPicture();
    const location = c.getLocation();
    const board = c.getBoard();
    const postNameRef = useRef<HTMLInputElement>(null);
    const postBodyRef = useRef<HTMLInputElement>(null);

    //calls board.MakePost, which creates and adds a post to the board.
    const createPost = () => {
        var name: string = " ";
        const tempname = localStorage.getItem("username");
        if(tempname) {
            name = tempname;
        }
        board.makePost(name, postNameRef.current!.value, postBodyRef.current!.value);
    }
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
                    <p>Location: {location}</p>
                    <button className={styles.profileButton}>See group ranking</button>
                </div>

                <h2>Discussion Board</h2>
                <ul>
                    <li><u>Profile 1:</u> This is a comment</li>
                </ul>
                <form method="post">
                <input type="text" name="title" placeholder = "Post title" ref={postNameRef}/>
                <input type="text" name="body" placeholder = "Post body" ref={postBodyRef}/>
                <button type="button" onClick={createPost}>Create Post</button>
                 </form>
                <h2>Upcoming Events</h2>
                <ul>
                    <li><u>Tennis tournament, Wednesday, July 17th</u></li>
                </ul>
            </main>

        </div>
    );
}

export default GroupProfile;
