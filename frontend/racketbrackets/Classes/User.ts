import { Match } from "./Match";
import { Community } from "./Community";

export class User {
    username: string;
    email: string = "";
    location: string = "";
    picture: string = "";
    previous: Array<Match> = [];
    upcoming: Array<Match> = [];
    communities: Array<Community> = [];
    rating: number = 800;
    static TEMP_NAME: String = ""

    constructor(uname: string, db: any) {
        this.username = uname;
        var userRef = db.ref('users');
        userRef.once("value")
            .then((snapshot: any) => {
                this.loadValues(snapshot, uname)
            });
        //Should query database to see if user exists, if they do, populate the rest of the fields
    }

    loadValues(snapshot: any, uname: string) {
        if (snapshot.hasChild(uname)) {
            this.username = uname;
            this.email = snapshot.child(uname + "/email").val();
            this.location = snapshot.child(uname + "/location").val();
            this.picture = snapshot.child(uname + "/picture").val();
            this.rating = snapshot.child(uname + "/rating").val();
            if(snapshot.child(uname + "/previous").val() == "false") {
                this.previous = [];
            } else {
                this.previous = JSON.parse(snapshot.child(uname + "/previous").val());
            }
            if(snapshot.child(uname + "/upcoming").val() == "false") {
                this.upcoming = [];
            } else {
                this.previous = JSON.parse(snapshot.child(uname + "/upcoming").val());
            }
            if(snapshot.child(uname + "/groups").val() == "false") {
                this.communities = [];
            } else {
                this.previous = JSON.parse(snapshot.child(uname + "/communities").val());
            }
        }
    }

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
        this.upcoming.push(match);
        //Todo: push the updated list to the database
    }

    removeUpcomingMatch(match: Match) {
        //called in Match.CancelMatch()
        const index = this.upcoming.indexOf(match,0);
        if (index > -1) {
            this.upcoming.slice(index,1);
        }
        //Todo: push the updated list to the databse
    }

    addMatch(match: Match) {
        //called in Match.recordResult()
        const index = this.upcoming.indexOf(match,0);
        const finishedMatch = this.upcoming[index];
        if (index > -1) {
            this.upcoming.slice(index,1);
        }
        this.previous.push(finishedMatch);
        //Todo: push the updated list to the database


        //Todo: use the other players from the match, and the score of the match to calculate and update the user rating


    }

    addCommunity(community: Community) {
        //called in Community.acceptUser()
        //Todo: ensure community not already in communities
        this.communities.push(community);
        //Todo: push the updated list to the database
    }

    removeCommunity(community: Community) {
        //called in Community.removeUser() or Community.leaveGroup()
        //Todo: ensure user is already in community
        const index = this.communities.indexOf(community,0);
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
