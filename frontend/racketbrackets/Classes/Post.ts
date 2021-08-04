export class Post{
    poster: string;
    title: string;
    date: string = "";
    time: string = "";
    comments: Array<String> = [];

    constructor(author: string, name: string){
        this.poster = author;
        this.title = name;
    }
    addComment(){
        
    }

}