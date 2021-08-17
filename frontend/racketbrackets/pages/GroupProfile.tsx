import React, { Component } from 'react';
import styles from "../styles/profile.module.css";
import Image from 'next/image'
import profilePic from './images/default_group.png'
import firebase from 'firebase'
import { Community } from '../Classes/Community';
import { useRouter } from 'next/router'
import {DiscussionBoard} from '../Classes/DiscussionBoard';

/*
* This page displays the group profile of a specified group.
*/

//This is where the user will be directed when they click on a group from the "My Clubs" tab
//      or when they click on one of the "Active Communities" on a player profile

//GroupProps Interface
//Includes everything passed to the GroupData Component
interface GroupProps {
    groupName: string,
    db: any,
    router: any
}

//GroupData Component
//takes in GroupProps as input
//Dynamically loads the group's data from the database
class GroupData extends Component<GroupProps> {

    private postNameRef = React.createRef<HTMLInputElement>();
    private postBodyRef = React.createRef<HTMLInputElement>();

    state = {
        name: " ",
        //loading flag allows us to wait to render page content until the data is loaded
        loading: true,
        group: new Community("abc",this.props.db),
        board: new DiscussionBoard(),
        //Flag to indicate if there was an error loading group data
        error: false
    }

    //Constructor for GroupData Component
    //Takes in the GroupProps interface, which includes a groupName, database reference, and router reference
    constructor(props: any) {
        super(props);
        this.setState({
            name: this.props.groupName,
            loading: true
        });
        //Create refs to collect data to create a DiscussionBoard Post
    }

    //GroupData.componentDidMount()
    //Calls the asyncronous function makeGroup when the component has mounted
    async componentDidMount() {
        await this.makeGroup();
    }

    //GroupData.componentDidUpdate()
    //Input: prevProps - the props (input) of the previous page
    //Updates the page content if the props or state have changed
    async componentDidUpdate(prevProps: any) {
        if(this.props.groupName !== prevProps.groupName) {
            this.setState({
                error: false
            });
        }
    }

    //GroupData.makeGroup()
    //Asynchronous function that loads this group's data from the database
    makeGroup = async() => {
        const db = firebase.database();
        const userRef = db.ref('communities').once("value")
            .then(snapshot => {
                //If the group exists, load the data
                if(snapshot.hasChild(this.props.groupName)) {
                    //retrieve data from database
                    const group = snapshot.child(this.props.groupName).val();
                    const board = snapshot.child(this.props.groupName + "/board").val();
                    //update local state
                    this.setState({
                        group: group,
                        board: board
                    });
                } else {
                    //If there is no entry in the database for this group, flip the error flag
                    this.setState({
                        error: true
                    });
                }
                //flip loading flag to allow rendering
                this.setState({loading: false});
			});
        
    }

    //We may want to make the Discussion Board its own React component so it can be reused
    //calls board.MakePost, which creates and adds a post to the board.

    //GroupData.createPost()
    //Uses data input in two input fields to create a new post on the group's DiscussionBoard
    createPost(){
        let name = " ";
        const tempname = localStorage.getItem("username");
        if(tempname) {
            name = tempname;
        }
        //This call depends on how Group boards are stored in the db
        this.state.board.makePost(name, this.postNameRef.current!.value, this.postBodyRef.current!.value);
    }

    //GroupData.playerList()
    //function that redirects to a page with a lit of players in the group (the PlayerList Page)
    playerList(){
        this.props.router.push(`/PlayerList/?name=${this.state.group.name}`);
    }

    //GroupData.render()
    //If not done loading data, display a loading page
    //Once Data is loaded, display group proile page
    render() {
        if(this.state.error) {
            return(
                <div className={styles.ErrorText}>
                    <p> Error: Group {this.props.groupName} could not be found</p>
                </div>
            );
        }
        return this.state.loading ? (
            <div>
                <p>loading...</p>
            </div>
        ) : (
            <div>
                <div className = {styles.imgWithText}>
                    <Image
						priority
						src={profilePic}
						className={styles.borderCircle}
						height={288}
						width={288}
						alt={this.state.name}
					/>
                    <p>Group name: {this.state.group.name}</p>
                    <p>Average rating: {this.state.group.rating}</p>
                    <p>Location: {this.state.group.location}</p>
                    <button onClick={ () => this.playerList()} className={styles.profileButton}>See group ranking</button>
                </div>

                <h2>Discussion Board</h2>
                <ul>
                    <li><u>Profile 1:</u> This is a comment</li>
                </ul>
                <form method="post">
                <input type="text" name="title" placeholder = "Post title" ref={this.postNameRef}/>
                <input type="text" name="body" placeholder = "Post body" ref={this.postBodyRef}/>
                <button type="button" onClick={() => this.createPost()}>Create Post</button>
                </form>
                <h2>Upcoming Events</h2>
                <ul>
                    <li><u>Tennis tournament, Wednesday, July 17th</u></li>
                </ul>
            </div>
        )
    }
}

//Group Profile Page
const GroupProfile = () => {

    //Collects Group name from URL Parameters
    const router = useRouter();
    const params = new URLSearchParams(router.query as unknown as string);
    const name = params.get("name");
    let sName = " ";
    if(name) {
        sName = name;
    }
    //Creates a database reference
    const db = firebase.database();

    //Passes the group name (string), database reference, and router reference to the GroupData Component
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <GroupData groupName= {sName} db = {db} router = {router}/>
            </main>

        </div>
    );
}

export default GroupProfile;
