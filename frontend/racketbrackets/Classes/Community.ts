import { DiscussionBoard } from "./DiscussionBoard";
import { User } from "./User";

/*
*This class represents a community of Users. Its main data structure is an array of users that are 
*in the group. It also has an additional array that represents admins in the group. Other elements
*include name, picture, and location, which are all represented as strings. Finally, there is a rating
*element that is an integer represeting the average rating of all memebers of a group.
*/
export class Community{
    name: string;
    picture: string = "";
    location: string = "";
    users: Array<User> = [];
    admins: Array<User> = [];
    rating: number = 800;
    pendingRequests: Array<User> = [];
    board: DiscussionBoard;
    //Todo: Add upcoming events, maybe just an array of Event items?

    //Constructor for the Community class
    //Input: cname - the name of the Community Object to be created
    //Input: db - a reference to the firebase databse containing the community info
    //Calls this.loadValues(), which uses <cname> to query the database
    constructor(cname: string, db: any) {
        this.name = cname;
        this.board = new DiscussionBoard();
        //Get snapshot of database, and pass to loadValues()
        var commRef = db.ref('communities');
        commRef.once("value")
            .then((snapshot: any) => {
                this.loadValues(snapshot, cname);
            });
    }

    //Community.loadValues()
    //Input: snapshot - a firebase DatabaseSnapshot object from a reference to the 'communities' database portion
    //Input: cname - the community name from which to load data, where cname matches the community's database key
    //Loads the fields of this class from the values in the database
    loadValues(snapshot: any, cname: string) {
        //If this group has a database entry, load the values from the db
        if(snapshot.hasChild(cname)) {
            this.name = cname;
            this.picture = snapshot.child(cname + "/picture").val();
            this.location = snapshot.child(cname + "/location").val();
            this.rating = snapshot.child(cname + "/rating").val();
            if(snapshot.child(cname + "/users").val() == "false") {
                this.users = [];
            } else {
                this.users = JSON.parse(snapshot.child(cname + "/users").val());
            }
            if(snapshot.child(cname + "/admins").val() == "false") {
                this.admins = [];
            } else {
                this.admins = JSON.parse(snapshot.child(cname + "/admins").val());
            }
            if(snapshot.child(cname + "/pendingUsers").val() == "false") {
                this.pendingRequests = [];
            } else {
                this.pendingRequests = JSON.parse(snapshot.child(cname + "/pendingUsers").val());
            }
            //Add a DiscussionBoard when its fully implemented in the database
        }
    }

    //Community.createCommunity()
    //Input: creator - the User who initiated the creation of this group, who will be made a group admin
    //Input: location - the location the creator entered on the newGroup page
    //Input: db - a reference to the firebase database containing community data
    //Creates a new database entry for this community object
    //Called from the newGroup page
    createCommunity(creator: User, location: string, db: any) {
        this.admins.push(creator);
        this.location = location;
        creator.addCommunity(this,db);
        this.updateRating(db);
        var commRef = db.ref('communities');
        //Set the database values for the group's fields
        commRef.child(this.name).set({
            name: this.name,
            picture: this.picture,
            location: this.location,
            users: JSON.stringify(this.users),
            admins: JSON.stringify(this.admins),
            rating: this.rating,
            pendingUsers: "[]"
        });
    }

    //Community.getCommunityName()
    //returns the name of the community, which is also its database key
    getCommunityName(): string {
        return this.name;
    }

    //Community.getRating()
    //returns the average rating of the members of this group
    getRating(): number {
        return this.rating;
    }

    //Community.getLocation()
    //returns the string location of this group
    getLocation(): string {
        return this.location;
    }

    //Community.getPicture()
    //returns the string form of the group's picture
    getPicture(): string {
        return this.picture;
    }

    //Community.getBoard()
    //returns the group's DiscussionBoard object
    getBoard(): DiscussionBoard{
        return this.board;
    }

    //Community.inGroup()
    //Input: user - The user whose membership needs to be evaluated
    //Input: db - a reference to the firebase database containing community data
    //returns a boolean indicating if user is a member or admin of this community
    inGroup(user: User, db: any) : boolean {
        return this.users.includes(user) || this.admins.includes(user);
    }

