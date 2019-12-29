  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'OTAKEz6DGCA',
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
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
    $('#play').on('click', () => {
      console.log("play");
      player.playVideo();
    });
  };

  const pauseVideo = function() {
    $('#stop').on('click', () => {
      console.log("stop");
      player.pauseVideo();
    });
  };

  const loopProgressBar = function() {
    setInterval(() => {
      const percentageWatched = player.getCurrentTime() / player.getDuration() * 100;
      $('#square').css("left", `${percentageWatched}%`);
    }, 200);
  }

  const changePlayTime = function() {
    const progressBar = $('#progress-bar');
    progressBar.on('click', function(event) {
      const offset = event.pageX - $('#progress-line').offset().left;
      console.log(offset);
      //find out the second video should be at relative to the offset
      const newPlayTime = offset / 640 * player.getDuration();
      player.seekTo(newPlayTime, true);
    });
  };

  const socket = io();
  console.log("after socket");

  $(document).ready(function() {
    playVideo();
    pauseVideo();
    loopProgressBar();
    changePlayTime();
  })