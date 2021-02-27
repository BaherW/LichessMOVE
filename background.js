var username
var waitTime
var gameData

function syncVars() {
  chrome.storage.sync.get(["username", "waitTime"], function (results) {
    username = results.username
    waitTime = results.waitTime
    console.log(waitTime)
  })
}

function ourMain() {
  let userColor;
  let currentMoveColor;
  let timer = 0;
  setInterval(() => {
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
        console.log("MOVE IDIOT")
        var audio = new Audio('moveAudios/bahr1.mp4');
        audio.play();
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

setTimeout(syncVars(), 5000)
ourMain();
