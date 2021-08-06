import { Match } from "./Match";
import { Post } from "./Post";
import firebase from "firebase"


/*
* This class is an extension of the Post class that 
* will be used to create a match between two players.
* It will be posted on a discussion board and the owner
* of that board will be able to accept or reject the challenge.
*/
export class Challenge extends Post{
    match: Match = new Match(0, firebase.database());

    //Constructor for Challenge Class
    constructor(from: string, time: Date, loc:string, m: Match){
        super(from,"Match Challenge","Challenge from " + from + " at " + time + ", " + loc);
        this.match = m;

    }
    //Challenge.acceptChallenge()
    acceptChallenge(){
        //Should add the accepting user to the array of users in the Match
    }

}