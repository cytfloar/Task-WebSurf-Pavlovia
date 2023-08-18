var container = document.getElementById("container");
var resizeListeners = [];
var keyListeners = [];

window.addEventListener("keydown", (e) => {
  for (var i in keyListeners) {
    keyListeners[i](e);
  }
})

function newElement(createDOM, settings = {}) {
  const {x = 0.0, y = 0.0, isVideo = false} = settings;
  var w = document.body.clientWidth;
  var h = document.body.clientHeight;

  const DOM = createDOM();
  DOM.style.position = "absolute";
  if (settings.style) Object.assign(DOM.style, settings.style)
  container.appendChild(DOM);

  function adjustSize() {
    DOM.style.left = Math.round(w * (x / 2 + 0.5) - DOM.offsetWidth / 2) + "px";
    DOM.style.top = Math.round(h * (y / 2 + 0.5) - DOM.offsetHeight / 2) + "px";
  }

  adjustSize();
  DOM.addEventListener("load", adjustSize);
  if (isVideo) {
    DOM.addEventListener("canplay", adjustSize);
    DOM.load();
    DOM.play();
  }

  var resizeListener = (e) => {
    console.log("window changed");
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    adjustSize();
  }

  resizeListeners.push(resizeListener);
  window.addEventListener("resize", resizeListener);
} 

function newInstruction(text, settings = {}) {
  newElement(() => {
    const textDOM = document.createElement("div");
    textDOM.innerHTML = text;

    Object.assign(textDOM.style, {
      color: "black",
      fontFamily: "Arial",
      fontSize: "4vh",
      whiteSpace: "pre-wrap",
      textAlign: "center",
      width: "60%"
    });

    return textDOM;
  }, settings);
}

function newImage(image, settings = {}) {
  var imageDOM;
  newElement(() => {
    imageDOM = new Image();
    imageDOM.src = image;
    return imageDOM;
  }, settings);
  return imageDOM;
}

function newVideo(video, settings = {}) {
  var videoDOM;
  settings.isVideo = true;
  newElement(() => {
    videoDOM = document.createElement("video");
    // videoDOM.src = video;
    videoDOM.autoplay = true;
    videoDOM.innerHTML = `<source src="${video}" type="video/mp4">`;
    if (settings.width && settings.height) {
      videoDOM.width = settings.width;
      videoDOM.height = settings.height;
    }
    return videoDOM;
  }, settings);
  return videoDOM;
}

function newProgressBar(seconds, settings = {}) {
  var progress;
  newElement(() => {
    const DOM = document.createElement("div");
    progress = document.createElement("div");
    progress.classList.add("zero-width");
    DOM.appendChild(progress);

    Object.assign(DOM.style, {
      height: "10vh",
      width: "40%",
      border: "1px solid",
      borderColor: "white"
    });

    Object.assign(progress.style, {
      backgroundColor: "white",
      height: "100%",
      border: "1px solid",
      borderColor: "white",
      transitionDuration: `${seconds}s`
    });
    return DOM;
  }, settings);
  return () => {
    progress.classList.toggle("zero-width");
    progress.classList.toggle("full-width");
  }
}

function newRatingScale(howmany, settings = {}) {
  var tr;
  newElement(() => {
    const DOM = document.createElement("div");
    const table = document.createElement("table");
    tr = document.createElement("tr");
    const numbers = document.createElement("div");
    DOM.appendChild(table);
    DOM.appendChild(numbers);
    table.appendChild(tr);
    var td = [];
    for (var i = 0; i < howmany; ++ i) {
      if (i < howmany - 1) tr.appendChild(document.createElement("td"));
      var number = document.createElement("div")
      numbers.appendChild(number);
      number.innerHTML = i + 1;
      number.style.fontSize = "5vh";
    };
    DOM.style.width = "30%";
    Object.assign(numbers.style, {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "space-between"
    });
    Object.assign(table.style, {
      height: "15px",
      width: "100%"
    });

    return DOM;
  }, settings);
  return async function () {
    var reaction = await KeyPress(Array.from({length: howmany}, (_, index) => String(index + 1)), -1, "key")
    var key = reaction.code
    var { left, top } = tr.getBoundingClientRect()
    var { width } = tr.children[0].getBoundingClientRect()
    var arrow = document.createElement("div")
    arrow.innerHTML = "\u25bc"
    Object.assign(arrow.style, {
      position: "absolute",
      left, top,
      fontSize: "5vh",
      color: "blue"
    });
    container.appendChild(arrow)
    arrow.style.left = Math.round(left - arrow.offsetWidth / 2 + width * (key - 1)) + "px";
    arrow.style.top = Math.round(top - arrow.offsetHeight / 2) + "px";
    await Timer(1.0)
    return reaction
  }
}

function clearScreen() {
  container.innerHTML = "";
  for (var i in resizeListeners) {
    window.removeEventListener("resize", resizeListeners[i]);
  }
  resizeListeners = [];
  keyListeners = [];
}

function KeyPress(listens, timeout = -1, type = "default") {
  var initialTime = Date.now();
  return new Promise((resolve) => {
    if (timeout > 0)
      setTimeout(() => resolve({
        reactionTime: timeout,
        code: null
      }), timeout * 1000);
    keyListeners.push((e) => {
      var comparing = type === "default" ? e.code : e.key
      if (comparing === listens || listens.includes(comparing)) {
        var timeElapsed = (Date.now() - initialTime) / 1000;
        resolve({
          reactionTime: timeElapsed,
          code: comparing
        });
      }
    })
  });
}

function VideoEnded(video) {
  return new Promise((resolve) => {
    video.addEventListener("ended", (e) => {
      resolve();
    });
  });
}

function Timer(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time * 1000)
  })
}

async function manyInstructions(list, config) {
  for (var i in list) {
    newInstruction(list[i], config)
    await KeyPress("Space")
    clearScreen()
  }
}

function randint(min, max) {
  return min + Math.floor((max - min + 1) * Math.random());
}

function uniform(min, max) {
  return (max - min) * Math.random() + min;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
