const music = new Audio("music/1.mp3");

// create Array(singers)

const singers = [
  {
    name: "Eminem",
    description: "I Tell myself that I'm doing alright",
    photo: "url('img/em.jpg')",
    inst: "https://www.instagram.com/eminem",
  },
  {
    name: "50 Cent",
    description: "You can find me in the club, bottle full of bub",
    photo: "url('img/fift.jpg')",
    inst: "https://www.instagram.com/50cent",
  },
  {
    name: "Wiz Khalifa",
    description: "See You Again",
    photo: "url('img/wiz.jpg')",
    inst: "https://www.instagram.com/wizkhalifa",
  },
];

// create Array(songs)

let songs = [
  {
    id: "1",
    songName: `Lose Yourself<br>
        <div class="subtitle">Eminem</div>`,
    poster: "img/1.jpg",
    download: "Eminem - Lose Yourself",
  },
  {
    id: "2",
    songName: `As Like That <br>
        <div class="subtitle">Eminem</div>`,
    poster: "img/2.jpg",
    download: "Eminem - As Like That"
  },
  {
    id: "3",
    songName: `Mockingbird <br>
        <div class="subtitle">Eminem</div>`,
    poster: "img/3.jpg",
    download: "Eminem - Mockingbird",
  },
  {
    id: "4",
    songName: `A Little Bit <br>
        <div class="subtitle">50 Cent</div>`,
    poster: "img/4.jpg",
    download: "50 Cent - A Little Bit"
  },
  {
    id: "5",
    songName: `Candy Shop <br>
        <div class="subtitle">50 Cent</div>`,
    poster: "img/5.jpg",
    download: "50 Cent - Candy Shop"
  },
  {
    id: "6",
    songName: `In Da Club <br>
        <div class="subtitle">50 Cent</div>`,
    poster: "img/6.jpg",
    download: "50 Cent - In Da Club"
  },
  {
    id: "7",
    songName: `See You Again <br>
        <div class="subtitle">Wiz Khalifa</div>`,
    poster: "img/7.jpg",
    download: "Wiz Khalifa - See You Again"
  },
  {
    id: "8",
    songName: `Black And Yellow <br>
        <div class="subtitle">Wiz Khalifa</div>`,
    poster: "img/8.jpg",
    download: "Wiz Khalifa - Black And Yellow"
  },
  {
    id: "9",
    songName: `We Own It <br>
        <div class="subtitle">Wiz Khalifa</div>`,
    poster: "img/9.jpg",
    download: "Wiz Khalifa - We Own It"
  },
];

////////////////////////////////////////////////////////////////////////////////

let menu_song = document.getElementsByClassName("menu_song")[0];
let pop_song_add = document.getElementsByClassName("pop_song")[0];

// create list_items(songs_sidebar)

songs.forEach((element) => {
  let list_item = document.createElement('li')
  list_item.className = "songItem"
  list_item.innerHTML = `
    <span>0${element.id}</span>
    <img src=${element.poster} alt="" />
    <h1>
      ${element.songName}
    </h1>
    <i class="bi playListPlay bi-play-circle-fill" id=${element.id}></i>
  `
  
  if(element.id < 7) {
    menu_song.appendChild(list_item)
  }
})

// create list_items(songs)

songs.forEach((element) => {
  let list_item = document.createElement('li')
  list_item.className = "songItem"
  list_item.innerHTML = `
    <div class="img_play">
      <img src=${element.poster} alt="" />
      <i class="bi playListPlay bi-play-circle-fill" id=${element.id}></i>
    </div>
    <h1>
      ${element.songName}
    </h1>
  `

  if(element.id > 6) {
    pop_song_add.appendChild(list_item)
  }
})

////////////////////////////////////////////////////////////////////////////////

// work with singers

follow = document.getElementById("follow");
follow_button = document.getElementById("follow_button");
name_h1 = document.getElementById("h1_name");
phrase = document.getElementById("phrase");

content = document.querySelector('article');

Array.from(document.getElementsByClassName("artist_item")).forEach(
  (element) => {
    element.addEventListener("click", (e) => {
      name_art = e.target.title;
      switch (name_art) {
        case "Eminem":
          singer = singers.find(item => item.name == name_art);
          content.style.background = singer.photo;
          follow.href = singer.inst;
          follow_button.removeAttribute("hidden");
          name_h1.innerHTML = `${singer.name}`;
          phrase.innerHTML = `${singer.description}`;
          break;
    
        case "50 Cent":
          singer = singers.find(item => item.name == name_art);
          content.style.background = singer.photo;
          follow.href = singer.inst;
          follow_button.removeAttribute("hidden");
          name_h1.innerHTML = `${singer.name}`;
          phrase.innerHTML = `${singer.description}`;
          break;
          
        case "Wiz Khalifa":
          singer = singers.find(item => item.name == name_art);
          content.style.background = singer.photo;
          follow.href = singer.inst;
          follow_button.removeAttribute("hidden");
          name_h1.innerHTML = `${singer.name}`;
          phrase.innerHTML = `${singer.description}`;
          break;          
      }
    });
  }
);

