import { Match } from "./Match";
import { Community } from "./Community";
import firebase from "firebase";
import { DiscussionBoard } from "./DiscussionBoard";


/*
* A user object stores information that creates a depiction of a user of the site.
* This information includes username, email, location, and picture. There are also
* a few arrays, such as a previous array that stores the user's match history,
* an array that stores upcoming matches, and an array that stores communities that
* the user is a part of. Each user also has a skill rating and a discussion board
* that other users can post to.  
*/
export class User {
    username: string;
    email: string = "";
    location: string = "";
    picture: string = "";
    previous: Array<Match> = [];
    upcoming: Array<Match> = [];
    communities: Array<String> = [];
    rating: number = 800;
    board: DiscussionBoard;
    static TEMP_NAME: String = ""
    exists: boolean = false;

    constructor(uname: string, db: any) {
        this.username = uname;
        this.board = new DiscussionBoard();
        var loaded: boolean = false;
        var userRef = db.ref('users');
        userRef.once("value")
            .then((snapshot: any) => {
                loaded = this.loadValues(snapshot, uname, db)
            }).then(
                console.log("done")
            );
        //Should query database to see if user exists, if they do, populate the rest of the fields
    }
    //load the values for a user. This is used to populate fields on the profile page
    loadValues(snapshot: any, uname: string, db:any): boolean {
        var loaded: boolean = false;
        if (snapshot.hasChild(uname)) {
            this.exists = true;
            this.username = uname;
            this.email = snapshot.child(uname + "/email").val();
            this.location = snapshot.child(uname + "/location").val();
            this.picture = snapshot.child(uname + "/picture").val();
            this.rating = snapshot.child(uname + "/rating").val();
            if(snapshot.child(uname + "/previous").val() == null) {
                this.previous = [];
            } else {
                const previous:Array<number> = JSON.parse(snapshot.child(uname + "/previous").val());
                previous.forEach((prev) => {
                    const m:Match = new Match(prev,db);
                    this.previous.push(m);
                });
            }
            if(snapshot.child(uname + "/upcoming").val() == null) {
                this.upcoming = [];
            } else {
                const upcoming:Array<number> = JSON.parse(snapshot.child(uname + "/upcoming").val());
                upcoming.forEach((upc) => {
                    const m:Match = new Match(upc,db);
                    this.upcoming.push(m);
                });
            }
            if(snapshot.child(uname + "/groups").val() == null) {
                this.communities = [];
            } else {
                const comms:Array<string> = JSON.parse(snapshot.child(uname + "/groups").val());
                if(comms != null && comms != false) {
                    this.communities = comms;
                }
                loaded = true;
            }
        } else {
        }
        return loaded;
    }

    //creates a new user object (used on sign up)
    createUser(uEmail: string, db: any) {
        //Called on the sign up page
        var userRef = db.ref('users');
        userRef.child(this.username).set({
            username: this.username, 
            email: uEmail,
            location: "",
            rating: 800,
            picture: "",
            previousMatches: false,
            upcomingMatches: false,
            groups: false
        });
        this.email = uEmail;
    }

    userExists(): boolean {
        return this.exists;
    }

    getEmail(): string {
        return this.email;
    }

    getUsername():string {
        return this.username;
    }

    getRating():number {
        return this.rating;
    }

    getPicture():string {
        return this.picture;
    }

    getLocation(): string {
        return this.location;
    }

    getCommunities(): Array<String> {
        return this.communities;
    }

    getBoard(): DiscussionBoard{
        return this.board;
    }
    
    updateLocation(loc: string, db: any) {
        this.location = loc;
        var userRef = db.ref('users');
        userRef.child(this.username).set({
            location: loc
        });
    }

    updatePicture(pic: string, db: any) {
        //This would need to be called in a function on the profile page, which would need to put the actual image on the firebase
        //cloud storage, and then pass the url for that image as 'pic'
        this.picture = pic;
        var userRef = db.ref('users');
        userRef.child(this.username).set({
            picture: pic
        });
    }

    addUpcomingMatch(match: Match, db: any) {
        //called in Match.AcceptMatch()
        //Todo: ensure match is not already in upcoming, maybe see if any other matches at same time
        if(this.upcoming.includes(match)) {
            console.error("Match already added")
        } else {
            this.upcoming.push(match);
            var userRef = db.ref('users');
            userRef.child(this.username).update({
                upcoming: JSON.stringify(this.upcoming)
            })
        }
        //Todo: push the updated list to the database
        var userRef = db.ref('users')
    }

    removeUpcomingMatch(match: Match, db: any) {
        //called in Match.CancelMatch()
        if(this.upcoming.includes(match)) {
            const index = this.upcoming.indexOf(match);
            if(index > -1) {
                this.upcoming.splice(index,1);
            }
            var userRef = db.ref('users');
            userRef.child(this.username).update({
                upcoming: JSON.stringify(this.upcoming)
            })
        } else {
            console.error("No match to remove");
        }
        //Todo: push the updated list to the databse
    }

    addMatch(match: Match, db: any) {
        //called in Match.recordResult()
        const index = this.upcoming.indexOf(match,0);
        const finishedMatch = this.upcoming[index];
        if (index > -1) {
            this.upcoming.slice(index,1);
            this.previous.push(match);
            var userRef = db.ref('users');
            userRef.child(this.username).update({
                upcoming: JSON.stringify(this.upcoming),
                previous: JSON.stringify(this.previous)
            });
        } else {
            console.error("User does not have match, or match is completed");
        }

        //Todo: use the other players from the match, and the score of the match to calculate and update the user rating


    }

    addCommunity(community: Community, db: any) {
        //called in Community.acceptUser()
        //Todo: ensure community not already in communities
        if(this.communities.includes(community.getCommunityName())) {
            console.log("Error: already in the community");
        } else {
            this.communities.push(community.getCommunityName());
            var userRef = db.ref('users');
            userRef.child(this.username).update({groups: JSON.stringify(this.communities)});
        }
    }

    removeCommunity(community: Community) {
        //called in Community.removeUser() or Community.leaveGroup()
        //Todo: ensure user is already in community
        const index = this.communities.indexOf(community.getCommunityName(),0);
        if (index > -1) {
            this.communities.slice(index,1);
        }
        //Todo: push the updated list to the database
    }

    challengeUser(toUser: User) {
        //Create a Match Object, and provide the other user with the ability to 
        //  Match.AcceptMatch() or Match.rejectMatch()
    }

    
}
