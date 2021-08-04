import {Post} from "./Post"
import {User} from "./User"

export class DiscussionBoard {
    post: Array<Post> = [];
    constructor(){
        
    }
    makePost(poster: User, db: any){
        var temppost = new Post(poster.getUsername(), "test", "this is a test post");
        this.post.push(temppost);
    }

    deletePost(){
        
    }
}