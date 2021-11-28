const users = [];


/*
  if element not found, an undefined object is obtained
  you can compare by equality with undefined , like obj === undefined  
*/



/*
class User{


  constructor(id,username,room){
    this.score = 0 ;
    this.id = id ;
    this.username = username ;
    this.room = room ;
  }

  getID()  { return this.id ; }
  getScore()  { return this.score ; }


}*/



// Join user to chat
function userJoin(id, username, room) {
  

  var score = 0 ;
  const user = {id, username, room, score};
  users.push(user);
  return user;


}




// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function getScore(id) {
  return (users.find(user => user.id === id) ).score ;
}

function updateScore(id,argScore) {
  (users.find(user => user.id === id) ).score += argScore ;
}

function clearScores(roomName) {
  getRoomUsers(roomName).forEach((user) => {
    user.score = 0;
  });
}



module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getScore,
  updateScore,
  clearScores
};