////////////////////////////////////////////////////////////////////////////////

//search data start

let search_results = document.getElementsByClassName("search_results")[0];

songs.forEach((element) => {
  const { id, songName, poster } = element;
  let card = document.createElement("a");
  card.classList.add("card");
  card.href = "#" + id;
  card.innerHTML = `                
  <img src="${poster}" alt="">
  <div class="content">
    ${songName}
  </div>`;
  
  search_results.appendChild(card);
});

let input = document.getElementsByTagName('input')[0];

input.addEventListener('keyup', () => {
  let input_value = input.value.toLocaleUpperCase();
  let items = search_results.getElementsByTagName('a');

  for (let index = 0; index < items.length; index++) {
    let as = items[index].getElementsByClassName('content')[0];
    let text_value = as.textContent || as.innerHTML;

    if (text_value.toUpperCase().indexOf(input_value) > -1) {
      items[index].style.display = "flex";
    } else {
      items[index].style.display = "none";
    }

    if (input_value == 0) {
      search_results.style.display = "none";
    } else {
      search_results.style.display = "";
    }
  }
})

////////////////////////////////////////////////////////////////////////////////

//work with player(play music)

let masterPlay = document.getElementById("masterPlay");
let wave = document.getElementsByClassName("wave")[0];

masterPlay.addEventListener("click", () => {
  if (music.paused || music.currentTime <= 0) {
    music.play();
    masterPlay.classList.remove("bi-play-fill");
    masterPlay.classList.add("bi-pause-fill");
    wave.classList.add("active2");
  } else {
    music.pause();
    masterPlay.classList.add("bi-play-fill");
    masterPlay.classList.remove("bi-pause-fill");
    wave.classList.remove("active2");
  }
});

const makeAllPlays = () => {
  Array.from(document.getElementsByClassName("playListPlay")).forEach(
    (element) => {
      element.classList.add("bi-play-circle-fill");
      element.classList.remove("bi-pause-circle-fill");
    }
  );
};

const makeAllBackgrounds = () => {
  Array.from(document.getElementsByClassName("songItem")).forEach((element) => {
    element.style.background = "rgb(105, 105, 170, 0)";
  });
};

let index = 0;
let poster_master_play = document.getElementById("poster_master_play");
let download_music = document.getElementById("download_music");
let title = document.getElementById("title");

Array.from(document.getElementsByClassName("playListPlay")).forEach(
  (element) => {
    element.addEventListener("click", (e) => {
      index = e.target.id;
      music.src = `music/${index}.mp3`;
      poster_master_play.src = `img/${index}.jpg`;
      music.play();
      masterPlay.classList.remove("bi-play-fill");
      masterPlay.classList.add("bi-pause-fill");
      download_music.href = `music/${index}.mp3`;

      let song_title = songs.filter((ele) => {
        return ele.id == index;
      });

      song_title.forEach((ele) => {
        let { download, songName } = ele;
        title.innerHTML = songName;
        download_music.setAttribute("download", download);
      });

      makeAllBackgrounds();
      Array.from(document.getElementsByClassName("songItem"))[
        `${index - 1}`
      ].style.background = "rgb(105, 105, 170, .1)";
      makeAllPlays();

      e.target.classList.remove("bi-play-circle-fill");
      e.target.classList.add("bi-pause-circle-fill");

      wave.classList.add("active2");
    });
  }
);

//work with player(bar_music)

let currentStart = document.getElementById("currentStart");
let currentEnd = document.getElementById("currentEnd");
let seek = document.getElementById("seek");
let bar2 = document.getElementById("bar2");
let dot = document.getElementsByClassName("dot")[0];

