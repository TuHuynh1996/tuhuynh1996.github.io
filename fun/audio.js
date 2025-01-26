var vAudio = document.getElementById("divAudio");
var hasInit = false;
function playMusic() {
  if (!hasInit) {
    hasInit = true;
    vAudio.play();
  }
}