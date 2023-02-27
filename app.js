const videoPlayer = document.getElementById('video-player');
const audioContext = new AudioContext();
const mediaSource = audioContext.createMediaElementSource(videoPlayer);
const analyser = audioContext.createAnalyser();
mediaSource.connect(analyser);
analyser.connect(audioContext.destination);

const THRESHOLD = -50; // adjust this value to set the silence threshold
let isSilent = false;
let lastNonSilentTime = 0;

videoPlayer.addEventListener('timeupdate', () => {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
  if (avg < THRESHOLD) {
    if (!isSilent) {
      isSilent = true;
      lastNonSilentTime = videoPlayer.currentTime;
    }
  } else {
    isSilent = false;
  }

  if (isSilent && videoPlayer.currentTime - lastNonSilentTime >= 1) {
    videoPlayer.currentTime = lastNonSilentTime + 1;
  }
});
