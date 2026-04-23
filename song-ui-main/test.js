fetch('https://song-api-33pe.onrender.com/david/songs').then(res => res.json()).then(data => {
  data.forEach(song => {
    console.log(song.url, " => ", JSON.stringify(song.url));
  })
});
