import { User } from "../Classes/User";
import React, { useEffect, Component, FC } from 'react'
import Head from 'next/head'
import firebase from 'firebase'
import { Community } from "../Classes/Community";
import styles from '../styles/grouplist.module.css'
import image from "next/image";
import { useRouter } from "next/router";

interface GPProps {
    groupName: string
}

class GroupPlayers extends Component<GPProps>{

    state = {
        name: " ",
        loading: true,
        players: new Array<User>()
    }

    constructor(props: any) {
        super(props);
        this.setState({name: this.props.groupName});
        this.setState({loading: true});
    }

    async componentDidMount() {
        await this.makeUser();
    }

    makeUser = async() => {
        const db = firebase.database();
        var userRef = db.ref('communities').once("value")
            .then(snapshot => {
                const admins = JSON.parse(snapshot.child(this.props.groupName + "/admins").val());
                if(admins != null) {
                    admins.forEach((admin: any) => {
                        const u: User = new User(admin.username, db);
                        console.log(u.getUsername());
                        this.state.players.push(u);
                    });
                }
                const users = JSON.parse(snapshot.child(this.props.groupName + "/users").val());
                if(admins != null) {
                    users.forEach((user: any) => {
                        const u: User = new User(user.username,db);
                        this.state.players.push(u);
                    });
                }
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
                {this.state.players.map((p) => (
                    <a href={`/Profile/?name=${p.getUsername()}`}><li>{p.getUsername()}, Rating: {p.getRating()}</li></a>
                ))}
            </div>
        )
    }

}



const ListPlayers = () => {
    const db = firebase.database();
    const router = useRouter();
    const params = new URLSearchParams(router.query as unknown as string);
    const name  = params.get("name");
    var sName: string = "";
    if(name) {
        sName = name;
    } 

    return (
        <div>
            <Head>
                <title>My Groups</title>
            </Head>
            <ul className={styles.groupList}>
                <GroupPlayers groupName = {sName}/>
            </ul>
        </div>

    );
}

export default ListPlayers;

