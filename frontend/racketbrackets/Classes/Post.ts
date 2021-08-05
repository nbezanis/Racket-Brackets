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