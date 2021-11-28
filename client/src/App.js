import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import Lobby from "./Lobby";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [lobbyType, setLobbyType] = useState("markrum"); // if lobby is public, then 1, if it is private, then 0, default would be ""

  socket.on("show_leaderboard", (brd) =>{

    console.log(brd);
      if (document.getElementById("globalp")) {
        document.getElementById("globalp").innerHTML = "";
      }
      

      brd.forEach((names_with_scores) => {
        console.log("inside the render function");
            //console.log(user);
            const li = document.createElement('li');
           // li.innerText ="Player: " + " Points: ";
            li.innerText ="Player: " + names_with_scores.player_name + " Points: " + names_with_scores.player_score ;
            if (document.getElementById("globalp")) {
              document.getElementById("globalp").appendChild(li);
            }
            
          });

  });

  socket.on("allowornot", (allow) => {
    console.log(allow);
      if (allow === 2) {
        document.getElementById("warning").innerHTML = "Game Already Started. Please wait ";
      }
      else if (allow === 1) {
        //alert("Username taken");
        document.getElementById("warning").innerHTML = "Username taken in this Room";
      }
      else {
      setShowChat(true);
      }
  })
  
  const joinRoom = () => {
    console.log("abc");
    //var allowornot;
    if (username !== "" && room !== "") {
      const info = {
        username : username,
        room : room,
      }
      socket.emit("join_room", {username,room});
      
    }
  };


  return (
    <div className="App">
      {!showChat ? (
        
        <div className="joinChatContainer">
          <h2>Leaderboard</h2>
          <ol id="globalp"></ol>
          <h3>Skribbl</h3>
          <input
            id="textinput"
            type="text"
            placeholder="Enter Username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          
          <select name="Lobby Type" id="Lobby Type" value={lobbyType} required onChange={(e) => setLobbyType(e.target.value)}>
            <option value="markrum" selected>---Please select---</option>
            <option value="Public">Public Lobby</option>
            <option value="Private">Private Lobby</option>
          </select>
          
          <div>
            {lobbyType === "Public" ? (
              <select name="room" id="room" value={room} required onChange={(e) => setRoom(e.target.value)}>
                <option value="" selected>---Please select---</option>
                <option value="Public Lobby 1">Public Lobby 1</option>
                <option value="Public Lobby 2">Public Lobby 2</option>
                <option value="Public Lobby 3">Public Lobby 3</option>
                <option value="Public Lobby 4">Public Lobby 4</option>
                <option value="Public Lobby 5">Public Lobby 5</option>
              </select>
            ) : (
              <br></br>
            )}<div>
            {lobbyType === "Private" ? (
              <input
                type="text"
                placeholder="Room ID..."
                onChange={(event) => {
                  setRoom(event.target.value);
                }
              }
              />
            ) : (
              <br></br>
            )}
            </div>
        <button id="button"onClick={joinRoom}>Join Room</button>
        </div>
        <div>
        <p id="warning" style={{color:"red"}}></p>
        </div>
          
      </div>
      ) : (
        <Lobby socket={socket} username={username} room={room} setShowChat={setShowChat} />
      )}
    </div>
  );
}

export default App;