music.addEventListener("timeupdate", () => {
  let music_curr = music.currentTime;
  let music_dur = music.duration;

  let min = Math.floor(music_dur / 60);
  let sec = Math.floor(music_dur % 60);

  if (sec < 10) {
    sec = `0${sec}`;
  }

  currentEnd.innerText = `${min}:${sec}`;

  let min1 = Math.floor(music_curr / 60);
  let sec1 = Math.floor(music_curr % 60);

  if (sec1 < 10) {
    sec1 = `0${sec1}`;
  }

  currentStart.innerText = `${min1}:${sec1}`;

  let progressBar = parseInt((music.currentTime / music.duration) * 100);
  seek.value = progressBar;
  let seekbar = seek.value;
  bar2.style.width = `${seekbar}%`;
  dot.style.left = `${seekbar}%`;
});

seek.addEventListener("change", () => {
  music.currentTime = (seek.value * music.duration) / 100;
});

//work with player(bar_volume)

let vol_icon = document.getElementById("vol_icon");
let vol = document.getElementById("vol");
let vol_dot = document.getElementById("vol_dot");
let vol_bar = document.getElementsByClassName("vol_bar")[0];

vol.addEventListener("change", () => {
  if (vol.value == 0) {
    vol_icon.classList.remove("bi-volume-down-fill");
    vol_icon.classList.add("bi-volume-mute-fill");
    vol_icon.classList.remove("bi-volume-up-fill");
  }
  if (vol.value > 0) {
    vol_icon.classList.add("bi-volume-down-fill");
    vol_icon.classList.remove("bi-volume-mute-fill");
    vol_icon.classList.remove("bi-volume-up-fill");
  }
  if (vol.value > 50) {
    vol_icon.classList.remove("bi-volume-down-fill");
    vol_icon.classList.remove("bi-volume-mute-fill");
    vol_icon.classList.add("bi-volume-up-fill");
  }

  let vol_a = vol.value;
  vol_bar.style.width = `${vol_a}%`;
  vol_dot.style.left = `${vol_a}%`;
  music.volume = vol_a / 100;
});

//work with player(back and next buttons)

let back = document.getElementById("back");
let next = document.getElementById("next");

back.addEventListener("click", () => {
  console.log("asd")
  index -= 1;
  if (index < 1) {
    index = Array.from(document.getElementsByClassName("songItem")).length;
  }
  music.src = `music/${index}.mp3`;
  poster_master_play.src = `img/${index}.jpg`;
  music.play();
  masterPlay.classList.remove("bi-play-fill");
  masterPlay.classList.add("bi-pause-fill");

  let song_title = songs.filter((ele) => {
    return ele.id == index;
  });

  song_title.forEach((ele) => {
    let { songName } = ele;
    title.innerHTML = songName;
  });

  makeAllBackgrounds();
  Array.from(document.getElementsByClassName("songItem"))[
    `${index - 1}`
  ].style.background = "rgb(105, 105, 170, .1)";
  makeAllPlays();

  e = Array.from(document.getElementsByClassName("bi playListPlay bi-play-circle-fill"))[
    `${index - 1}`  
  ]

  e.classList.remove("bi-play-circle-fill");
  e.classList.add("bi-pause-circle-fill");

  wave.classList.add("active2");
});

next.addEventListener("click", () => {
  index++;
  console.log("asd")
  if (index > Array.from(document.getElementsByClassName("songItem")).length) {
    index = 1;
  }
  music.src = `music/${index}.mp3`;
  poster_master_play.src = `img/${index}.jpg`;
  music.play();
  masterPlay.classList.remove("bi-play-fill");
  masterPlay.classList.add("bi-pause-fill");

  let song_title = songs.filter((ele) => {
    return ele.id == index;
  });

  song_title.forEach((ele) => {
    let { songName } = ele;
    title.innerHTML = songName;
  });

  makeAllBackgrounds();
  Array.from(document.getElementsByClassName("songItem"))[
    `${index - 1}`
  ].style.background = "rgb(105, 105, 170, .1)";
  makeAllPlays();

  e = Array.from(document.getElementsByClassName("bi playListPlay bi-play-circle-fill"))[
    `${index - 1}`  
  ]

  e.classList.remove("bi-play-circle-fill");
  e.classList.add("bi-pause-circle-fill");

  wave.classList.add("active2");
});

////////////////////////////////////////////////////////////////////////////////

//work with arrows(songs and singers)

let pop_song_left = document.getElementById("pop_song_left");
let pop_song_right = document.getElementById("pop_song_right");
let pop_song = document.getElementsByClassName("pop_song")[0];

pop_song_left.addEventListener("click", () => {
  pop_song.scrollLeft -= 330;
});

pop_song_right.addEventListener("click", () => {
  pop_song.scrollLeft += 330;
});

