import React, {useCallback, useRef, useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Lobby from "./Lobby";

const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");


const colors = [
  "red",
  "green",
  "yellow",
  "black",
  "blue"
]


function Canvas({ socket, username, room, currentDrawingUser }) {

  //-------------------------------------------
  //-------------------------------------------
  

  

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

  // var timer = 45;
  // var intervalTimer;
  // function resetTimer() {
  //   console.log(timer);
  //   intervalTimer = setInterval(startTimer,1000)

  // }

  // const startTimer = () => {
  //   timer = timer - 1;
  //   console.log(timer);
  //   document.getElementById("timer").innerHTML = timer.toString();
  //   if (timer === 0) {
  //     clearInterval(intervalTimer);
  //   }
  // }

  // window.onload = resetTimer;
  //-------------------------------------------
  const canvasRef = useRef(null);
  const ctx = useRef(null);

  const [selectedColor, setSelectedColor] = useState(colors[0]);
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

    if (mouseDown || socketBool) {
      ctx.current.beginPath();
      ctx.current.strokeStyle = selectedColor;
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
        color : selectedColor,
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
    if (currentDrawingUser === username) {
    draw(e.pageX, e.pageY, lastPosition.x, lastPosition.y, true)
    }
  }

  
  

   //-------------------------------------------
  

  useEffect(() => {
    


    socket.on("receiveCanvasInfo", (data) => {

      // setPosition({
      //   x : data.x0,
      //   y : data.y0
      // })
      socketBool = true
      emitBool = false
      setSelectedColor(data.color);
      draw(data.x1,data.y1,data.x0,data.y0,false)
      emitBool = true
      socketBool = false
    });

    

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
    <canvas
        style={{
          border: "6px solid #000",
          position: "absolute",
          top : posCanvasY,
    	  left: posCanvasX
        }}
	
        width={800}
        height={600}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
      />
      <br />
      <div className="brush">
        <h2> Choose Brush Color </h2>
      <select
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
      >
        {
          colors.map(
            color => <option key={color} value={color}>{color}</option>
          )
        }
      </select>
      </div>
    
    </div>
  );
}

export default Canvas;
