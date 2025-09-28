function joinRoom() {
  const link = document.getElementById("youtubeLink").value;
  const videoArea = document.getElementById("videoArea");

  if (link.includes("youtube.com") || link.includes("youtu.be")) {
    videoArea.innerHTML = `
      <iframe width="560" height="315" 
        src="${link.replace("watch?v=", "embed/")}" 
        frameborder="0" allowfullscreen></iframe>`;
  } else {
    alert("Please paste a valid YouTube link");
  }
}
