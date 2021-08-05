import {Post} from "./Post"
import {User} from "./User"

/*
* The discussion board class is represented by an Array of Post
* objects
*/
export class DiscussionBoard {
    post: Array<Post>;
    constructor(){
        this.post = [];
    }
    makePost(poster: string, ptitle: string, pbody: string){
        var temppost = new Post(poster, ptitle, pbody);
        this.post.push(temppost);
    }

    deletePost(){
        
    }
}