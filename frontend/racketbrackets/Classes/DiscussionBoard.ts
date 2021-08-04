import {Post} from "./Post"
import {User} from "./User"

export class DiscussionBoard {
    post: Array<Post>;
    constructor(){
        this.post = [];
    }
    makePost(poster: User, ptitle: string, pbody: string, db: any){
        var temppost = new Post(poster.getUsername(), ptitle, pbody);
        this.post.push(temppost);
    }

    deletePost(){
        
    }
}