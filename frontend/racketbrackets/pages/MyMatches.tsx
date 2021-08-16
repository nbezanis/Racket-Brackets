import React, { Component } from "react";
import { Match } from "../Classes/Match";
import firebase from "firebase";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { User } from "../Classes/User";
import styles from "../styles/MyMatches.module.css"

interface MatchProps {
    username: string
}

class UpcomingMatches extends Component<MatchProps> {
    
    state = {
        name: " ",
        loading: true,
        empty: false,
        matches: new Array<Match>()
    }

    constructor(props: any) {
        super(props);
        this.setState({name: this.props.username});
        console.log(this.state.name);
        this.setState({loading: true});
    }

    compare = (a:any, b:any) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return aDate.getTime() - bDate.getTime();
    }

    async componentDidMount() {
        await this.loadMatches();
    }

    loadMatches = async() => {
        const db = firebase.database();
        var userRef = db.ref("/").once("value")
            .then(snapshot => {
                console.log(this.state.name);
                const matchArr:Array<Match> = JSON.parse( snapshot.child("/users/" + this.props.username + "/upcomingMatches").val());
                if(matchArr != false) {
                    matchArr.sort((a,b) => {
                        const aDate = new Date(a.date);
                        const bDate = new Date(b.date);
                        return aDate.getTime() - bDate.getTime();
                    })
                    console.log(matchArr);
                    this.setState({matches:matchArr});
                }
                else {
                    this.setState({empty: true});
                }
                this.setState({loading: false});
            })
    }

    format(array: Array<any>):string {
        var output:string = "";
        array.forEach((e) => {
            output += e + " ";
        });
        return output
    }

    formatDates(date: string):string {
        const  d = new Date(date);
        var out: string = d.toLocaleString(undefined,{ weekday: "long", year: 'numeric', month: 'long', day: 'numeric' }) + " " + d.toLocaleTimeString('en-US');
        return out;
    }

    render() {
        if(this.state.empty) {
            return (
                <div>
                    <p>You do not have any upcoming matches. Try searching for another player and challenge them from their profile.</p>
                </div>
            );
        }
        return this.state.loading ? (
            <div>
                <p>loading...</p>
            </div>
        ) : (
            <div>
                {this.state.matches.map((m) => (
                    <a href={`/MatchDetails/?id=${m.id}`}><li>Match at {m.location} on {this.formatDates(m.date)} <br/> Players: {this.format(m.players)} </li></a>
                ))}
            </div>
        );
    }
}

const MyMatches = () => {
    const router = useRouter();
    //Grabs group name from the URL Parameters
    const params = new URLSearchParams(router.query as unknown as string);
    const name  = params.get("name");
    var sName: string = "";
    if(name) {
        sName = name;
    }

    //Passes the group name to the GroupPlayers Component
    return (
        <div>
            <Head>
                <title>My Matches</title>
            </Head>
            <div className={styles.content}>
                <ul className={styles.content}>
                    <UpcomingMatches username = {sName}/>
                </ul>
            </div>
        </div>

    );
}

export default MyMatches;