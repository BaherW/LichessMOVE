var username
var waitTime
var gameData
var audioArray = ["bahr1", "bahr2", "bahr3", "bahr4"]
var lichessOpen = true;

function syncVars() {
  setInterval(() => {
    chrome.storage.sync.get(["username", "waitTime"], function (results) {
      username = results.username
      waitTime = results.waitTime
    })
  }, 5000);
}

function isLichessOpen() {
  setInterval(() => {
    chrome.windows.getAll({ populate: true }, function (windows) {
      let myReturn = false;
      windows.forEach(function (window) {
        window.tabs.forEach(function (tab) {
          if (tab.url.includes("lichess")) {
            myReturn = true;
          }
        });
      });
      lichessOpen = myReturn;
    });
  }, 10000);
}

function ourMain() {
  let userColor;
  let currentMoveColor;
  let timer = 0;
  setInterval(() => {
    if (lichessOpen) {
      syncVars();
      fetchData();
      console.log("Fetching")
      if (gameExists()) {
        console.log("game exists")
        if (gameData.players.white == username) {
          userColor = "white"
        }
        else {
          userColor = "black"
        }

        let moves = (gameData.moves).split(" ")
        let movesLength = moves.length;
        console.log(movesLength)
        if (movesLength % 2 == 0) {
          currentMoveColor = "white"
        }
        else {
          currentMoveColor = "black";
        }

        if (currentMoveColor === userColor) {
          console.log(timer)
          timer++;
        }
        else {
          timer = 0;
        }
        if (timer == waitTime) {
          console.log("move sound played")
          var audio = new Audio(getRandomPath());
          audio.play();
        }
      }
    }
  }, 1000)
}

function gameExists() {
  if (gameData.status == "started") {
    return true;
  }
  return false;
}

function fetchData() {
  fetch("https://lichess.org/api/user/BahrW/current-game", {
    method: 'GET',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
    .then(response => {
      gameData = response
    })
}

function getRandomPath() {
  let initial = "moveAudios/"
  let end = ".mp4"
  let name = audioArray[Math.floor(Math.random() * audioArray.length)];

  return (initial + name + end)
}

isLichessOpen();
ourMain();
