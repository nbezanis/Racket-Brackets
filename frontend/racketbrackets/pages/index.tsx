import Head from 'next/head';
import styles from '../styles/Home.module.css'
import * as React from "react";

/*
*The home page has two main features, both being search bars. One allows users to search for
*communities while the other allows users to search for other users.
*/

//Also linked to from the "Search" tab on the navbar

const Home = () => {
  //Renders the two search bars on the home page
  //The first search bar will look for users, the second for communities
  return (
    <main>
      <div className = {styles.main}>
      <div className = {styles.grid}>
      <a className = {styles.searchCard}>
          <form action="/Profile" method="get">
            <input type="text" className={styles.search} placeholder="Search for Users" id="name" name="name" />
            <button type="submit">Search</button>
          </form>
        </a> 
        <a className = {styles.searchCard}>
          <form action="/GroupProfile" method="get">
            <input type="text" className={styles.search} placeholder="Search for Communities" id="query" name="query" />
            <button type="submit">Search</button>
          </form>
        </a>    
      </div>
     </div>
   </main>
  );
}

export default Home;