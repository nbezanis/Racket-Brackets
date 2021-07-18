import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import * as React from "react";

export default class HomePage extends React.Component{
    render(){
        return(
            <main>
                <h1>&emsp;&emsp;<span style ={{color: "forestgreen"}}>Racket</span>Brackets</h1>
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
        )
    }
}