import React, {useCallback, useRef, useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Lobby from "./Lobby";

const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

var intervalTimer;
const colors = [
  "red",
  "green",
  "yellow",
  "black",
  "blue"
]


function Chat({ socket, username, room, setStartGame, setShowChat }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [Voted, setVoted] = useState(false) ;
  const [messageList, setMessageList] = useState([]);
  const [guess, setGuess] = useState(false);
  const [currentDrawingUser, setCurrentDrawingUser] = useState("");
  const [currentRound, setCurrentRound] = useState(0);

  const [curkey, setCurkey] = useState("");
  const [guesschat, setGuesschat] = useState(false);
  const timeShow = useRef(undefined);
  const [endGameLeaderboard , setEndGameLeaderboard] = useState([]);
  const [allowInteraction, setAllowInteration] = useState(false);
  //-------------------------------------------
  //-------------------------------------------
  
  socket.on('roomUsers', ({ room, users }) => {
    //outputRoomName(room);
    //outputUsers(users);
    //console.log("balh");
    if(document.getElementById("users")){
      document.getElementById("users").innerHTML = "";
    }
      users.forEach((user) => {
          var s1 = user.username;
          var s2 = user.score;
          var temporarr = {s1,s2};
          setEndGameLeaderboard((list) => [...list, temporarr]);
          //console.log(user);
          const li = document.createElement('li');
          li.innerText = user.username  +"\t: "+ user.score;
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

  var timer = 45;
  function startTimer() {
    timer = 45;
    timeShow.current = setInterval(ticktokTimer,1000)
    setAllowInteration(true);
  }

  const ticktokTimer = () => {
    if(timer>0){
    timer = timer - 1;
    }
    //console.log(timer);
    if (document.getElementById("timer")){
    document.getElementById("timer").innerHTML = timer.toString();
    }
    if (timer <= 0) {
      endTimer();
    }
  }

  const endTimer = () => {
    clearInterval(timeShow.current);
    //intervalTimer = undefined;
    setAllowInteration(false);
    //console.log(intervalTimer);
    if (document.getElementById("timer")){
      document.getElementById("timer").innerHTML = "";
    }
    if (timer === 0 && currentDrawingUser === username) {
      socket.emit("endOfTime",room);
    }
  }

  // window.onload = resetTimer;
  //-------------------------------------------
  const canvasRef = useRef(null);
  const ctx = useRef(null);

  const setcolor = useRef(colors[0])
  const [mouseDown, setMouseDown] = useState(false);
  const [lastPosition, setPosition] = useState({
    x: 100,
    y: 0
  });
  
  var emitBool = true
  var socketBool = false
  var posCanvasX = 300
  var posCanvasY = 50

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext('2d');
    }
  }, []);

  function draw(x0, y0, x1, y1, emit){
    //console.log(currentDrawingUser);
    //console.log(currentRound);
    if (mouseDown || socketBool) {
      ctx.current.beginPath();
      ctx.current.strokeStyle = setcolor.current;
      ctx.current.lineWidth = 10;
      ctx.current.lineJoin = 'round';
      ctx.current.moveTo(x1-posCanvasX, y1-posCanvasY);
      ctx.current.lineTo(x0-posCanvasX, y0-posCanvasY);
      ctx.current.closePath();
      ctx.current.stroke();
      setPosition({
        x : x0,
        y : y0
      })
      const messageData = {
        x1 : x1,
        y1 : y1,
        x0 : x0,
        y0 : y0,
        color : setcolor.current,
        room : room
      }
      if (emit){
        socket.emit("sendCanvasInfo", messageData);
      }
    }
  
  }


  const clear = () => {
    ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height)
  }

  const onMouseDown = (e) => {
    setPosition({
      x: e.pageX,
      y: e.pageY
    })
    setMouseDown(true)
  }

  const onMouseUp = (e) => {
    setMouseDown(false)
  }

  const onMouseMove = (e) => {
    //console.log("blah4")
    if (currentDrawingUser === username  && allowInteraction) {
    draw(e.pageX, e.pageY, lastPosition.x, lastPosition.y, true)
    }
  }


  const voteKick = async () => {
    //console.log("In votekick : chat.js") ;
    if(!Voted){
      socket.emit("votekick",room) ;
      setVoted(true) ;
    }

  } ;

  function keywordchosen(button){
    if(currentDrawingUser === username){

      const keywordData = {
        room: room,
        txt: document.getElementById(button).innerHTML,
      };
      socket.emit("send_keyword", keywordData);

      startTimer();
      socket.emit("startTimerAll",room);
    }
    if (document.getElementById("bt1")){
    document.getElementById("bt1").style.display = "none";
    document.getElementById("bt2").style.display = "none";
    document.getElementById("bt3").style.display = "none";
    document.getElementById(button).style.display = "block";
    }
  }

  socket.on("secret_keyword", (secret) => {
    //setGuesschat(data.guess);
    setCurkey(secret);

  });

  socket.on('keywords', ({keydata,currUser}) => {

    //console.log(currentDrawingUser);
    //console.log(username);
    //console.log(keydata);
    
    if (currUser.username === username) {
    if (document.getElementById("bt1")){
    document.getElementById("bt1").style.display = "block";
    document.getElementById("bt2").style.display = "block";
    document.getElementById("bt3").style.display = "block";
    document.getElementById("bt1").innerText = keydata.x_word;
    document.getElementById("bt2").innerText = keydata.y_word;
    document.getElementById("bt3").innerText = keydata.z_word;
    }
    if (document.getElementById("votek")) {
      document.getElementById("votek").style.display = "none";
    }
    }
    else {
      if (document.getElementById("bt1")){
      document.getElementById("bt1").style.display = "none";
      document.getElementById("bt2").style.display = "none";
      document.getElementById("bt3").style.display = "none";
      }
      if (document.getElementById("votek")) {
        document.getElementById("votek").style.display = "block";
      }
    }
    
      //console.log(word_1r);
  });
  

   //-------------------------------------------
  const sendMessage = async () => {
    if (currentDrawingUser !== username && allowInteraction) {
    if (currentMessage !== "" && !guesschat) {
      //resetTimer();
      if(currentMessage === curkey){
        setGuesschat(true);
      }
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        guess : guess,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      //setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      console.log(endGameLeaderboard);
      // if (document.getElementById("room-name")){
      // document.getElementById("room-name").innerText = "blash";
      // }
    });

    socket.on('roundInfo',({currentUser,currentRound}) => {
      //console.log("userchanged");
      //console.log(intervalTimer)
      if (timeShow !== undefined) {
        //console.log("endtime");
        endTimer();
      }
      setCurrentDrawingUser(currentUser.username);
      
      clear();
      setVoted(false);
      setGuesschat(false);
      setCurrentRound(currentRound);

      if(document.getElementById("currentDrawingUser"))
      {
        document.getElementById("currentRound").innerHTML = currentRound ;
        document.getElementById("currentDrawingUser").innerHTML = currentUser.username;
      }
      
    })
    const gameOver = async () => {
      //console.log(endGameLeaderboard);
      if (document.getElementById("gameend")) {
        document.getElementById("gameend").innerHTML = "Game Over";
      }
      await new Promise(r => setTimeout(r, 5000));
      //socket.emit("finalClearScore",(room));
      setStartGame(false);
      
      
    }
    socket.on("endGame", ({gameDead}) => {
      gameOver();
    });

    socket.on("receiveCanvasInfo", (data) => {

      // setPosition({
      //   x : data.x0,
      //   y : data.y0
      // })
      socketBool = true
      emitBool = false
      console.log(data.color);
      setcolor.current = data.color;
      console.log(setcolor.current);
      draw(data.x1,data.y1,data.x0,data.y0,false);
      emitBool = true
      socketBool = false
    });

    socket.on('roomUsers2', ({ room, users }) => {
      //outputRoomName(room);
      //outputUsers(users);
      //console.log("balh");
      if (document.getElementById("room-name")){
      document.getElementById("room-name").innerText = room;
      document.getElementById("users").innerHTML = "";
      }
      //console.log(users);
      users.forEach((user) => {
            //console.log(user);
            var s1 = user.username;
            var s2 = user.score;
            var temporarr = {s1,s2};
            setEndGameLeaderboard((list) => [...list, temporarr]);
            const li = document.createElement('li');
            li.innerText = user.username +"\t: "+ user.score;
            if (document.getElementById("users")){
              document.getElementById("users").appendChild(li);
            }
          });
    });

    socket.on('gotKicked', () => {
      setShowChat(false) ;
    });

    socket.on("recieveStartTimer" , () => {
      startTimer();
    })

    // socket.on("receive_canvasInfo_finish", (room) => {
    //   contextRef.current.closePath()
    //   setIsDrawing(false)
    // });

    // socket.on("receive_canvasInfo_draw", (data) => {
    //   if (!isDrawing) {
    //     return;
    //   }
      
    //   if (data.posX >= window.innerWidth*3/5 || data.posX <= window.innerWidth*2/5 || data.posY >= window.innerHeight*3/5 || data.posY <= window.innerHeight*2/5) {
    //     contextRef.current.closePath()
    //     setIsDrawing(false)
    //     return;
    //   }
    //   contextRef.current.lineTo(data.posX, data.posY)
    //   contextRef.current.stroke()
  
    // });
  }, [socket]);

  return (
    <div>
      
    <div className="timer">
        <h2>Timer</h2>
      <h2 id="timer"></h2>
      </div>
    <canvas
        style={{
          border: "6px solid #000",
          position: "absolute",
          top : posCanvasY,
    	  left: posCanvasX,
        background: "white"
        }}
	
        width={800}
        height={600}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
      />
      <div className="gameover">
        <h1 id="gameend"></h1>
      </div>
      <br />
      <div className="brush">
      <h2>Current Drawing User</h2>
    
          <h3 id="currentDrawingUser"></h3>
        <h2>Current Round</h2>
        <h3 id="currentRound"></h3>
        <h2> Choose Brush Color </h2>
      <select
        value={setcolor.current}
        onChange={(e) => (setcolor.current = e.target.value)}
      >
        {
          colors.map(
            color => <option key={color} value={color}>{color}</option>
          )
        }
      </select>
      <input id="votek" type="button" onClick={voteKick} value="Votekick"/>
      <div id="keywordpanel">
      <br />
        <button id="bt1" onClick={() =>keywordchosen("bt1")}></button>
        <button id="bt2" onClick={() =>keywordchosen("bt2")}></button>
        <button id="bt3" onClick={() =>keywordchosen("bt3")}></button>
      </div>
      </div>
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      <ul id="users"></ul> 
    </div>
    </div>
  );
}

export default Chat;
