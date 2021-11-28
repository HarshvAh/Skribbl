const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  updateScore,
  clearScores
} = require('./utils/users');

const {
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
  getKeywordToBeChoosen,
  updateKeyword,
  incVotekick,
  removeFromRoom,
  seeAllowedUser,
  setRoundCount
} = require('./utils/rooms');

const { sortPlayerScore, getPlayers, updateLeaderboard } = require("./utils/leaderboard");


const server = http.createServer(app);

const word = "kuchbhi";

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const datasetUser = {};
const datasetRoom = {};
const room = [];
const user = [];


//____________________________________________________________________________________



const max = 400 ;





//______________________________________________________________________________________________



io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  
  io.to(socket.id).emit("show_leaderboard", getPlayers());
  const addPoints = async (user) => {


    const roomName = user.room ;
    const id = user.id ;
    const usersList = getRoomUsers(roomName) ; 
  
    var n_guessed = getNGuessed(roomName) ;
  
    const score = parseInt(max * ( 1 - n_guessed/usersList.length )) ;
    updateScore(id,score);
    incrementNGuessed(roomName) ;
    n_guessed = getNGuessed(roomName) ;
    console.log(n_guessed);
    
    console.log(usersList.length-1);
    if(n_guessed === usersList.length-1){
      console.log("reached");
      endSubRound(roomName);
      console.log(getCurrentDrawingUser(roomName));
      
      if (getGameActive(roomName)) {
        io.to(roomName).emit('keywords',{
          keydata : getKeywordToBeChoosen(roomName),
          currUser : getCurrentDrawingUser(roomName)
        });
      io.to(roomName).emit('roundInfo', {
        currentUser : getCurrentDrawingUser(roomName),
        currentRound : getCurrentRound(roomName)
      });
      }
      else {
        const usr_ary = getRoomUsers(roomName);
        updateLeaderboard(usr_ary);
        
        io.to(roomName).emit('endGame', {
          gameDead : true
        });
        //await new Promise(r => setTimeout(r, 2000));
        clearScores(roomName);
      
      }
    };
  
  
  }

  socket.on("join_room", ({username,room}) => {
    //const tempuser = {socket.id , username, room, 0};
    var allow = seeAllowedUser(username,room);
    if (allow === 2) {
      io.to(socket.id).emit("allowornot",allow);
      //console.log(allow);
    }
    else if (allow === 1) {
      io.to(socket.id).emit("allowornot",allow);
      //console.log(allow);
    }
    else {
      //console.log(allow);
      io.to(socket.id).emit("allowornot",allow);
    socket.join(room);
    const user = userJoin(socket.id, username, room);
    //console.log(rooms);
    joinRoom(user);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
    // room = dataset[room];
    // user = [data.username,data];
    //console.log(getRoomUsers(room));
    io.to(room).emit('roomUsers', {
      room: room,
      users: getRoomUsers(room)
    });
  }
  });

  socket.on("send_keyword", (keywordData) => {
    updateKeyword(keywordData.room, keywordData.txt);
    io.to(keywordData.room).emit("secret_keyword",keywordData.txt);
  });

  socket.on("sendCanvasInfo", (data) => {
    socket.to(data.room).emit("receiveCanvasInfo", data);
    //console.log("blah");
  });

  socket.on("start_game", async (room) => {
    startPlay(room);
    socket.broadcast.to(room).emit("startTheGame");
    //console.log(getCurrentDrawingUser(room));
    io.to(room).emit('roundInfo', {
      currentUser : getCurrentDrawingUser(room),
      currentRound : getCurrentRound(room)
    });
    //await new Promise(r => setTimeout(r, 1000));
    const keywordstored = getKeywordToBeChoosen(room);
    console.log(keywordstored);
    io.to(room).emit('keywords',{
      keydata : keywordstored,
      currUser : getCurrentDrawingUser(room)
    });

  });

  //VoteKick__

  socket.on("votekick", (roomName) => {

    const user = incVotekick(roomName) ;
    if(user !== undefined){
      userLeave(user.id) ;
      if (getGameActive(roomName)) {
        io.to(roomName).emit('keywords',{
          keydata : getKeywordToBeChoosen(roomName),
          currUser : getCurrentDrawingUser(roomName)
        });
      io.to(roomName).emit('roundInfo', {
        currentUser : getCurrentDrawingUser(roomName),
        currentRound : getCurrentRound(roomName)
      });
      }
      else {
        const usr_ary = getRoomUsers(roomName);
        updateLeaderboard(usr_ary);
        console.log("votekick1person");
        
        io.to(roomName).emit('endGame', {
          gameDead : true
        });
        clearScores(roomName);
      }
      //var list = io.sockets.adapter.rooms(roomName) ;
      //var index = list.findIndex(socket => socket.id === user.id) ;
      io.to(user.id).emit('gotKicked',{}) ;
      io.to(roomName).emit('roomUsers2', {
        room: roomName,
        users: getRoomUsers(roomName)
      });
    }

  });


