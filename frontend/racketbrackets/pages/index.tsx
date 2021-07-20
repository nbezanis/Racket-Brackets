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
          <h2>Search for Communities</h2>
        </a>
        <a className = {styles.searchCard}>
          <h2>Search for Players</h2>
        </a>    
      </div>
     </div>
   </main>
  );
}

export default Home;