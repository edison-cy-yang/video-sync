const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.static("views"));

app.get('/', (req, res) => {
  res.render("index");
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('playerEvent', (msg) => {
    console.log(msg);
    if (msg.state === "play") {
      io.emit('play video', msg);
    } else if (msg.state === "pause") {
      io.emit('pause video', msg);
    } else if (msg.state === "change time") {
      console.log(msg);
      io.emit("change play time", msg.time);
    }    
  });
  socket.on('disconnet', () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log( `server listening at ${PORT}`);
});