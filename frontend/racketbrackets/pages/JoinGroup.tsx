import {Component } from "react";
import * as React from "react";
import firebase from 'firebase';

/*
* This is the joingroup page, where users can input a group name.
* The group is then searched for and the user is added to the pendingrequests 
* array in the group.
*/

//This is linked to from the "My Clubs" page after clicking the "Join a Group" button

//JoinGroup Component
export default class JoinGroup extends Component {

    groupName = "";
    errorMessage = "";
    pendingUsers?: Array<string>;

    state = {
        displayError: false,
    };

    //JoinGroup.getErrorDisplay()
    //return an error message if there is one
    getErrorDisplay = () => {
        if(this.state.displayError){
            return(
                <p className="errorMessage">{this.errorMessage}</p>
            );
        }else{
            return(
                <div></div>
            );
        }
    };

    //JoinGroup.onInput()
    //Input: e - the name of the group the user would like to request to join
    //set the group name to the input text
    onInput = (e: any) => {
        this.groupName = e.target.value;
    };

    //JoinGroup.onSubmit()
    //searches for the requested community and then requests to join
    onSubmit = () => this.search().then(this.requestAccess);

    //JoinGroup.search()
    //searches for the requested community
    search = async () => {
        const db = firebase.database();
        //looks for a database entry matching the input group name
        const ref = db.ref(`communities/${this.groupName}`);
        await ref.once('value', (snapshot) => {
            //Retrieves the group's list of pending users
            const data = snapshot.val();
            if(data == null){
                this.errorMessage = "There is no group called " + this.groupName;
                this.setState({displayError: true});
                return;
            }
            if(typeof data["pendingUsers"] === "string"){
                this.pendingUsers = JSON.parse(data["pendingUsers"])
            }else{
                this.pendingUsers = data["pendingUsers"];
            }
        });
    };

    //JoinGroup.requestAccess()
    //requests the user to join the community
    requestAccess = () => {
        if(this.pendingUsers == null) return;
        const db = firebase.database();
        const ref = db.ref(`communities/${this.groupName}`);
        const name = localStorage.getItem("username");
        //Prevent users from submitting multiple requests

        if(name != null){
            if(this.pendingUsers.includes(name)) {
                alert("You already requested to join this group");
                //say you already requested to join this group
            }
            /*else if (is an admin or user) {
                //say already a user of this group, dont need to request
            }*/
            else {
                this.pendingUsers.push(name);
                ref.update({"pendingUsers": this.pendingUsers});
                alert("Your request has been submitted and is pending administrator approval");
            }
        }else{
            this.errorMessage = "An error has occurred";
            this.setState({displayError: true});
        }
        //Otherwise, add user to the group's pending users
    };

    //JoinGroup.render()
    //render the page with an input field for the group name, and a button to request to join entered group
    render() {
        return(
            <div>
                <head><title>Join Group</title></head>
                <p>Request to join a group:</p>
                <form method="post">
                    <input type="text" name="Group Name" onInput={this.onInput}/>
                    <button type={"button"} onClick={this.onSubmit}>Request to Join</button>
                </form>
                {this.getErrorDisplay()}
            </div>
        );
    }
}
