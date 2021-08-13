import { User } from "../Classes/User";
import React, { useEffect, Component, FC } from 'react'
import Head from 'next/head'
import firebase from 'firebase'
import { Community } from "../Classes/Community";
import styles from '../styles/grouplist.module.css'
import image from "next/image";
import { useRouter } from "next/router";

/*This page displays the list of groups that a user is a part of.
* It also has two buttons that allow users to create groups or
* search for a group to join.  
*/

//This is where the user will be directed when the click on "My Clubs" in the navbar

//Interface defining props passed to MyGroups Component
//Required by Typescript
interface MGProps {
    username: string
}

//MyGroups Component
//Takes in MGProps as input (Username as a string)
//Loads User's list of groups from the database
//Displays a loading page until data is retrieved
class MyGroups extends Component<MGProps>{

    state = {
        name: " ",
        loading: true,
        groups: new Array<Community>()
    }

    //Constructor for MyGroups Component
    //Input: props - the MGProps object, which contains a string username
    constructor(props: any) {
        super(props);
        this.setState({name: this.props.username});
        //Indicate that the page is still loading to ensure it does not render before data is prepared
        this.setState({loading: true});
    }

    //MyGroups.componentDidMount()
    //Calls the asyncronous function this.makeUser() when the Component is intially mounted on the DOM
    async componentDidMount() {
        await this.makeUser();
    }

    //MyGroups.makeUser()
    //Asyncronously retrieves a list of communities that the user is in from the database
    makeUser = async() => {
        const db = firebase.database();
        var userRef = db.ref('users').once("value")
            .then(snapshot => {
                const comms:Array<string> = JSON.parse(snapshot.child(this.props.username + "/groups").val());
                if(comms != null && comms != false) {
                    //Adds each community the user is in to the groups state of the component
                    comms.forEach((comm) => {
                        const c:Community = new Community(comm,db);
                        this.state.groups.push(c);
                    });
                }
                //Now that data has been retrieved, allow it to display by setting loading flag to false
                this.setState({loading: false});
            })
        }


    //MyGroups.render()
    //returns a loading page until data is retrieved
    //returns a list of groups with links to their group profiles once done loading
    render() {
        return this.state.loading ? (
            <div>
                <p>loading...</p>
            </div>
        ) : (
            <div>
                {this.state.groups.map((g,index) => (
                    <a key={index} href={`/GroupProfile/?name=${g.getCommunityName()}`}><li>{g.getCommunityName()}</li></a>
                ))}
            </div>
        )
    }

}


//GroupList Page
const GroupList = () => {
    const db = firebase.database();
    //retrieves the user's username from the URL
    const router = useRouter();
    const params = new URLSearchParams(router.query as unknown as string);
    const name  = params.get("name");
    var sName: string = "";
    if(name) {
        sName = name;
    } 

    //Passes user's username from URLParams to the MyGroups Component
    //Also provide options to Join an existing group or create a new group
    return (
        <div>
            <Head>
                <title>My Groups</title>
            </Head>
            <ul className={styles.groupList}>
                <MyGroups username = {sName}/>
                <a href="/JoinGroup" ><li>Join a Group</li></a>
                <a href="/newGroup"><li>Create New Group</li></a>
            </ul>
        </div>

    );
}

export default GroupList;

