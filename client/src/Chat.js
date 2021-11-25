import React, {useCallback, useRef, useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const colors = [
  "red",
  "green",
  "yellow",
  "black",
  "blue"
]

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
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
  var posCanvasX = 200
  var posCanvasY = 100

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext('2d');
    }
  }, []);

  function draw(x0, y0, x1, y1, emit){
    //console.log("blah5")
    if (mouseDown || socketBool) {
      ctx.current.beginPath();
      ctx.current.strokeStyle = selectedColor;
      ctx.current.lineWidth = 10;
      ctx.current.lineJoin = 'round';
      ctx.current.moveTo(x1-posCanvasX, y1-posCanvasY);
      ctx.current.lineTo(x0-posCanvasX, y0-posCanvasY);
      ctx.current.closePath();
      ctx.current.stroke();
      console.log(x1)
      console.log(y1)
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

  const download = async () => {
    const image = canvasRef.current.toDataURL('image/png');
    const blob = await (await fetch(image)).blob();
    const blobURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobURL;
    link.download = "image.png";
    link.click();
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
    draw(e.pageX, e.pageY, lastPosition.x, lastPosition.y, true)
  }

  

   //-------------------------------------------
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("blah")
      setMessageList((list) => [...list, data]);
      
    });

    socket.on("receiveCanvasInfo", (data) => {
      console.log("blah")
      // setPosition({
      //   x : data.x0,
      //   y : data.y0
      // })
      socketBool = true
      emitBool = false
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
	
        width={400}
        height={400}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
      />
      <br />
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
    </div>
    </div>
  );
}

export default Chat;
