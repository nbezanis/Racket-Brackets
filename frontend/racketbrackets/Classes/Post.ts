/*
* The Post class contains various information that makes up a post
* on a discussion board. This includes the poster, title, body of the post,
* date, time, and any comments that the post may have
*/

export class Post{
    poster: string;
    title: string;
    body: string;
    date: string = "";
    time: string = "";
    comments: Array<String> = [];

    constructor(pposter: string, ptitle: string, pbody: string){
        this.poster = pposter;
        this.title = ptitle;
        this.body = pbody;
    }
    addComment(){
        
    }

}