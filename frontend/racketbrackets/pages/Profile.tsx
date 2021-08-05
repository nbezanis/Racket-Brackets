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

//This is the user profile page.

interface ProfProps { 
	username: string
	db: any
}

/*
* This class gets the user data that is to be displayed on a profile
* It is here to ensure that the information is correctly obtained before
* any data is displayed.
*/
class ProfileData extends Component<ProfProps>{
	state = {
		name: " ",
		loading: true,
		user: new User("abc", this.props.db),
		groups: new Array<string>()
	}

	constructor(props: any) {
		super(props);
		this.setState({
			name: this.props.username,
			loading: true
		});
	}

	async componentDidUpdate(prevProps: any) {
		if(this.props.username !== prevProps.username) {
			await this.makeUser();
		}
	}

	async componentDidMount() {
		await this.makeUser();
	}

	makeUser = async() => {
		const db = firebase.database();
        var userRef = db.ref('users').once("value")
            .then(snapshot => {
                const user = snapshot.child(this.props.username).val();
				console.log(typeof user);
				console.log(user);
				this.setState({user: user});
				const groupArray: Array<string> = JSON.parse(user.groups);
				console.log(groupArray);
				if(groupArray != null && groupArray != false) {
					this.setState({groups: []});
					groupArray.forEach((g) => {
						this.state.groups.push(g);
					});
				}
				this.setState({loading: false});
			});
		return false;
	}

	//This code makes up what the user sees on a profile page
	render() {
		console.log(this.state.loading);
		return this.state.loading ? (
			<div>
				<p>loading...</p>
			</div>
		) : (
			<div className={styles.container}>
				<main className={styles.main}>     
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
						<p>Location: {this.state.user.location}</p>
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
							console.log(g);
							return (<a href={`/GroupProfile/?name=${g}`} key={index}><li>{g}</li></a>);
						})}
					</ul>
				</main>
			</div>
		)
	}
}
 
const Profile = () => {
	const router = useRouter();
	const params = new URLSearchParams(router.query as unknown as string);
	const name = params.get("name");
	var sName: string = "";
    if(name) {
        sName = name;
    } 
	const db = firebase.database();

	return (
		<div>
			<Head>
				<title>Profile: {sName}</title>
			</Head>
			<ProfileData username = {sName} db={db}/>
		</div>

	);
}
 
export default Profile;