let pop_art_left = document.getElementById("pop_art_left");
let pop_art_right = document.getElementById("pop_art_right");
let item = document.getElementsByClassName("artist_item")[0];

pop_art_left.addEventListener("click", () => {
  item.scrollLeft -= 330;
});

pop_art_right.addEventListener("click", () => {
  item.scrollLeft += 330;
});

////////////////////////////////////////////////////////////////////////////////

//random, repeat and simple play

let shuffle = document.getElementsByClassName("shuffle")[0];

shuffle.addEventListener("click", () => {
  let a = shuffle.innerHTML;

  switch (a) {
    case "next":
      shuffle.classList.add("bi-arrow-repeat");
      shuffle.classList.remove("bi-music-note-beamed");
      shuffle.classList.remove("bi-shuffle");
      shuffle.innerHTML = "repeat";
      break;

    case "repeat":
      shuffle.classList.remove("bi-arrow-repeat");
      shuffle.classList.remove("bi-music-note-beamed");
      shuffle.classList.add("bi-shuffle");
      shuffle.innerHTML = "random";
      break;

    case "random":
      shuffle.classList.remove("bi-arrow-repeat");
      shuffle.classList.add("bi-music-note-beamed");
      shuffle.classList.remove("bi-shuffle");
      shuffle.innerHTML = "next";
      break;
  }
});

const next_music = () => {
  index++;
  if (index > Array.from(document.getElementsByClassName("songItem")).length) {
    index = 1;
  }
  music.src = `music/${index}.mp3`;
  poster_master_play.src = `img/${index}.jpg`;
  music.play();
  masterPlay.classList.remove("bi-play-fill");
  masterPlay.classList.add("bi-pause-fill");

  let song_title = songs.filter((ele) => {
    return ele.id == index;
  });

  song_title.forEach((ele) => {
    let { songName } = ele;
    title.innerHTML = songName;
  });

  makeAllBackgrounds();
  Array.from(document.getElementsByClassName("songItem"))[
    `${index - 1}`
  ].style.background = "rgb(105, 105, 170, .1)";
  makeAllPlays();

  e = Array.from(document.getElementsByClassName("bi playListPlay bi-play-circle-fill"))[
    `${index - 1}`  
  ]

  e.classList.remove("bi-play-circle-fill");
  e.classList.add("bi-pause-circle-fill");

  wave.classList.add("active2");
};

const repeat_music = () => {
  index;
  music.src = `music/${index}.mp3`;
  poster_master_play.src = `img/${index}.jpg`;
  music.play();
  masterPlay.classList.remove("bi-play-fill");
  masterPlay.classList.add("bi-pause-fill");

  let song_title = songs.filter((ele) => {
    return ele.id == index;
  });

  song_title.forEach((ele) => {
    let { songName } = ele;
    title.innerHTML = songName;
  });

  makeAllBackgrounds();
  Array.from(document.getElementsByClassName("songItem"))[
    `${index - 1}`
  ].style.background = "rgb(105, 105, 170, .1)";
  makeAllPlays();

  e = Array.from(document.getElementsByClassName("bi playListPlay bi-play-circle-fill"))[
    `${index - 1}`  
  ]

  e.classList.remove("bi-play-circle-fill");
  e.classList.add("bi-pause-circle-fill");

  wave.classList.add("active2");
};

const random_music = () => {
  if (index == songs.length) {
    index = 1;
  } else {
    index = Math.floor(Math.random() * songs.length + 1);
  }
  music.src = `music/${index}.mp3`;
  poster_master_play.src = `img/${index}.jpg`;
  music.play();
  masterPlay.classList.remove("bi-play-fill");
  masterPlay.classList.add("bi-pause-fill");

  let song_title = songs.filter((ele) => {
    return ele.id == index;
  });

  song_title.forEach((ele) => {
    let { songName } = ele;
    title.innerHTML = songName;
  });

  makeAllBackgrounds();
  Array.from(document.getElementsByClassName("songItem"))[
    `${index - 1}`
  ].style.background = "rgb(105, 105, 170, .1)";
  makeAllPlays();

  e = Array.from(document.getElementsByClassName("bi playListPlay bi-play-circle-fill"))[
    `${index - 1}`  
  ]

  e.classList.remove("bi-play-circle-fill");
  e.classList.add("bi-pause-circle-fill");

  wave.classList.add("active2");
};

music.addEventListener("ended", () => {
  let b = shuffle.innerHTML;

  switch (b) {
    case "repeat":
      repeat_music();
      break;

    case "next":
      next_music();
      break;

    case "random":
      random_music();
      break;
  }
});

