var username;
var waitTime;
var gameData;


chrome.storage.sync.get(["username"], function (items) {
    username = items;
    console.log(items)
});
chrome.storage.sync.get(["waitTime"], function (items) {
    waitTime = items;
    console.log(items)
});


function saveChanges() {
    // Get a value saved in a form.
    var username = document.getElementById("username").value;
    var waitTime = document.getElementById("waitTime").value;
    // Check that there's some code there.
    if (!username || !waitTime) {
        message('Error: No value specified');
        return;
    }
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({ 'username': username, 'waitTime': waitTime }, function () {
    });
}

document.getElementById("saveButton").addEventListener("click", function () { saveChanges() })

function main() {
    var userColor;
    var currentMoveColor;
    var timer = 0;
    setInterval(() => {
        fetchData();

        if (gameExists()) {
            if (gameData.players.white == username) {
              userColor = "white"
            }
            else {
              userColor = "black"
            }

            let moves = (gameData.moves).split(" ")
            let movesLength = moves.Length;
            if (movesLength % 2 == 0) {
                currentMoveColor = "white"
            }
            else {
                currentMoveColor = "black";
            }



            if (currentMoveColor === userColor) {
                timer++;
            }
            else {
                timer = 0;
            }
            if (timer == waitTime) {
                console.log("move idiot")
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
            console.log(response)
        })

}