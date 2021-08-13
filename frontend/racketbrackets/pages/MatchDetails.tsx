import React, { Component, useRef, useState } from "react";
import { Match } from "../Classes/Match";
import { useRouter } from 'next/router';
import Head from 'next/head';
import firebase from "firebase";
import styles from "../styles/MyMatches.module.css"
import { User } from "../Classes/User";

interface ScoreProps{
    p1:string,
    p2:string,
    mid: string
}

class Score extends Component<ScoreProps>{

    private p1Ref = React.createRef<HTMLInputElement>()
    private p2Ref = React.createRef<HTMLInputElement>()

    state = {
        player1: " ",
        player2: " ",
        user1: new User(" ",firebase.database()),
        user2: new User(" ",firebase.database())
    }

    constructor(props:any) {
        super(props);
        this.setState({
            player1: this.props.p1,
            player2: this.props.p2
        });
    }

    async componentDidMount() {
        await this.loadUser();
    }

    loadUser = async() => {
        const db = firebase.database();
        var userRef = db.ref("/users").once("value")
            .then(snapshot => {
                const p1 = snapshot.child(this.props.p1).val();
                const p2 = snapshot.child(this.props.p2).val();
                this.setState({
                    user1: p1,
                    user2: p2
                });
            })
        
    }

    async score() {
        var p1Rating = this.state.user1.rating;
        var p2Rating = this.state.user2.rating;
        console.log(p1Rating + " " + p2Rating)
        var p1Prob = (1.0/(1+Math.pow(10,((p2Rating - p1Rating)/400))));
        var p2Prob = (1.0/(1+Math.pow(10,((p1Rating - p2Rating)/400))));
        console.log(p1Prob + " " + p2Prob)
        var winner: string = " ";
        if(this.p1Ref.current!.checked) {
            console.log("p1");
            winner = this.state.user1.username;
            p1Rating += 30*(1-p1Prob);
            p2Rating += 30*(0-p2Prob);
        } else if(this.p2Ref.current!.checked){
            console.log("p2");
            winner = this.state.user2.username
            p1Rating += 30*(0-p1Prob);
            p2Rating += 30*(1-p2Prob);
        }
        console.log("P1: " + p1Rating + " P2: " + p2Rating);
        var userRef = firebase.database().ref('users');
        userRef.child(this.state.user1.username).update({
            rating: p1Rating
        });
        userRef.child(this.state.user2.username).update({
            rating: p2Rating
        });
        var matchRef = firebase.database().ref('matches');
        matchRef.child(this.props.mid).update({
            score: winner
        });
        window.location.reload();
    }

    render() {
        return(
            <div>
            
            <b> Choose Winner</b>
            <form method="post">
                <input type="radio" id="p1" name="winner" value={this.props.p1} ref={this.p1Ref}/>
                <label htmlFor="p1">{this.props.p1}</label><br/>
                <input type="radio" id="p2" name="winner" value={this.props.p2} ref={this.p2Ref}/>
                <label htmlFor="p2">{this.props.p2}</label><br/>
                <button type="button" onClick={() => this.score()}> Score Game </button>
            </form>
            </div>
        )
    }
}

interface MDProps {
    id: string
}

class MatchData extends Component<MDProps>{

    state = {
        db: firebase.database(),
        id: " ",
        loading: true,
        details: new Match(0,firebase.database().ref("matches")),
        past: false,
        opponent: " ",
        user: " ",
        updated: false
    }

    constructor(props:any) {
        super(props);
        this.setState({
            id: this.props.id,
            loading: true
        });
    }

    async componentDidMount() {
        await this.loadMatch();
    }

    async componentDidUpdate(prevProps: any) {
		//If the current props are different (i.e. different username passed), reload the page data
        if(this.state.updated) {
            await this.loadMatch();
            this.state.updated = false;
        }
	}

    loadMatch = async() => {
        var matchRef = this.state.db.ref("/").once("value")
            .then(snapshot => {
                const match = snapshot.child("/matches/" + this.props.id).val();
                console.log(match);
                this.setState({details: match});
                const players: Array<string> = JSON.parse(match.players);
                players.forEach((p:string) => {
                    if(p != localStorage.getItem("username")) {
                        this.setState({opponent: p});
                    } else {
                        this.setState({user: p});
                    }
                });
                const d: Date = new Date(match.date);
                const today: Date = new Date();
                if(d < today) {
                    this.setState({past: true});
                }
            })
        this.setState({loading: false});
    }

    formatDates(date: string):string {
        const  d = new Date(date);
        var out: string = d.toLocaleString(undefined,{ weekday: "long", year: 'numeric', month: 'long', day: 'numeric' }) + " " + d.toLocaleTimeString('en-US');
        return out;
    }

    render() {
        return this.state.loading ? (
            <div>
                <p>loading...</p>
            </div>
        ) : (
            <div className={styles.content}>
                <p><b>Match Date:</b> {this.formatDates(this.state.details.date)}</p>
                <p><b>Match Location:</b> {this.state.details.location}</p>
                <p><b>Opponent: </b><a href={`/Profile/?name=${this.state.opponent}`}>{this.state.opponent}</a></p>
                {(!(this.state.details.score) && (this.state.past))? <Score p1={this.state.user} p2={this.state.opponent} mid={this.props.id}/> : null}
                {this.state.details.score ? <p><b>Winner: </b> {this.state.details.score}</p> : null}
            </div>
        )
    }
}

const MatchDetails = () => {
    const router = useRouter();
    //Grabs group name from the URL Parameters
    const params = new URLSearchParams(router.query as unknown as string);
    const name  = params.get("id");
    var sName: string = "";
    if(name) {
        sName = name;
    } 
    console.log(sName);

    return (
        <div>
            <Head>
                <title>Match Details</title>
            </Head>
            <MatchData id={sName}/>
        </div>
    )
}

export default MatchDetails;