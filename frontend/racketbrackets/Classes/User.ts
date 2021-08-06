import { Match } from "./Match";
import { Community } from "./Community";
import firebase from "firebase";
import { DiscussionBoard } from "./DiscussionBoard";
import { Challenge } from "./Challenge";


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

    //Constructor for the User Class
    //Input: uname - string username of the User object to be created, where the username is also the database key
    //Input: db - a reference to the firebase database containing User data
    //Attempts to load user data from the database based on username as the key
    constructor(uname: string, db: any) {
        this.username = uname;
        this.board = new DiscussionBoard();
        var loaded: boolean = false;
        //Look in database for existing data
        var userRef = db.ref('users');
        userRef.once("value")
            .then((snapshot: any) => {
                this.loadValues(snapshot, uname, db)
            }).then(
                console.log("done")
            );
    }

    //User.loadValues()
    //Input: snapshot - a firebase DatabaseSnapshot object referencing the user portion of the database
    //Input: uname - the string username of the user to be found, used as database key
    //Input: db - a reference to the firebase database containing User data
    //Looks in database for entry matching uname, loads object fields if found
    loadValues(snapshot: any, uname: string, db:any){
        //Locate username is database
        if (snapshot.hasChild(uname)) {
            //load local fields
            this.exists = true;
            this.username = uname;
            this.email = snapshot.child(uname + "/email").val();
            this.location = snapshot.child(uname + "/location").val();
            this.picture = snapshot.child(uname + "/picture").val();
            this.rating = snapshot.child(uname + "/rating").val();
            //load local arrays if they have data in them
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
            }
        }
    }

    //User.createUser()
    //Input: uEmail - the email of the new User object
    //Input: db - a reference to the firebase database containing User data
    //Creates a new entry in the database for a new user
    //Called on the sign up page
    createUser(uEmail: string, db: any) {
        //Create new fields in the database
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
        //update local field
        this.email = uEmail;
    }

    //User.userExists()
    //returns a boolean indicating if the user object has an entry in the database
    userExists(): boolean {
        return this.exists;
    }

    //User.getEmail()
    //returns user's email
    getEmail(): string {
        return this.email;
    }

    //User.getUsername()
    //returns user's username
    getUsername():string {
        return this.username;
    }

    //User.getRating()
    //returns user's Elo ranking
    getRating():number {
        return this.rating;
    }

    //User.getPicture()
    //returns string of user's profile picture
    getPicture():string {
        return this.picture;
    }

    //User.getLocation()
    //returns user's entered location
    getLocation(): string {
        return this.location;
    }

    //User.getCommunities()
    //returns an array of the names of communities that the user is in
    //Communities represented as strings because if User had an array of Communities and Community had an array of Users the database would have cycles
    getCommunities(): Array<String> {
        return this.communities;
    }

    //User.getBoard()
    //returns user's personal DiscussionBoard
    getBoard(): DiscussionBoard{
        return this.board;
    }
    
    //User.updateLocation()
    //Input: loc - string form of location
    //Input: db - a reference to the firebase database containing User data
    //Updates the user's location
    updateLocation(loc: string, db: any) {
        //update local fields
        this.location = loc;
        //update database
        var userRef = db.ref('users');
        userRef.child(this.username).set({
            location: loc
        });
    }

    //User.updatePicture()
    //Input: pic - string of picture name for user's profile photo
    //Input: db - a reference to the firebase database containing User data
    //Updates a user's profile picture
    updatePicture(pic: string, db: any) {
        //This would need to be called in a function on the profile page, which would need to put the actual image on the firebase
        //cloud storage, and then pass the url for that image as 'pic'
        //update local field
        this.picture = pic;
        //update database
        var userRef = db.ref('users');
        userRef.child(this.username).set({
            picture: pic
        });
    }

    //User.addUpcomingMatch()
    //Input: match - the match object to add to the user's upcoming matches
    //Input: db - a reference to the firebase database containing User data
    //Adds a match to the user's list of upcoming matches
    //Called in Match.AcceptMatch()
    addUpcomingMatch(match: Match, db: any) {
        //Todo: maybe see if any other matches at same time
        //Check if match is already in upcoming matches
        if(this.upcoming.includes(match)) {
            console.error("Match already added")
        } else {
            //update local fields
            this.upcoming.push(match);
            //update database
            var userRef = db.ref('users');
            userRef.child(this.username).update({
                upcoming: JSON.stringify(this.upcoming)
            })
        }
    }

    //User.removeUpcomingMatch()
    //Input: match - the match object to remove from the user's upcoming matches
    //Input: db - a reference to the firebase database containing User data
    //Removes a match from the user's list of upcoming matches
    //Called in Match.cancelMatch()
    removeUpcomingMatch(match: Match, db: any) {
        //Ensure that match is upcoming
        if(this.upcoming.includes(match)) {
            //update local fields
            const index = this.upcoming.indexOf(match);
            if(index > -1) {
                this.upcoming.splice(index,1);
            }
            //update database
            var userRef = db.ref('users');
            userRef.child(this.username).update({
                upcoming: JSON.stringify(this.upcoming)
            })
        } else {
            console.error("No match to remove");
        }
    }

    //User.addMatch()
    //Input: match - Match obejct to move from upcoming to previous matches
    //Input: db - a reference to the firebase database containing User data
    //Adds a match to the user's match history, removes it from upcoming matches
    //Called in Match.recordResult()
    addMatch(match: Match, db: any) {
        //locate match
        const index = this.upcoming.indexOf(match,0);
        const finishedMatch = this.upcoming[index];
        if (index > -1) {
            //update local fields
            this.upcoming.slice(index,1);
            this.previous.push(match);
            //update database
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

    //Users.addCommunity()
    //Input: community - the Community object to add to the user's community list
    //Input: db - a reference to the firebase database containing User data
    //Called in Community.acceptUser() and Communiy.createCommunity()
    addCommunity(community: Community, db: any) {
        //Ensure community is new
        if(this.communities.includes(community.getCommunityName())) {
            console.log("Error: already in the community");
        } else {
            //update local fields
            this.communities.push(community.getCommunityName());
            //update database
            var userRef = db.ref('users');
            userRef.child(this.username).update({
                groups: JSON.stringify(this.communities)
            });
        }
    }

    //User.removeCommunity()
    //Input: community - the Community object to remove from the user's community list
    //Input: db - a reference to the firebase database containing User data
    //Removes a community from the user's list of communities
    //Called by Community.removeUser()
    removeCommunity(community: Community, db: any) {
        const index = this.communities.indexOf(community.getCommunityName(),0);
        if (index > -1) {
            //update local fields
            this.communities.slice(index,1);
            //update database
            var userRef = db.ref('users');
            userRef.child(this.username).update({
                groups: JSON.stringify(this.communities)
            });
        }
    }

    //User.challengeUser()
    //Input: toUser - the user to whom this user is issuing a challenge
    //Input: date - the time and day of the challenged match
    //Input: loc - a string of the location of the match
    //Input: db - a reference to the firebase database containing User data
    //Creates a new Match object between the two players
    challengeUser(toUser: User, date: Date, loc: string, db:any) {
        const m = new Match(0,db);
        var players: Array<User> = [this,toUser];
        //Create new match with provided details
        m.createMatch(players,date,loc,db);
        //Issue a challenge
        const chall = new Challenge(this.getUsername(),date,loc,m);
    }


}
