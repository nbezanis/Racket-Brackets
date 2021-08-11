import React, { Component } from "react";
import { Match } from "../Classes/Match";
import firebase from "firebase";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { User } from "../Classes/User";

interface MatchProps {
    username: string
}

class UpcomingMatches extends Component<MatchProps> {
    
    state = {
        name: " ",
        loading: true,
        matches: new Array<Match>()
    }

    constructor(props: any) {
        super(props);
        this.setState({name: this.props.username});
        console.log(this.state.name);
        this.setState({loading: true});
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
                console.log(matchArr);
                this.setState({matches:matchArr});
                // const userData = snapshot.child("/users/" + this.state.name).val();
                // if(userData) {
                //     console.log(userData);
                //     console.log(userData.username);
                //     this.setState({matches : JSON.parse(userData.upcomingMatches)});
                // } 
                //Once the data has been loaded, allow page to render
                this.setState({loading: false});
            })
    }

    render() {
        return this.state.loading ? (
            <div>
                <p>loading...</p>
            </div>
        ) : (
            <div>
                {this.state.matches.map((m) => (
                    <a><li>Match at {m.location} on {m.date} <br/> Players: {m.players} </li></a>
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
    console.log(sName);

    //Passes the group name to the GroupPlayers Component
    return (
        <div>
            <Head>
                <title>My Matches</title>
            </Head>
            <ul >
                <UpcomingMatches username = {sName}/>
                <li>Test</li>
            </ul>
        </div>

    );
}

export default MyMatches;