import { User } from "../Classes/User";
import React, { useEffect, Component, FC } from 'react'
import Head from 'next/head'
import firebase from 'firebase'
import { Community } from "../Classes/Community";
import styles from '../styles/grouplist.module.css'
import image from "next/image";
import { useRouter } from "next/router";

interface MGProps {
    username: string
}

class MyGroups extends Component<MGProps>{

    state = {
        name: " ",
        loading: true,
        groups: new Array<Community>()
    }

    constructor(props: any) {
        super(props);
        this.setState({name: this.props.username});
        this.setState({loading: true});
    }

    async componentDidMount() {
        await this.makeUser();
    }

    makeUser = async() => {
        const db = firebase.database();
        var userRef = db.ref('users').once("value")
            .then(snapshot => {
                const comms:Array<string> = JSON.parse(snapshot.child(this.props.username + "/groups").val());
                comms.forEach((comm) => {
                    const c:Community = new Community(comm,db);
                    this.state.groups.push(c);
                });
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
                {this.state.groups.map((g) => (
                    <a href={`/GroupProfile/?name=${g.getCommunityName()}`}><li>{g.getCommunityName()}</li></a>
                ))}
            </div>
        )
    }

}



const GroupList = () => {
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
                <MyGroups username = {sName}/>
                <a /*link to group search*/ ><li>Join a Group</li></a>
                <a href="/newGroup"><li>Create New Group</li></a>
            </ul>
        </div>

    );
}

export default GroupList;