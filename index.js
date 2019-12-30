const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render("search_video");
});

app.get('/videos/:videoId', (req, res) => {
  const videoId = req.params.videoId;
  console.log(videoId);
  const templateVars = { videoURL: `https://www.youtube.com/embed/${videoId}?enablejsapi=1` };
  res.render('video_show', templateVars);
});

app.post('/loadVideo', (req, res) => {
  console.log(req.body.url);
  const url = req.body.url;
  //extract video id from the whole Url
  rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const videoId = url.match(rx)[1];
  res.redirect(`/videos/${videoId}`);
})

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