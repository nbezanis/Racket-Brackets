import { User } from "../Classes/User";
import React, { useEffect, Component, FC } from 'react'
import Head from 'next/head'
import firebase from 'firebase'
import { Community } from "../Classes/Community";
import styles from '../styles/grouplist.module.css'
import image from "next/image";
import { useRouter } from "next/router";


// This page displays the list of users in a group

//GPProps Interface
//Input values for GroupPlayers Component (groupname as a string)
interface GPProps {
    groupName: string
}

//GroupPlayers Component
//Takes GPProps (groupname) as input
class GroupPlayers extends Component<GPProps>{

    state = {
        name: " ",
        loading: true,
        players: new Array<User>()
    }

    //Constructor for the GroupPlayers Component
    //Input: props - GPProps, which holds a groupName string
    constructor(props: any) {
        super(props);
        //Grab groupName from the GPProps
        this.setState({name: this.props.groupName});
        //Set a loading flag so page content is not rendered until after data is retrieved
        this.setState({loading: true});
    }

    //GroupPlayers.componentDidMount()
    //Starts the data loading once the component has mounted
    async componentDidMount() {
        await this.makeUser();
    }

    //GroupPlayers.makeUser()
    //Helper function to asynchronosuly create the list of users and admins 
    makeUser = async() => {
        const db = firebase.database();
        var userRef = db.ref("/").once("value")
            .then(snapshot => {
                //Look at all admins in the group
                const admins: Array<User> = JSON.parse(snapshot.child("/communities/" + this.props.groupName + "/admins").val());
                if(admins != null) {
                    //Add each admin user to the player list
                    admins.forEach((admin: User) => {
                        const u = snapshot.child("/users/" + admin.username).val();
                        //console.log(u.username);
                        this.state.players.push(u);
                    });
                }
                //Look at all users in the group
                const users = JSON.parse(snapshot.child("/communities/" + this.props.groupName + "/users").val());
                if(users != null) {
                    //Add each user to the player list
                    users.forEach((user: any) => {
                        const u =snapshot.child("/users/" + user.username).val()
                        this.state.players.push(u);
                    });
                }
                //Once the data has been loaded, allow page to render
                this.setState({loading: false});
            })
        }

    //GroupPlayers.render()
    //Creates page content that user sees
    //Displays a loading page until the data is retrieved
    //Once data is loaded, display a list of users, where each entry links to that user's profile
    render() {
        return this.state.loading ? (
            <div>
                <p>loading...</p>
            </div>
        ) : (
            <div>
                {this.state.players.map((p) => (
                    <a href={`/Profile/?name=${p.username}`}><li>{p.username}, Rating: {p.rating}</li></a>
                ))}
            </div>
        )
    }

}


//ListPlayers Page
//Provides interface for listing all players in a group
const ListPlayers = () => {
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
                <title>My Groups</title>
            </Head>
            <ul className={styles.groupList}>
                <GroupPlayers groupName = {sName}/>
            </ul>
        </div>

    );
}

export default ListPlayers;

