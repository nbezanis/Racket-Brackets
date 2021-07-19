// pages/index.js

import Head from 'next/head';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { auth } from '../config/firebaseConfig';

const Home = () => {
  return (
    <div>
      <Head>
        <title>RB Test</title>
      </Head>
      <h1>Test</h1>
      <a href='/SignUp'>Sign Up</a><br/>
      <a href='/LogIn'>Log In</a><br/>
    </div>
  );
}

export default Home;