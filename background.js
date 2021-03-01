var username
var waitTime
var gameData
var audioArray = ["bahr1", "bahr2", "bahr3", "bahr4"]
var lichessOpen = true;

var deactivation = false;

function syncVars() {
    setInterval(() => {
        chrome.storage.sync.get(["username", "waitTime"], function (results) {
            username = results.username
            waitTime = results.waitTime
        })
    }, 5000);
}


var openURLS = [];
var openedLichessInstances = 0;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url) {
        console.log(changeInfo.url)
        openURLS[tabId] = changeInfo.url;
        if (openURLS[tabId].includes("lichess")) {
            openedLichessInstances++;
            console.log("found")
        }
    }
    if (openedLichessInstances > 0) {
        ourMain();
    }
})

chrome.tabs.onRemoved.addListener(function (tabId, changeInfo, tab) {
    console.log(openURLS[tabId])
    if (openURLS[tabId].includes("lichess")) {
        openedLichessInstances--
        console.log("notFound")
    }
    if (openedLichessInstances == 0) {
        deactivation = true;
    }
})

function isLichessOpen() {
    if (openedLichessInstances == 0) {
        return false;
    }
    return true;
}

function ourMain() {
    let userColor;
    let currentMoveColor;
    let timer = 0;
    let timing = setInterval(() => {
        if (deactivation) {
            console.log("stop");
            clearInterval(timing);
            return
        }
        syncVars();
        fetchData();
        console.log("Fetching")
        if (gameExists()) {
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
                var audio = new Audio(getRandomPath());
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

function getRandomPath() {
    let initial = "moveAudios/"
    let end = ".mp4"
    let name = audioArray[Math.floor(Math.random() * audioArray.length)];

    return (initial + name + end)
}