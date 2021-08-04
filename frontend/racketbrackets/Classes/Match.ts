import { User } from "./User";
/*
*The Match class represents a match between two users. It includes an int that represents a
*unique id number, an array that will hold the two players that are participating, a 
*date on which the match is played, a location which is a string representing the location
*of the match, and finally a score array that holds the final score of the match. 
*/
export class Match {
    id: number = 0;
    players: Array<string> = [];
    date: Date = new Date();
    location: string = "";
    score: Array<number> = [];

    constructor(id: number, db: any){
        //Should query database for id, and fill in fields if match exists
        //Use 0 to indicate a new match (i.e. do not need to load data)
        if( id != 0) {
            this.id = id;

            var matchRef = db.ref('matches');
            matchRef.once("value")
                .then((snapshot: any) => {
                    this.loadValues(snapshot, String(id),db);
                });
        }
    }

    loadValues(snapshot: any, matchNum: string,db: any) {
        if(snapshot.hasChild(matchNum)) {
            this.id = +matchNum;
            this.date = snapshot.child(matchNum + "/date").val();
            this.location = snapshot.child(matchNum + "/location").val();
            if(snapshot.child(matchNum + "/players").val == null) {
                this.players = [];
            } else {
                const players:Array<string> = JSON.parse(snapshot.child(matchNum + "/players").val());
                players.forEach((player) => {
                    this.players.push(player);
                });
            }
            if (snapshot.child(matchNum + "/score") == null) {
                this.score = [];
            } else {
                const scores: Array<string> = JSON.parse(snapshot.child(matchNum + "/score").val());
                scores.forEach((score) => {
                    this.score.push(parseInt(score));
                });
            }
        }
    }

    createMatch(players: Array<User>, matchDate: Date, loc: string, db: any){
        var matchID = newMatchRef.key;
        var playerNames: Array<string> = new Array<string>();
        players.forEach((player) => {
            playerNames.push(player.getUsername());
        })
        this.id = matchID;
        this.players = playerNames;
        this.date = matchDate;
        this.location = loc;
        this.score = [];
        var matchRef = db.ref('matches');
        var newMatchRef = matchRef.push({
            date: matchDate,
            players: JSON.stringify(playerNames),
            location: loc,
            score: false
        });
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
        if(this.players.includes(player.getUsername())) {
            console.error("Player is already in match");
        } else {
            this.players.push(player.getUsername());
            var matchRef = db.ref('matches');
            matchRef.child(this.id).set({
                players: JSON.stringify(this.players)
            });
        }
    }

    recordResult(matchScore: Array<number>, db: any) {
        //Calls User.addMatch(this)
        if(this.score.length != 0) {
            console.error("Match is already scored")
        } else {
            this.players.forEach((player) => {
                const u: User = new User(player, db);
                //addMatch should adjust the player's rankings, so might need to pass the other User too?
                u.addMatch(this,db);
            });
            //TODO: Validate that this is a valid tennis score
            this.score = matchScore;
            var matchRef = db.ref('matches');
            matchRef.child(this.id).update({
                score: JSON.stringify(this.score)
            });
        }

    }

    cancelMatch(db: any) {
        //calls user.removeUpcomingMatch() for all players
        if(this.players.length != 0) {
            this.players.forEach((player) => {
                const u: User = new User(player,db);
                u.removeUpcomingMatch(this,db);
            });
        } else {
            console.error("No Users in this match");
        }
    }

    acceptMatch(db: any) {
        //Calls User.addUpcomingMatch()
        if(this.players.length != 0) {
            this.players.forEach((player) => {
                const u: User = new User(player, db);
                u.addMatch(this,db);
            });
        } else {
            console.error("No Users in this match");
        }

    }

    rejectMatch() {
        
    }

}

