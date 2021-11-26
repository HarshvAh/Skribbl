import React, {useCallback, useRef, useEffect, useState } from "react";
//import ScrollToBottom from "react-scroll-to-bottom";
import "./user_lobby";

function Lobby({ socket, username, room }) {

  //const socket = io();

 // const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  //-------------------------------------

  //const roomName = document.getElementById('room-name');
//const userList = document.getElementById('users');

 
    
  //-------------------------------------

  const [startGame, setStartGame] = useState(false);

  socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

  const gamejoin = () => {
    socket.emit("start_game",room);
    setStartGame(true);
}
  
  //const startGame = async () => {
  //   if (currentMessage !== "") {
  //     const messageData = {
  //       room: room,
  //       author: username,
  //       message: currentMessage,
  //       time:
  //         new Date(Date.now()).getHours() +
  //         ":" +
  //         new Date(Date.now()).getMinutes(),
  //     };

  //     await socket.emit("send_message", messageData);
  //     setMessageList((list) => [...list, messageData]);
  //     setCurrentMessage("");
  //   }
  // };

  useEffect(() => {
    // socket.on("receive_message", (data) => {
    //   console.log("blah")
    //   setMessageList((list) => [...list, data]);
      
    // });

    // socket.on('roomUsers', ({ room, users }) => {
    //   outputRoomName(room);
    //   outputUsers(users);
    // });

  }, [socket]);

   // Add room name to DOM
function outputRoomName(room) {
  document.getElementById("room-name").innerText = room;
}

// // Add users to DOM
function outputUsers(users) {
  document.getElementById("users").innerHTML = "";
  //userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    document.getElementById("users").appendChild(li);
  });
}

  return (
    <div>
      <br />
    <div className="chat-window">
      <div className="chat-header">
        <p>Lobby</p>
      </div>

      <div className="chat-body">
          <h3> Room Name:</h3>
          <h2 id="room-name"></h2>
          <h3>Users</h3>
          <ul id="users"></ul>

      </div>

      <div className="chat-footer">
        {/* <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        /> */}
        <button onClick={gamejoin}>Start Game</button>
      </div>
    </div>
    </div>
  );


}

export default Lobby;
