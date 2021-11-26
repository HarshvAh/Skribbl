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
  getRoomUsers
} = require('./utils/users');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const datasetUser = {};
const datasetRoom = {};
const room = [];
const user =[];

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", ({username,room}) => {
    socket.join(room);
    const user = userJoin(socket.id, username, room);
    console.log(user);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
    // room = dataset[room];
    // user = [data.username,data];

    io.to(room).emit('roomUsers', {
      room: room,
      users: getRoomUsers(room)
    });
  });

  socket.on("sendCanvasInfo", (data) => {
    socket.to(data.room).emit("receiveCanvasInfo", data);
    console.log("blah");
  });

  socket.on("start_game", (room) => {
    socket.broadcast.to(room).emit("startTheGame");
  });
  
  // socket.on("send_canvasInfo_draw", (data) => {
  //   socket.to(data.room).emit("receive_canvasInfo_draw", data);
  // });

  //  socket.on("send_canvasInfo_finish", (room) => {
  //   socket.to(room).emit("receive_canvasInfo_finish",room);
  // });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    //console.log(getRoomUsers(user.room))
    socket.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
    
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
