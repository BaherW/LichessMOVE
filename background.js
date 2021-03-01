var username
var waitTime
var gameData
var audioArray = ["bahr1", "bahr2", "bahr3", "bahr4"]
var lichessOpen = true;

var deactivation = false;
var alreadyOpened = false;

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
            console.log("opened Urls" + openURLS)
            console.log("Instances: " + openedLichessInstances)
        }
    }
    if (openedLichessInstances > 0 && !alreadyOpened) {
        ourMain();
    }
})

chrome.tabs.onRemoved.addListener(function (tabId, changeInfo, tab) {
    console.log(openURLS[tabId])
    if (openURLS[tabId].includes("lichess")) {
        openedLichessInstances--
        openURLS.splice(tabId, 1);
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
    alreadyOpened = true;
    let userColor;
    let currentMoveColor;
    let timer = 0;
    let timing = setInterval(() => {
        if (deactivation) {
            console.log("stop");
            clearInterval(timing);
            alreadyOpened = false;
            deactivation = false;
            return
        }
        syncVars();
        fetchData();
        console.log("fetching")
        if (gameExists()) {
            console.log(username)
            if (gameData.players.white == username) {
                userColor = "white"
            }
            else {
                userColor = "black"
            }

            let moves = (gameData.moves).split(" ")
            let movesLength = moves.length;
            console.warn("Moves length is: " + movesLength)
            if (movesLength % 2 == 0) {
                currentMoveColor = "white"
                console.log("My turn to move")
            }
            else {
                currentMoveColor = "black";
                console.log("This idiots turn to move")
            }

            if (currentMoveColor == userColor) {
                timer++;
                console.log("You are " + userColor)
                console.log("Current move color is " + currentMoveColor)
                console.log("Waiting on your move")
                if (timer == waitTime) {
                    var audio = new Audio(getRandomPath());
                    audio.play();
                }
            }
            else {
                console.log("Waiting on oponnent move")
                timer = 0;
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
    fetch("https://lichess.org/api/user/" + username + "/current-game", {
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