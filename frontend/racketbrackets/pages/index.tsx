import Head from 'next/head';
import styles from '../styles/Home.module.css'
import * as React from "react";

const Home = () => {
  //Should be replaced by Home Page
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
          <form action="/Profile" method="get">
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