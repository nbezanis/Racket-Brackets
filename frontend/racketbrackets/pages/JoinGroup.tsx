import {Component, useRef} from "react";
import {Community} from "../Classes/Community";

export default class JoinGroup extends Component {

    groupName: string = "";
    errorMessage: string = "";

    state = {
        displayError: false,
    };

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

    onInput = (e: any) => {
        this.groupName = e.target.value;
    };

    onSubmit = () => this.search().then(this.requestAccess);

    search = async () => {

    };

    requestAccess = () => {

    }

    render() {
        return(
            <div>
                <head><title>Join Group</title></head>
                <p>Request to join a group:</p>
                <form method="post">
                    <input type="text" name="Group Name" onInput={this.onInput}/>
                    <button onClick={this.onSubmit}>Request to Join</button>
                </form>
                {this.getErrorDisplay()}

            </div>
        );
    }
};
