const rooms = [];

const words = ["ac/dc", "abraham lincoln", "adidas", "africa", "aladdin", "america", "amsterdam", "android", "angelina jolie", "angry birds", "antarctica", "anubis", "apple", "argentina", "asia", "asterix", "atlantis", "audi", "australia", "bmw", "bmx", "bambi", "band-aid", "barack obama", "bart simpson", "batman", "beethoven", "bible", "big ben", "bill gates", "bitcoin", "black friday", "bomberman", "brazil", "bruce lee", "bugs bunny", "canada", "capricorn", "captain america", "cat woman", "cerberus", "charlie chaplin", "chewbacca", "china", "chinatown", "christmas", "chrome", "chuck norris", "colosseum", "cookie monster", "crash bandicoot", "creeper", "croatia", "cuba", "cupid", "dna", "daffy duck", "darwin", "darwin watterson", "deadpool", "dexter", "discord", "donald duck", "donald trump", "dora", "doritos", "dracula", "dumbo", "earth", "easter", "easter bunny", "egypt", "eiffel tower", "einstein", "elmo", "elon musk", "elsa", "eminem", "england", "europe", "excalibur", "facebook", "family guy", "fanta", "ferrari", "finn", "finn and jake", "flash", "florida", "france", "frankenstein", "fred flintstone", "gandalf", "gandhi", "garfield", "germany", "god", "goofy", "google", "great wall", "greece", "green lantern", "grinch", "gru", "gumball", "happy meal", "harry potter", "hawaii", "hello kitty", "hercules", "hollywood", "home alone", "homer simpson", "hula hoop", "hulk", "ikea", "india", "intel", "ireland", "iron giant", "iron man", "israel", "italy", "jack-o-lantern", "jackie chan", "james bond", "japan", "jayz", "jenga", "jesus christ", "jimmy neutron", "john cena", "johnny bravo", "kfc", "katy perry", "kermit", "kim jong-un", "king kong", "kirby", "kung fu", "lady gaga", "las vegas", "lasagna", "lego", "leonardo dicaprio", "leonardo da vinci", "lion king", "london", "london eye", "luigi", "mtv", "madagascar", "mario", "mark zuckerberg", "mars", "mcdonalds", "medusa", "mercedes", "mercury", "mexico", "michael jackson", "mickey mouse", "microsoft", "milky way", "minecraft", "miniclip", "minion", "minotaur", "mona lisa", "monday", "monster", "mont blanc", "morgan freeman", "morse code", "morty", "mount everest", "mount rushmore", "mozart", "mr. bean", "mr. meeseeks", "mr bean", "mr meeseeks", "mummy", "nascar", "nasa", "nemo", "neptune", "netherlands", "new zealand", "nike", "nintendo switch", "north korea", "northern lights", "norway", "notch", "nutella", "obelix", "olaf", "oreo", "pac-man", "paris", "patrick", "paypal", "peppa pig", "pepsi", "phineas and ferb", "photoshop", "picasso", "pikachu", "pink panther", "pinocchio", "playstation", "pluto", "pokemon", "popeye", "popsicle", "porky pig", "portugal", "poseidon", "pringles", "pumba", "reddit", "rick", "robbie rotten", "robin hood", "romania", "rome", "russia", "samsung", "santa", "saturn", "scooby doo", "scotland", "segway", "sherlock holmes", "shrek", "singapore", "skittles", "skrillex", "skype", "slinky", "solar system", "sonic", "spain", "spartacus", "spiderman", "spongebob", "squidward", "star wars", "statue of liberty", "steam", "stegosaurus", "steve jobs", "stone age", "sudoku", "suez canal", "superman", "susan wojcicki", "sydney opera house", "t-rex", "tails", "tarzan", "teletubby", "terminator", "tetris", "the beatles", "thor", "titanic", "tooth fairy", "tower bridge", "tower of pisa", "tweety", "twitter", "ufo", "usb", "uranus", "usain bolt", "vatican", "vault boy", "velociraptor", "venus", "vin diesel", "w-lan", "wall-e", "whatsapp", "william shakespeare", "william wallace", "winnie the pooh", "wolverine", "wonder woman", "xbox", "xerox", "yin and yang", "yoda", "yoshi", "youtube", "zelda", "zeus", "zorro", "zuma" ];
/* 

    gameActive
    if(gameActive) - currentDrawingUser,nextDrawingUser
    scores, // now moved to users.js
    roomName ,
    UsersList

*/


class Room {





    constructor(user) {
        this.name = user.room ;
        this.usersList = [ user ] ;
        this.gameActive = false ;
        this.currentDrawingUser = -1 ;
        this.nextDrawingUser = -1 ;
        this.keywordToBeChoosen = undefined;
        this.keyword = "sohom" ;
        this.n_guessed = 0 ;
        this.currentRound = 0;
        this.totalRounds = 2;
        this.votekick = 0;
    }

    addUser(user) {
        if(this.gameActive){}
        else{
            this.usersList.push(user) ;
        }
    }

    increaseNGuessed(){ this.n_guessed += 1 ; }
    refreshNGuessed(){ this.n_guessed = 0 ; }

}




function newRoom(user){ // 'user' is the full data about user


    let room = new Room(user) ;
    rooms.push(room) ;


}



function joinRoom(user){

    const obj = rooms.find(room => room.name === user.room)

    if(obj === undefined){
        newRoom(user) ;
    }
    else {
        obj.addUser(user) ;
    }

}

function seeAllowedUser(username, theroom){
    const obj = rooms.find(room => room.name === theroom)
    if (obj === undefined) {
        return 0;
    }
    if ( obj.gameActive) {
        return 2;
    }
    if (obj.usersList.find(userroom => userroom.username === username) !== undefined){
        return 1;
    }
    return 0;
}


