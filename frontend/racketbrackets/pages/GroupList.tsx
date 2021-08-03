import { User } from "../Classes/User";
import React, { useEffect, Component } from 'react'
import Head from 'next/head'
import firebase from 'firebase'
import { Community } from "../Classes/Community";
import styles from '../styles/grouplist.module.css'

class MyGroups extends Component {

    state = {
        uname: "",
        loaded: false,
        groups: new Array<Community>()
    }

    async componentDidMount() {
        await this.content();
        console.log("ready");
    }

    loadUser(uname: string) {
        return new Promise(resolve => {
            const name = localStorage.getItem("username");
            var sName: string = " ";
            if(name) {
                sName = name;
            }
            const db = firebase.database();
            const u = new User(sName,db);
            console.log("exists");
            const communities:Array<Community>= u.getCommunities(); 
            console.log("comm: " + communities.toString())
            this.setState({groups: communities});
            //console.log("inner: " + this.state.groups);
            this.setState({loaded: true})
            setTimeout(resolve,2000);
        });
    }

    content = async() => {
        console.log("running");
        const name = localStorage.getItem("username");
        if(name) {
            console.log("username loaded");
            this.setState({ uname: name});
            const finished = await this.loadUser(name);
        } else {

        }
        // const list:Array<JSX.Element> = [];
        console.log(this.state.groups);
        this.state.groups.forEach((g) => {
            console.log("g " + g.getCommunityName());
        });
        // communities.forEach((comm) => {
        //     console.log(comm.getCommunityName());
        //     //list.push(<li>{comm.getCommunityName()}</li>);
        // });
    }

    render() {
        
        // while (!this.state.loaded) {
        //     continue;
        // }
        const groups = this.state.groups?.map((group, i) => (
            <li>{group.getCommunityName()}</li> 
        ));

        return (
            <div>
                {this.state.loaded?groups:null}
            </div>
        );
    }

}

const GroupList = () => {

    return (
        <div>
            <Head>
                <title>My Groups</title>
            </Head>
            <ul className={styles.groupList}>
                <MyGroups/>
                <a /*link to group search*/ ><li>Join a Group</li></a>
                <a href="/newGroup"><li>Create New Group</li></a>
            </ul>
        </div>

    );
}

export default GroupList;