const socket = io();

let videoId = "OTAKEz6DGCA";
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
let secondPlayer;
function onYouTubeIframeAPIReady() {
  // player = new YT.Player("player", {
  //   height: "390",
  //   width: "640",
  //   videoId: videoId,
  //   events: {
  //     onReady: onPlayerReady,
  //     onStateChange: onPlayerStateChange
  //   }
  // });
  player = new YT.Player("existing-iframe-example", {});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  // setTimeout(() => {
  //   event.target.playVideo();
  // }, 2000);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    // setTimeout(stopVideo, 6000);
    done = true;
  }
}

function stopVideo() {
  player.stopVideo();
}

const playVideo = function() {
  player.playVideo();
};

const onPlayVideo = function() {
  $("#play").on("click", () => {
    console.log("play");
    player.playVideo();
    const playerData = { state: "play", time: player.getCurrentTime()};
    socket.emit("playerEvent", playerData);
  });
};

const pauseVideo = function() {
  player.pauseVideo();
};

const onPauseVideo = function() {
  $("#stop").on("click", () => {
    console.log("stop");
    player.pauseVideo();
    const playerData = { state: "pause", time: player.getCurrentTime()};
    socket.emit("playerEvent", playerData);
  });
};

const loopProgressBar = function() {
  setInterval(() => {
    const percentageWatched =
      (player.getCurrentTime() / player.getDuration()) * 100;
    $("#square").css("left", `${percentageWatched}%`);
  }, 200);
};

const changePlayTime = function() {
  const progressBar = $("#progress-bar");
  progressBar.on("click", function(event) {
    const offset = event.pageX - $("#progress-line").offset().left;
    console.log(offset);
    //find out the second video should be at relative to the offset
    const newPlayTime = (offset / 640) * player.getDuration();
    player.seekTo(newPlayTime, true);
    const playerData = { state: "change time", time: newPlayTime};
    socket.emit("playerEvent", playerData);
  });
};

// When socket receives play command from server, play the video
const onReceivePlayCommand = function() {
  socket.on("play video", msg => {
    playVideo();
  });
};

// When socket receives pause command from server, pause the video
const onReceivePauseCommand = function() {
  socket.on("pause video", () => {
    pauseVideo();
  });
};

// When socket receives command to change video time, change the video time to the given new time
const onReceiveChangeTimeCommand = function() {
  socket.on("change play time", newPlayTime => {
    player.seekTo(newPlayTime, true);
  });
};

///Use jquery to do form on submit, validate the url, and update the url in this YT player
const loadNewVideo = function() {
  const form = $("#new-video");
  form.on('submit', function(event) {
    event.preventDefault();
    console.log($('#new-url').val());
    const newUrl = $('#new-url').val();
    const frame = $('iframe');
    frame.attr("src", newUrl);
  })
}

$(document).ready(function() {
  onPlayVideo();
  onPauseVideo();
  loopProgressBar();
  changePlayTime();
  onReceivePlayCommand();
  onReceivePauseCommand();
  onReceiveChangeTimeCommand();
  loadNewVideo();
});

/*
  change iframe to be in the page directly instead of loaded by javascript
  create new page to enter url
  on post /new/:url
  do render to /new/:url
  on get /new/:url
  pass url in as template var
  use template var inside the iframe
*/
