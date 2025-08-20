let audioContext, source, buffer, reversed = false;

document.getElementById("fileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const arrayBuffer = await file.arrayBuffer();
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  buffer = await audioContext.decodeAudioData(arrayBuffer);
});

document.getElementById("reverseBtn").addEventListener("click", () => {
  reversed = !reversed;
  document.getElementById("reverseBtn").innerText = "Reverse: " + (reversed ? "ON" : "OFF");
});

document.getElementById("playBtn").addEventListener("click", () => {
  if (!buffer) return;
  source = audioContext.createBufferSource();
  let playbackBuffer = buffer;

  if (reversed) {
    let revBuffer = audioContext.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      revBuffer.getChannelData(i).set(Array.from(buffer.getChannelData(i)).reverse());
    }
    playbackBuffer = revBuffer;
  }

  source.buffer = playbackBuffer;
  source.playbackRate.value = parseFloat(document.getElementById("speed").value);

  const gainNode = audioContext.createGain();
  const convolver = audioContext.createConvolver();

  // Simple reverb: using impulse response
  const decay = parseFloat(document.getElementById("decay").value);
  const length = audioContext.sampleRate * decay;
  const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);
  for (let i = 0; i < 2; i++) {
    const channel = impulse.getChannelData(i);
    for (let j = 0; j < length; j++) {
      channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, decay);
    }
  }
  convolver.buffer = impulse;

  const mix = parseFloat(document.getElementById("mix").value);

  const dry = audioContext.createGain();
  const wet = audioContext.createGain();
  dry.gain.value = 1 - mix;
  wet.gain.value = mix;

  source.connect(dry).connect(gainNode).connect(audioContext.destination);
  source.connect(convolver).connect(wet).connect(gainNode).connect(audioContext.destination);

  source.start();
});

document.getElementById("stopBtn").addEventListener("click", () => {
  if (source) source.stop();
});

// UI update for sliders
document.querySelectorAll("input[type=range]").forEach(slider => {
  slider.addEventListener("input", (e) => {
    const span = document.getElementById(e.target.id + "-value");
    if (e.target.id === "speed") span.innerText = e.target.value + "x";
    else if (e.target.id === "mix") span.innerText = (e.target.value * 100).toFixed(0) + "%";
    else if (e.target.id === "decay") span.innerText = e.target.value + "s";
    else if (e.target.id === "predelay") span.innerText = (e.target.value * 1000).toFixed(0) + "ms";
  });
});
