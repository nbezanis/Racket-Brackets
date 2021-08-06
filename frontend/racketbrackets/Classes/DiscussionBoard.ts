import {Post} from "./Post"
import {User} from "./User"

/*
* The discussion board class is represented by an Array of Post
* objects
*/
export class DiscussionBoard {
    post: Array<Post>;
    
    //Constructor for DiscussionBoard Class
    //Creates an empty array of posts
    constructor(){
        this.post = [];
    }

    //DiscussionBoard.makePost()
    //Input: poster - the name of the user making the post
    //Input: ptitle - the title of the new post
    //Input: pbody - the body of the new post
    //Creates a new post and puts it into this DiscussionBoard
    makePost(poster: string, ptitle: string, pbody: string){
        var temppost = new Post(poster, ptitle, pbody);
        this.post.push(temppost);
    }

    //DisucssionBoard.deletePost()
    //Input: target - the post to be deleted
    deletePost(target: Post){
        const index = this.post.indexOf(target);
        if(index > -1) {
            this.post.splice(index, 1);
        }
    }
}