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
    //Todo: Implement DiscussionBoard
    //board: DiscussionBoard
    //Todo: Add upcoming events, maybe just an array of Event items?

    constructor(cname: string, db: any) {
        this.name = cname;
        var commRef = db.ref('communities');
        commRef.once("value")
            .then((snapshot: any) => {
                this.loadValues(snapshot, cname);
            });
    }

    loadValues(snapshot: any, cname: string) {
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
            //Add a DiscussionBoard when its implemented
        }
    }

    createCommunity(creator: User, db: any) {
        this.admins.push(creator);
        this.updateRating(db);
        var commRef = db.ref('communities');
        commRef.child(this.name).set({
            name: this.name,
            picture: this.picture,
            location: this.location,
            users: JSON.stringify(this.users),
            admins: JSON.stringify(this.admins),
            rating: this.rating
        });
    }

    getCommunityName(): string {
        return this.name;
    }

    getRating(): number {
        return this.rating;
    }

    getLocation(): string {
        return this.location;
    }

    getPicture(): string {
        return this.picture;
    }

    inGroup(user: User, db: any) : boolean {
        return this.users.includes(user) || this.admins.includes(user);
    }

    updatePicture(pic: string) {

    }

    updateLocation(loc: string, db: any) {
        this.location = loc;
        var commRef = db.ref('communities');
        commRef.child(this.name).set({
            location: loc
        });
    }

    inviteUser(newUser: User) {

    }

    requestJoin(newUser: User) {

    }

    updateRating(db: any) {
        //Called by User.updateRating()
        var sum: number = 0;
        var count: number = 0;
        this.users.forEach((item) => {
            count++;
            sum += item.getRating();
        });
        this.admins.forEach((item) =>{
            count++;
            sum += item.getRating();
        });
        this.rating = sum / count;
        var commRef = db.ref('communities');
        commRef.child(this.name).set({
            rating: this.rating
        });
    }

    acceptUser(newUser: User) {
        //calls User.addCommunity(this)

    }

    rejectUser(newUser: User) {

    }

    addAdmin(newAdmin: User, db: any) {

    }

    removeUser(targetUser: User) {
        //calls User.removeCommunity(this)

    }

    leaveGroup(targetUser: User) {
        //calls User.removeCommunity(this)
    }
    
    getName():string {
        return this.name;
    }

    getRating():number {
        return this.rating;
    }

    getPicture():string {
        return this.picture;
    }
}