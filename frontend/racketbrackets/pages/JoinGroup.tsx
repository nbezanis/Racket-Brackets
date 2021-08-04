import {Component, useRef} from "react";
import * as React from "react";
import firebase from 'firebase';

export default class JoinGroup extends Component {

    groupName: string = "";
    errorMessage: string = "";
    pendingUsers!: Array<String>;

    state = {
        displayError: false,
    };

    //return an error message if there is one
    getErrorDisplay = () => {
        if(this.state.displayError){
            return(
                <p>{this.errorMessage}</p>
            );
        }else{
            return(
                <div></div>
            );
        }
    };

    //set the group name to the input text
    onInput = (e: any) => {
        this.groupName = e.target.value;
    };

    //searches for the requested community and then requests to join
    onSubmit = () => this.search().then(this.requestAccess);

    //searches for the requested community
    search = async () => {
        const db = firebase.database();
        const ref = db.ref(`communities/${this.groupName}`);
        ref.on('value', (snapshot) => {
            const data = snapshot.val();
            console.log(data["pendingUsers"][0])
            if(typeof data["pendingUsers"] === "string"){
                this.pendingUsers = JSON.parse(data["pendingUsers"])
            }else{
                this.pendingUsers = data["pendingUsers"];
            }
        }, this.requestAccess);
    };

    //requests the user to join the community
    requestAccess = () => {
        const db = firebase.database();
        const ref = db.ref(`communities/${this.groupName}`);
        const name = localStorage.getItem("username");
        if(this.pendingUsers.includes(name || "")) {
            console.log("ALREADY REQUESTED TO JOIN GROUP");
            //say you already requested to join this group
        }
        /*else if (is an admin or user) {
            //say already a user of this group, dont need to request
        }*/
        else {
            this.pendingUsers.push(name || "");
            ref.update({"pendingUsers": this.pendingUsers})
        }
        console.log(this.pendingUsers)
    };

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
};
