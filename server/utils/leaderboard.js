const players = [];
 
 //--------
 function addPlayer(username, scr){
   const player_name = username;
   const player_score = scr;
   const names_with_scores = {player_name, player_score};
  players.push(names_with_scores);
  console.log(players);
  return names_with_scores;
}

function updateLeaderboard(users){

  // users.forEach((user) => {
  //   //console.log(user);
  //   const li = document.createElement('li');
  //   li.innerText = user.username +"-"+ user.score;
  //   document.getElementById("users").appendChild(li);
  // });
  users.forEach((user) => {
  
    const player_name = user.username;
    const player_score = user.score;
    const player_id = user.id;
    const names_with_scores = {player_name, player_score, player_id};
    if(players.find(player => player.player_id  === names_with_scores.player_id) !== undefined){
      players.find(player => player.player_id === names_with_scores.player_id).player_score += names_with_scores.player_score;
    }
    else{
   players.push(names_with_scores);
    }
  });

 // if(players.find(names_with_scores => roomd.name === roomName).name)
  players.sort((p1,p2) => p1.player_score < p2.player_score ? 1 : -1);

  
    //(players.find(names_with_scores => names_with_scores.player_name === usrname)).player_score += num;
}
  //---------

function getPlayers(){
    const tempo_list = players;
    if (tempo_list.length > 8) {
      tempo_list.splice(8,tempo_list.length -8);
    }
    return tempo_list;
}

function sortPlayerScore(){
    players.sort((p1,p2) => p1.player_score < p2.player_score ? 1 : -1);

    // const top5 = {
    //     ply1 : players[0],
    //     ply2 : players[1],
    //     ply3 : players[2],
    //     ply1 : players[3],
    //     ply1 : players[4],
    // }

    return players;
}

module.exports = {
    addPlayer,
    updateLeaderboard,
    getPlayers,
    sortPlayerScore
}