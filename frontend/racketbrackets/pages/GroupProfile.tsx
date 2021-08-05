import React, { useContext, useRef, Component } from 'react';
import styles from "../styles/profile.module.css";
import Image from 'next/image'
import profilePic from './images/default.png'
import firebase from 'firebase'
import { Community } from '../Classes/Community';
import Router from 'next/router'
import { useRouter } from 'next/router'
import {DiscussionBoard} from '../Classes/DiscussionBoard';

interface GroupProps {
    groupName: string,
    db: any,
    router: any
}

class GroupData extends Component<GroupProps> {
    state = {
        name: " ",
        loading: true,
        group: new Community("abc",this.props.db),
        board: new DiscussionBoard()
    }

    constructor(props: any) {
        super(props);
        this.setState({
            name: this.props.groupName,
            loading: true
        });
        this.postNameRef = React.createRef();
        this.postBodyRef = React.createRef();
    }

    async componentDidMount() {
        await this.makeGroup();
    }

    makeGroup = async() => {
        const db = firebase.database();
        var userRef = db.ref('communities').once("value")
            .then(snapshot => {
                const group = snapshot.child(this.props.groupName).val();
                const board = snapshot.child(this.props.groupName + "/board").val();
				this.setState({
                        group: group,
                        board: board
                    });
                this.setState({loading: false});
			});
		return false;
    }

    //We may want to make the Discussion Board its own React component so it can be reused
    //calls board.MakePost, which creates and adds a post to the board.
    createPost(){
        var name: string = " ";
        const tempname = localStorage.getItem("username");
        if(tempname) {
            name = tempname;
        }
        //This call depends on how Group boards are stored in the db
        this.state.board.makePost(name, postNameRef.current!.value, postBodyRef.current!.value, this.props.db);
    }

    playerList(){
        this.props.router.push(`/PlayerList/?name=${this.state.group.name}`);
    }

    render() {
        return this.state.loading ? (
            <div>
                <p>loading...</p>
            </div>
        ) : (
            <div>
                <div className = {styles.imgWithText}>
                    {/*<Image*/}
                    {/*  priority*/}
                    {/*  src={profilePic}*/}
                    {/*  className={styles.borderCircle}*/}
                    {/*  height={288}*/}
                    {/*  width={288}*/}
                    {/*  alt={name}*/}
                    {/*/>*/}
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

const GroupProfile = () => {

    const router = useRouter();
    const params = new URLSearchParams(router.query as unknown as string);
    const name = params.get("name");
    const db = firebase.database();

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <GroupData groupName= {name} db = {db} router = {router}/>
            </main>

        </div>
    );
}

export default GroupProfile;
