import {Component, useRef} from "react";
import * as React from "react";
import firebase from 'firebase';

export default class JoinGroup extends Component {

    groupName: string = "";
    errorMessage: string = "";

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
            let pendingUsers = JSON.parse(data["pendingUsers"]);
            const name = localStorage.getItem("username");
            pendingUsers.push(name);
            ref.update({"pendingUsers": pendingUsers})
            this.errorMessage = data["pendingUsers"];
            this.setState({displayError: true})
        });
    };

    //requests the user to join the community
    requestAccess = () => {

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
