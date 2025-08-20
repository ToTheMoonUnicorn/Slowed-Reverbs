const fileInput = document.getElementById("fileInput");
const fileNameDisplay = document.getElementById("fileName");
const audioElement = document.getElementById("audio");

fileInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    fileNameDisplay.textContent = "Fichier : " + file.name;
    const objectURL = URL.createObjectURL(file);
    audioElement.src = objectURL;
    audioElement.play();
  }
});

// Contrôles simples (placeholder - à relier aux effets audio avancés)
document.getElementById("speedControl").addEventListener("input", (e) => {
  audioElement.playbackRate = e.target.value;
});

// Reverse, slowed, reverb nécessiteraient Web Audio API, non codé complet ici
