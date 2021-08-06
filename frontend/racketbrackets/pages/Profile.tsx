import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import profilePic from './images/default.png'
import styles from '../styles/profile.module.css'
import { User } from '../Classes/User'
import firebase from 'firebase'
import Router from 'next/router'
import React, { Component } from 'react'
import { useRouter } from 'next/router'

/*
* This class gets the user data that is to be displayed on a profile
* It is here to ensure that the information is correctly obtained before
* any data is displayed.
*/

//This is the user profile page.

//Linked to by the "My Profile" tab of the navbar, as results from the search/home page. or from entries on the PlayerList Page

//ProfProps Interface
//Input values for ProfileData Component
interface ProfProps { 
	username: string
	db: any
}

//ProfileData Component
//Takes ProfProps as input
class ProfileData extends Component<ProfProps>{
	state = {
		name: " ",
		//Set a loading flag to ensure page is not displayed before data is loaded
		loading: true,
		user: new User("abc", this.props.db),
		groups: new Array<string>(),
		//Flag to indicate if this profile belongs to a different user
		differentUser: false,
		//Flag to indicate if there was an error loading user data
		error: false
	}

	//Constuctor for ProfileData Component
	//Input: props - values passed by ProfProps, a string username and a database reference
	constructor(props: any) {
		super(props);
		this.setState({
			name: this.props.username,
			loading: true
		});
	}

	//ProfileData.componentDidUpdate()
	//Input: prevProps - the props (input) of the previous page
	//Updates page content if props have changed
	async componentDidUpdate(prevProps: any) {
		//If the current props are different (i.e. different username passed), reload the page data
		if(this.props.username !== prevProps.username) {
			await this.makeUser();
			this.setState({
				error: false
			});
			if(localStorage.getItem("username") && localStorage.getItem("username") != this.props.username) {
				this.setState({
					differentUser: true
				});
			} else {
				this.setState({
					differentUser: false
				});
			}
		}
	}

	//ProfileData.componentDidMount()
	//starts data loading once the component has mounted
	async componentDidMount() {
		await this.makeUser();
		//If this user is different than you (the viewing user), set this flag for different rendering options
		if(localStorage.getItem("username") && localStorage.getItem("username") != this.props.username) {
			this.setState({
				differentUser: true
			});
		}
	}

	//ProfileData.makeUser()
	//Asynchronously load user data to display on profile page
	makeUser = async() => {
		const db = firebase.database();
        var userRef = db.ref('users').once("value")
            .then(snapshot => {
				//If the user exists, load their data
				if(snapshot.hasChild(this.props.username)) {
					//Grab user data from the database
					const user = snapshot.child(this.props.username).val();
					this.setState({user: user});
					//Create array of groups that the user is in to display later
					const groupArray: Array<string> = JSON.parse(user.groups);
					if(groupArray != null && groupArray != false) {
						this.setState({groups: []});
						groupArray.forEach((g) => {
							this.state.groups.push(g);
						});
					}
				} else {
					//If there is no entry in the database for this username, flip the error flag
					this.setState({
						error: true
					});
				}
				//Flip loading flag to false once the data is loaded
				this.setState({loading: false});
			});
		
	}

	//ProfileData.render()
	//This code makes up what the user sees on a profile page
	//Displays a loading page until loading flag indicates that data is loaded
	//Displays player profile with dynamically loaded data once loading flag is flipped
	render() {
		//If the database could not load data, return an error page instead
		if(this.state.error) {
			return (
				<div className={styles.ErrorText}>
					<p>Error: User {this.props.username} could not be found</p>
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
					<p>Username: {this.state.user.username}</p>
					<p>Rating: {this.state.user.rating}</p>
					{this.state.user.location ? <p>Location: {this.state.user.location}</p> : null}
					{this.state.differentUser ? <button className={styles.profileButton}>Challenge User</button> : null}
				</div>

				<h2>Match History</h2>
				<ul>
					<li>Profile 1 vs Profile 2 <u>WIN</u></li>
					<li>Profile 1 vs Profile 3 <u>WIN</u></li>
					<li>Profile 1 vs Profile 4 <u>LOSS</u></li>
				</ul>
				<h2>Active Communities</h2>
				<ul>
					{this.state.groups.map((g:string, index) => {
						return (<a href={`/GroupProfile/?name=${g}`} key={index}><li>{g}</li></a>);
					})}
				</ul>
			</div>
		)
	}
}
 
//Profile Page
const Profile = () => {
	const router = useRouter();
	//Grab username from the URL Parameters
	const params = new URLSearchParams(router.query as unknown as string);
	const name = params.get("name");
	var sName: string = "";
    if(name) {
        sName = name;
    } 
	//Create Database reference
	const db = firebase.database();

	//Render page and pass username and database ref to the ProfileData Component
	return (
		<div>
			<Head>
				<title>Profile: {sName}</title>
			</Head>
			<div className={styles.container}>
				<main className={styles.main}>     
					<ProfileData username = {sName} db={db}/>	
				</main>
			</div>
		</div>

	);
}
 
export default Profile;

