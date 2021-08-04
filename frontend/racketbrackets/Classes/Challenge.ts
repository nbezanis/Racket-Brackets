import { Match } from "./Match";
import { Post } from "./Post";
import firebase from "firebase"

export class Challenge extends Post{
    match: Match = new Match(0, firebase.database());
    acceptChallenge(){
        //Should add the accepting user to the array of users in the Match
    }

}