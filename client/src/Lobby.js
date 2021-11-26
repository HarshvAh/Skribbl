import React, {useCallback, useRef, useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Chat from "./Chat";

const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");



function Lobby({ socket, username, room }) {

    //var startGame = false;
    const [startGame, setStartGame] = useState(false);
  //-------------------------------------------
  //-------------------------------------------
  socket.on('roomUsers', ({ room, users }) => {
    //outputRoomName(room);
    //outputUsers(users);
    console.log("balh");
    document.getElementById("users").innerHTML = "";
    users.forEach((user) => {
          console.log(user);
          const li = document.createElement('li');
          li.innerText = user.username;
          document.getElementById("users").appendChild(li);
        });
  });

  // function outputRoomName(room) {
  //   roomName.innerText = room;
  // }
  
  // // Add users to DOM
  // function outputUsers(users) {
  //   userList.innerHTML = '';
  //   users.forEach((user) => {
  //     console.log(user.username);
  //     const li = document.createElement('li');
  //     li.innerText = user.username;
  //     userList.appendChild(li);
  //   });
  // }

  //-------------------------------------------
  //-------------------------------------------


  //-------------------------------------------

  const joinGamepage = () => {
      socket.emit("start_game",room);
      setStartGame(true);
  }

  socket.on( "startTheGame", () => {
        setStartGame(true);
  });
  
  var emitBool = true
  var socketBool = false


  

  

   //-------------------------------------------

  useEffect(() => {
    // socket.on("receive_message", (data) => {
    //   setMessageList((list) => [...list, data]);
      
    // });

  }, [socket]);

  return (
    <div>
      <ul id="users"></ul>
    {/* <h1 
        id="timer"
        style={{
          border: "6px solid #000",
          position: "absolute",
          top : 0,
    	    left: 0
        }}></h1> */}
    {!startGame ? (
        <button onClick={joinGamepage}>start</button>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}

    </div>
  );
}

export default Lobby;