//_
  
  // socket.on("send_canvasInfo_draw", (data) => {
  //   socket.to(data.room).emit("receive_canvasInfo_draw", data);
  // });

  //  socket.on("send_canvasInfo_finish", (room) => {
  //   socket.to(room).emit("receive_canvasInfo_finish",room);
  // });

  socket.on("send_message", (data) => {

    // check if word is same as the keyword for this room

    const keyWord = getKeyword(data.room);
    const data_to = data;
    if (!data.guess) {
      if (keyWord === data.message) {
        data_to.guess = true;
        //data.guess = true;
      data_to.message = data_to.author + " guessed the word correctly";
        const user = getCurrentUser(socket.id);
        addPoints(user);
        console.log("addpoint");
        io.to(data.room).emit("receive_message", data_to);
      }
      else {
        io.to(data.room).emit("receive_message", data);
      }
      /* 
      if(guess is correct){
        point allocate, scores update
        str = {user.name} has guessed correctly
        socket.to(data.room).emit("receive_message", str);
      }
      else{}
      */
    
    }
    io.to(data.room).emit('roomUsers2', {
      room: data.room,
      users: getRoomUsers(data.room)
    });
   
  });

  socket.on("startTimerAll", (roomName) => {
    socket.to(roomName).emit("recieveStartTimer");
  })

  socket.on("endOfTime", (roomName) => {
    endSubRound(roomName);
    //  console.log(getCurrentDrawingUser(roomName));
      
      if (getGameActive(roomName)) {
        io.to(roomName).emit('keywords',{
          keydata : getKeywordToBeChoosen(roomName),
          currUser : getCurrentDrawingUser(roomName)
        });
      io.to(roomName).emit('roundInfo', {
        currentUser : getCurrentDrawingUser(roomName),
        currentRound : getCurrentRound(roomName)
      });
      }
      else {
        const usr_ary = getRoomUsers(roomName);
        updateLeaderboard(usr_ary);
        
        io.to(roomName).emit('endGame', {
          gameDead : true
        });
        clearScores(roomName);
      }
  })

  //setRoundCount__
  socket.on("setRoundCount", (data) => {

    console.log("index.js setRoundCount:"+data.roomName) ;
    setRoundCount(data.argRounds,data.roomName) ;

  });

  socket.on("disconnect", () => {
    
    removeFromRoom(getCurrentUser(socket.id));
    const user = userLeave(socket.id);
    if (user) {
    //console.log(getRoomUsers(user.room))
    console.log(getRoomUsers(user.room))
    socket.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
    var roomName = user.room;
      endSubRound(roomName);
      console.log(getCurrentDrawingUser(roomName));
      
      if (getGameActive(roomName)) {
        io.to(roomName).emit('keywords',{
          keydata : getKeywordToBeChoosen(roomName),
          currUser : getCurrentDrawingUser(roomName)
        });
      io.to(roomName).emit('roundInfo', {
        currentUser : getCurrentDrawingUser(roomName),
        currentRound : getCurrentRound(roomName)
      });
      }
      else {
        const usr_ary = getRoomUsers(roomName);
        updateLeaderboard(usr_ary);
        
        io.to(roomName).emit('endGame', {
          gameDead : true
        });
        clearScores(roomName);
      }
    console.log("User Disconnected", socket.id);
  }
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
