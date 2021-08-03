import { User } from "./User";

export class Community{
    name: string;
    picture: string = "";
    location: string = "";
    users: Array<User> = [];
    admins: Array<User> = [];
    rating: number = 800;
    //Todo: Implement DiscussionBoard
    //board: DiscussionBoard

    constructor(cname: string) {
        this.name = cname;
        //Should query database to see if group exists, and if so, populate other fields
    }

    createCommunity(creator: User, db: any) {
        this.admins.push(creator);
        this.updateRating();
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

    updatePicture(pic: string) {

    }

    updateLocation(loc: string) {

    }

    inviteUser(newUser: User) {

    }

    requestJoin(newUser: User) {

    }

    updateRating() {
        //Called by User.updateRating()

    }

    acceptUser(newUser: User) {
        //calls User.addCommunity(this)

    }

    rejectUser(newUser: User) {

    }

    addAdmin(newAdmin: User) {

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