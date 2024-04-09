// Screen recording logic
// Using getDisplayMedia and MediaRecorder

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const preview = document.getElementById('preview');

let stream;
let recorder;
let chunks = [];

startButton.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    preview.srcObject = stream;
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'screen-recording.webm';
      a.click();
      chunks = [];
    };

    recorder.start();
    startButton.disabled = true;
    stopButton.disabled = false;
  } catch (error) {
    console.error('Error accessing screen:', error);
  }
});

stopButton.addEventListener('click', () => {
  recorder.stop();
  stream.getTracks().forEach((track) => track.stop());
  preview.srcObject = null;
  startButton.disabled = false;
  stopButton.disabled = true;
});

screenshotButton.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = preview.videoWidth;
  canvas.height = preview.videoHeight;
  context.drawImage(preview, 0, 0, canvas.width, canvas.height);
  const screenshotUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = screenshotUrl;
  a.download = 'screenshot.png';
  a.click();
});