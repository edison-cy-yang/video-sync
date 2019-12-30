///Use jquery to do form on submit, validate the url, and update the url in this YT player
const loadNewVideo = function() {
  const form = $("#new-video");
  form.on('submit', function(event) {
    event.preventDefault();
    
  });
}

$(document).ready(function() {
  console.log("js loaded");
  // loadNewVideo();
});