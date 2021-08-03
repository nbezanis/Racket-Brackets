import Head from 'next/head';
import styles from '../styles/Home.module.css'
import * as React from "react";

/*
*This is the home page of the app. The two main parts of the home page are search bars that
*allow a user to search for other users or search for communities. s
*/
const Home = () => {
  return (
    <main>
      <div className = {styles.main}>
      <div className = {styles.grid}>
      <a className = {styles.searchCard}>
          <form action="/Profile" method="get">
            <input type="text" placeholder="Search for Users" id="name" name="name" />
            <button type="submit">Search</button>
          </form>
        </a> 
        <a className = {styles.searchCard}>
          <form action="/GroupProfile" method="get">
            <input type="text" placeholder="Search for Communities" id="name" name="name" />
            <button type="submit">Search</button>
          </form>
        </a>    
      </div>
     </div>
   </main>
  );
}

export default Home;