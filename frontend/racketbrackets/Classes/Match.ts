import { User } from "./User";


/*
*The Match class represents a match between two users. It includes an int that represents a
*unique id number, an array that will hold the two players that are participating, a 
*date on which the match is played, a location which is a string representing the location
*of the match, and finally a score array that holds the final score of the match. 
*/
export class Match {
    id: number = 0;
    players: Array<User> = [];
    date: Date = new Date();
    location: string = "";
    score: Array<number> = [];

    constructor(id: number){
        //Should query database for id, and fill in fields if match exists
        //Maybe use 0 to indicate new match?
    }

    createMatch(players: Array<User>, matchDate: Date, loc: string, db: any){
        var matchRef = db.ref('matches');
        var newMatchRef = matchRef.push({
            date: matchDate,
            players: JSON.stringify(players),
            location: loc,
            score: false
        });
        var matchID = newMatchRef.key;
        this.id = matchID;
        this.players = players;
        this.date = matchDate;
        this.location = loc;

    }

    setTime(time: Date, db: any) {
        this.date = time;
        var matchRef = db.ref('matches');
        matchRef.child(this.id).set({
            date: this.date
        });
    }

    setLocation(loc: string, db: any) {
        this.location = loc;
        var matchRef = db.ref('matches');
        matchRef.child(this.id).set({
            location: this.location
        });
    }

    addPlayer(player: User, db: any) {
        //Called by acceptMatch() and rejectMatch()?
        //Todo: check to ensure player is not already in match
        this.players.push(player);
        var matchRef = db.ref('matches');
        matchRef.child(this.id).set({
            players: JSON.stringify(this.players)
        });
    }

    recordResult(matchScore: Array<number>) {
        //Calls User.addMatch(this)

    }

    cancelMatch() {
        //calls user.removeUpcomingMatch() for all players

    }

    acceptMatch() {
        //Calls User.addUpcomingMatch()

    }

    rejectMatch() {
        
    }

}

