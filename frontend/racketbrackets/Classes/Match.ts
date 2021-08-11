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
    date: string = "";
    location: string = "";
    score: Array<number> = [];

    //Constructor for Match Class
    //Input: id - the numeric database key for a specific match
    //Input: db - a reference to the firebase database containing Match data
    //creates a new object, and attempts to load database data with loadValues()
    constructor(id: number, db: any){
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

    //Match.loadValues()
    //Input: snapshot - a firebase DatabaseSnapshot object for the 'matches' data field
    //Input: matchNum - the numeric database key for the match
    //Input: db - a reference to the firebase database containing Match data
    //looks for specified match in database, and, if found, loads object fields
    loadValues(snapshot: any, matchNum: string, db: any) {
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

    //Match.createMatch()
    //Input: players - An array of players participating in the match
    //Input: matchDate - A date in ISO format for the time and day of the match
    //Input: loc - A string location of the match
    //Input: db - a reference to the firebase database containing Match data
    //Creates a new entry in the database for this new match using the provided match data
    createMatch(players: Array<User>, matchDate: Date, loc: string, db: any){
        var playerNames: Array<string> = new Array<string>();
        players.forEach((player) => {
            playerNames.push(player.getUsername());
        });
        //Set object fields
        this.players = playerNames;
        this.date = matchDate.toISOString();
        this.location = loc;
        this.score = [];
        //Create database entry
        var matchRef = db.ref('matches');
        var newMatchRef = matchRef.push({
            date: this.date,
            players: JSON.stringify(playerNames),
            location: this.location,
            score: false
        });
        var matchID = newMatchRef.key;
        this.id = matchID;
        var matches:Array<Match> = [];
        var userRef = db.ref("/").once("value")
            .then(snapshot => {
                players.forEach((user: any) => {
                    const u =snapshot.child("/users/" + user.getUsername()).val()
                    console.log(u.username + " " + u.rating);
                    matches = u.upcomingMatches;
                    if(!matches) {
                        matches = new Array<Match>();
                    } else {
                        matches = JSON.parse(u.upcomingMatches);
                    }
                    matches.push(this);
                    var userRef = db.ref('users');
                    userRef.child(u.username).update({
                        upcomingMatches: JSON.stringify(matches)
                    })
                });
            })
    }

    //Match.setTime()
    //Input: time - a Date in ISO format, the new time and day of the match
    //Input: db - a reference to the firebase database containing Match data
    //Updates the match's date field
    setTime(time: string, db: any) {
        //update local field
        this.date = time;
        //update database
        var matchRef = db.ref('matches');
        matchRef.child(this.id).set({
            date: this.date
        });
    }

    //Match.setLocation()
    //Input: loc - string new location of the match
    //Input: db - a reference to the firebase database containing Match data
    //Updates the location of the match
    setLocation(loc: string, db: any) {
        //update local field
        this.location = loc;
        //update database
        var matchRef = db.ref('matches');
        matchRef.child(this.id).set({
            location: this.location
        });
    }

    //Match.addPlayer()
    //Input: player - the User object of the player to be added
    //Input: db - a reference to the firebase database containing Match data
    //Adds a player to the match's array of players
    addPlayer(player: User, db: any) {
        //See if player is already in match
        if(this.players.includes(player.getUsername())) {
            console.error("Player is already in match");
        } else {
            //If player is not in match, update local fields
            this.players.push(player.getUsername());
            //update database
            var matchRef = db.ref('matches');
            matchRef.child(this.id).set({
                players: JSON.stringify(this.players)
            });
        }
    }

    //Match.recordResult()
    //Input: matchScore - An array of numbers representing the score of a completed tennis match
    //Input: db - a reference to the firebase database containing Match data
    //Moves match from upcoming to previosu for all players
    //Calls players to update their rankings
    recordResult(matchScore: Array<number>, db: any) {
        //Ensure match is unscored
        if(this.score.length != 0) {
            console.error("Match is already scored")
        } else {
            //Move match from upcoming to previous for all players and update rankings
            this.players.forEach((player) => {
                const u: User = new User(player, db);
                //addMatch should adjust the player's rankings, so might need to pass the other User too?
                u.addMatch(this,db);
            });
            //TODO: Validate that this is a valid tennis score
            //add score to match object
            this.score = matchScore;
            //update database
            var matchRef = db.ref('matches');
            matchRef.child(this.id).update({
                score: JSON.stringify(this.score)
            });
        }

    }

    //Match.cancelMatch()
    //Input: db - a reference to the firebase database containing Match data
    //Concels an upcoming match
    cancelMatch(db: any) {
        //Ensure match isn't completed (indicated by a score)
        if(this.score.length == 0) {
            //Ensure match has players
            if(this.players.length != 0) {
                //remove match from all player's upcoming matches
                this.players.forEach((player) => {
                    const u: User = new User(player,db);
                    u.removeUpcomingMatch(this,db);
                });
            } else {
                console.error("No Users in this match");
            }
        } else {
            console.error("Cannot Cancel completed match")
        }
    }

    //Match.acceptMatch()
    //Input: db - a reference to the firebase database containing Match data
    //Accept a challenge between players, and add match to their upcoming matches
    acceptMatch(db: any) {
        //Ensure this match has players
        if(this.players.length != 0) {
            //Add match to all player's upcoming matches
            this.players.forEach((player) => {
                const u: User = new User(player, db);
                u.addUpcomingMatch(this,db);
            });
        } else {
            console.error("No Users in this match");
        }

    }

    //Match.rejectMatch()
    //Input: db - a reference to the firebase database containing Match data
    //Reject a challenge, and remove the match from upcoming matches
    rejectMatch(db: any) {
        this.cancelMatch(db);
    }

}

