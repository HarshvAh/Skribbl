import React, {useCallback, useRef, useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Chat from "./Chat";

const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");



function Lobby({ socket, username, room, setShowChat }) {

    //var startGame = false;
    //const [subRoundDuration, setSubRoundDuration] = useState("60");
    const [roundCount, setRoundCount] = useState("3");
    const [userInLobby, setUserInLobby] = useState(0);
    const [startGame, setStartGame] = useState(false);
  //-------------------------------------------
  //-------------------------------------------
  socket.on('roomUsers', ({ room, users }) => {
    //outputRoomName(room);
    //outputUsers(users);
    setUserInLobby(users.length);
    //console.log("balh");
    if(document.getElementById("room-name")){
      document.getElementById("room-name").innerText = room;
      document.getElementById("users").innerHTML = "";
    }
    console.log(users);
    users.forEach((user) => {
          console.log(user);
          const li = document.createElement('li');
          li.innerText = user.username +"\t: "+ user.score;
          if(document.getElementById("users")){
            document.getElementById("users").appendChild(li);
          }
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
    if (userInLobby === 1) {
      alert("A single player cannot play the game");
    }
    else {
      //var argTime = parseInt(subRoundDuration) ;
    var argRounds = parseInt(roundCount) ;
    socket.emit("start_game",room);
    //socket.emit("setSubRoundTimer" ,{argTime,room});
    console.log("joinGamePage:"+room) ;
    const data = { argRounds:argRounds, roomName:room } ;
    socket.emit("setRoundCount" ,data);

    setStartGame(true);
    }
  }

  socket.on( "startTheGame", () => {
        setStartGame(true);
  });
  
  var emitBool = true
  var socketBool = false

  const rejoinLobby = () => {
    setStartGame(false);
  }  
  

  

   //-------------------------------------------

  useEffect(() => {
    // socket.on("receive_message", (data) => {
    //   setMessageList((list) => [...list, data]);
      
    // });

  }, [socket]);

  return (
    <div >
      <div className="header">
<h1>Skribbl Game</h1>
</div>
      <div className="chat-list">
        <h2>Room name</h2>
        <h3 id='room-name'></h3>
        <h2>Players in the lobby</h2>
        <b>
        <ul id="users"></ul>
        </b>
      </div>
    {/* <h1 
        id="timer"
        style={{
          border: "6px solid #000",
          position: "absolute",
          top : 0,
    	    left: 0
        }}></h1> */}
    {!startGame ? (
      <div>
        <div>
        <h3>Number of rounds:</h3>
        </div><div>
        <select name="roundCount" id="roundCount" value={roundCount} required onChange={(e)=>{setRoundCount(e.target.value)}}>
          <option value="1">1 </option>
          <option value="2">2</option>
          <option value="3" selected>3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>
        </div>
        <button onClick={joinGamepage}>start</button>
        </div>
      ) : (
        // <script>
        //   const chat = Chat({socket,username,room});
        //   {/* if (chat === false) {
        //     setStartGame(false)
        //   }
        //   else {
            
        //   } */}
        // </script>
         <Chat socket={socket} username={username} room={room} setStartGame={setStartGame} setShowChat={setShowChat}/>
      )}

    </div>
  );
}

export default Lobby;