    //Community.updatePicture()
    //Input: pic - the string form of the group's new picture
    //Input: db - a refernce to the firebase database containing community data
    updatePicture(pic: string, db: any) {
        this.picture = pic;
        //update picture in the database
        var commRef = db.ref('communities');
        commRef.child(this.name).update({
            picture: pic
        });
    }

    //Community.updateLocation()
    //Input: loc - the string of the group's location
    //Input: db - a reference to the firebase database containing community data
    updateLocation(loc: string, db: any) {
        this.location = loc;
        //update location in the database
        var commRef = db.ref('communities');
        commRef.child(this.name).update({
            location: loc
        });
    }

    //Community.requestJoin()
    //Input: newUser - the User object of the user requesting to join
    //Input: db - a reference to the firebase database containing community data
    //returns a string indicating success:
    //      If the string is empty (""), the request is made successfully
    //      Otherwise, returns a string describing the error with the request
    requestJoin(newUser: User, db: any): string {
        var requestMade: string = "";
        if(this.inGroup(newUser, db)) {
            requestMade = "Error: User Already in Community";
        } else if (this.pendingRequests.includes(newUser)){
            requestMade = "Error: User already pending";
        } else {
            this.pendingRequests.push(newUser);
        }
        return requestMade;
    }

    //Community.updateRating()
    //Input: db - a reference to the firebase database containing community data
    //Calculates the group's average rating, and updates object state and database values for rating
    updateRating(db: any) {
        //Called by User.updateRating()
        var sum: number = 0;
        var count: number = 0;
        //Calculate sum of members
        this.users.forEach((item) => {
            count++;
            sum += item.getRating();
        });
        //Calculate sum of admins
        this.admins.forEach((item) =>{
            count++;
            sum += item.getRating();
        });
        this.rating = sum / count;
        //update database value
        var commRef = db.ref('communities');
        commRef.child(this.name).update({
            rating: this.rating
        });
    }

    //Community.acceptUser()
    //Input: newUser - the user who has been accepted and will be added to the community
    //Input: db - a reference to the firebase database containing the community data
    //called when an admin accepts a pending request, adds pending user to group
    acceptUser(newUser: User, db: any) {
        newUser.addCommunity(this,db);
        //remove user from pending list
        const index = this.pendingRequests.indexOf(newUser);
        if(index > -1) {
            this.pendingRequests.splice(index,1);
        }
        //Add user to users list
        this.users.push(newUser);
        //Update the database
        var commRef = db.ref('communities');
        commRef.child(this.name).update({
            users: this.users,
            pendingUsers: this.pendingRequests
        });
    }

    //Community.rejectUser()
    //Input: newUser - the user who has been rejected from the group
    //Input: db - a reference to the firebase database contianing the community data
    //called when an admin rejects a pending request, removes pending user from pending list
    rejectUser(newUser: User, db: any) {
        //remove user from pending list
        const index = this.pendingRequests.indexOf(newUser);
        if(index > -1) {
            this.pendingRequests.splice(index,1);
            //Update the database
            var commRef = db.ref('communities');
            commRef.child(this.name).update({
                pendingUsers: this.pendingRequests
            });
        }
    }

    //Community.addAdmin()
    //Input: newAdmin - the user (who is in this group) who should be made an admin of the community
    //Input: db - a reference to the firebase database containing the community data
    //Switches this user from a user to an admin
    //can only be called by an admin
    addAdmin(newAdmin: User, db: any) {
        //remove user from the user list
        const index = this.users.indexOf(newAdmin);
        if(index > -1) {
            this.users.splice(index,1);
             //Add user to admin list
            this.admins.push(newAdmin);
            //Update the database
            var commRef = db.ref('communities');
            commRef.child(this.name).update({
                users: this.users,
                admins: this.admins
            });
        }
    }

    //Community.removeUser()
    //Input: targetUser - the user to be removed from this group
    //Input: db - a reference to the firebase database containing the community data
    //Removes this user
    removeUser(targetUser: User, db: any) {
        //remove user from user list
        const index = this.users.indexOf(targetUser);
        if(index > -1) {
            this.users.splice(index,1);
            //Update the database
            var commRef = db.ref('communities');
            commRef.child(this.name).update({
                users: this.users,
            });
            //Update User's data accordingly
            targetUser.removeCommunity(this,db);
        }
    }

}
