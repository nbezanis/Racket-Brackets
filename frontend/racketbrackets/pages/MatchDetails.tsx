import React, { Component } from "react";
import { Match } from "../Classes/Match";
import { useRouter } from 'next/router';
import Head from 'next/head';
import firebase from "firebase";
import styles from "../styles/MyMatches.module.css"

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
        opponent: " "
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
                {(!(this.state.details.score) && (this.state.past))? <p>scoreButton</p> : null}
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