function getNGuessed(roomName){

    return ( rooms.find(room => room.name === roomName) ).n_guessed ;

}



function incrementNGuessed(roomName){

    ( rooms.find(room => room.name === roomName) ).increaseNGuessed() ;

}



function refreshNGuessed(roomName){

    ( rooms.find(room => room.name === roomName) ).resetNGuessed() ;

}

function startPlay(roomName){
    //const theRoom = rooms.find(room => room.name === roomName);
    
    (rooms.find(room => room.name === roomName)).gameActive = true;
    startRound((rooms.find(room => room.name === roomName)).name);
}

function startRound(roomName) {
    var roomIndex = rooms.findIndex(room => room.name === roomName);
    rooms[roomIndex].currentDrawingUser = 0;
    rooms[roomIndex].nextDrawingUser = 1;
    rooms[roomIndex].currentRound += 1;
    startSubRound(rooms[roomIndex].name);
}

function startSubRound (roomName) {
    (rooms.find(room => room.name === roomName)).n_guessed = 0;
    (rooms.find(room => room.name === roomName)).keywordToBeChoosen = generateKeyword();
}

function endSubRound (roomName) {
    var roomIndex = rooms.findIndex(room => room.name === roomName);
    rooms[roomIndex].votekick = 0 ;
    if (rooms[roomIndex].usersList.length === 1) {
        endPlay(roomName);
    }
    if (rooms[roomIndex].currentDrawingUser === rooms[roomIndex].usersList.length-1) {
        endRound(rooms[roomIndex].name);
    }
    else {
        rooms[roomIndex].currentDrawingUser += 1;
        startSubRound(rooms[roomIndex].name);
    }
}

function endRound (roomName) {
    var roomIndex = rooms.findIndex(room => room.name === roomName);
    if (rooms[roomIndex].currentRound === rooms[roomIndex].totalRounds) {
        endPlay(rooms[roomIndex].name);
    }
    else {
        rooms[roomIndex].n_guessed = 0;
    startRound(rooms[roomIndex].name);
    }
}

function endPlay (roomName) {

    var roomIndex = rooms.findIndex(room => room.name === roomName);
    console.log("reachedEndPlay");
    rooms[roomIndex].gameActive = false;
    rooms[roomIndex].currentDrawingUser = -1 ;
    rooms[roomIndex].nextDrawingUser = -1 ;
    rooms[roomIndex].keyword = "sohom" ;
    rooms[roomIndex].n_guessed = 0 ;
    rooms[roomIndex].currentRound = 0;
    
}

function getKeyword(roomName) {
    return ( rooms.find(room => room.name === roomName) ).keyword ;
}

function getCurrentDrawingUser(roomName) {
    const room = rooms.find(room => room.name === roomName) ;
    return room.usersList[room.currentDrawingUser] ;
}

function getCurrentRound(roomName) {
    return ( rooms.find(room => room.name === roomName) ).currentRound ;
}

function getGameActive(roomName) {
    return ( rooms.find(room => room.name === roomName) ).gameActive;
}

function generateKeyword(){

    var random1;
    var random2;
    var random3;
    random1 = Math.floor(Math.random() * words.length);
    random2 = Math.floor(Math.random() * words.length);
    random3 = Math.floor(Math.random() * words.length);
    while (random1 === random2) {
        random2 = Math.floor(Math.random() * words.length);
    }
    while (random3 === random2 || random1 === random3) {
        random3 = Math.floor(Math.random() * words.length);
    }
    var x_word = words[random1];
    var y_word = words[random2];
    var z_word = words[random3];
    // var x_word = "apple";
    // var y_word = "banana";
    // var z_word = "cat";

    const  keywordSet = {x_word, y_word, z_word};

    return keywordSet;
}

function getKeywordToBeChoosen(roomName) {
     return ( rooms.find(room => room.name === roomName) ).keywordToBeChoosen; 
}

function updateKeyword (roomName,wrd) {
    ( rooms.find(room => room.name === roomName) ).keyword = wrd;
}

//Votekick__


function incVotekick(roomName){

    var roomIndex = rooms.findIndex(room => room.name === roomName) ;
    rooms[roomIndex].votekick += 1 ;
    var user = undefined ;
    if(rooms[roomIndex].votekick === rooms[roomIndex].usersList.length - 1){
        
        console.log("votekick:about to call endSubRound")
        user = rooms[roomIndex].usersList.splice(rooms[roomIndex].currentDrawingUser,1)[0] ;
        rooms[roomIndex].currentDrawingUser -= 1 ; //for correcting the offset caused due to deleting
        endSubRound(roomName) ;
    }
    return user ;

}


//__

//OnDeletion__
function removeFromRoom(user){
    if (user) {
        
    
    var roomIndex = rooms.findIndex(room => room.name === user.room) ;
    if(roomIndex !== -1){
        var index = rooms[roomIndex].usersList.findIndex(person => person.id === user.id) ;
        rooms[roomIndex].usersList.splice(index,1) ;
    }
}

}

//setRoundCount___
function setRoundCount(argRounds,roomName){
    console.log(argRounds,roomName) ;
    ( rooms.find(room => room.name === roomName) ).totalRounds = argRounds ;
}


module.exports = {
    getNGuessed,
    incrementNGuessed,
    refreshNGuessed,
    joinRoom,
    startPlay,
    getKeyword,
    startRound,
    startSubRound,
    endSubRound,
    endRound,
    endPlay,
    getCurrentDrawingUser,
    getCurrentRound,
    getGameActive,
    generateKeyword,
    getKeywordToBeChoosen,
    updateKeyword,
    incVotekick,
    removeFromRoom,
    seeAllowedUser,
    setRoundCount
}