var username
var waitTime
var gameData
var audioArray = ["bahr1", "bahr2", "bahr3", "oscar1", "oscar2", "oscar3", "oscar4", "oscar5"]
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
        if (typeof openURLS[tabId] === 'undefined' || !openURLS[tabId].includes("lichess")) {
            openURLS[tabId] = changeInfo.url;
            if (openURLS[tabId].includes("lichess")) {
                openedLichessInstances++;
            }
        }
    }
    if (openedLichessInstances > 0 && !alreadyOpened) {
        ourMain();
    }
})

chrome.tabs.onRemoved.addListener(function (tabId, changeInfo, tab) {
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

    let moveError;
    let numMoves = 0;

    let timing = setInterval(() => {
        if (deactivation) {
            clearInterval(timing);
            alreadyOpened = false;
            deactivation = false;
            return
        }
        syncVars();
        fetchData();
        if (gameExists()) {
            moveError = numMoves

            try {
                if (gameData.players.white.user.name == username) {
                    userColor = "white"
                }
                else {
                    userColor = "black"
                }
            }
            catch (error) {
                userColor = "black"
            }

            let moves = (gameData.moves).split(" ");
            numMoves = moves.length;
            
            if (numMoves > 5) {
                numMoves += 1;
            }
            if (moves.length > 5 && moves.length < 9) {
                timer = Infinity;
            }
            
            if (numMoves % 2 == 0 || gameData.moves.length == 0) {
                currentMoveColor = "white";
            }
            else {
                currentMoveColor = "black"
            }
            

            if (currentMoveColor == userColor && (numMoves == moveError)) {
                timer += 0.5;
            }
            else {
                timer = 0
            }
            
            if (timer == waitTime) {
                playAudio();
            }
        }
    }, 500)
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
    }).then(res => {
        if (res.status == 429) {
            setTimeout(62000);
            return
        }
        return res.json();
    })
        .then(response => {
            gameData = response
        })
}

var prevVoice = []
function getRandomPath() {
    let initial = "moveAudios/"
    let end = ".mp3"
    let name = audioArray[Math.floor(Math.random() * audioArray.length)];

    if (prevVoice.length == 4) {
        prevVoice = [];
    }

    while (prevVoice.includes(name)) {
        name = audioArray[Math.floor(Math.random() * audioArray.length)];
    }
    
    prevVoice.push(name);
    return (initial + name + end)
}

function playAudio() {
    var audio = new Audio(getRandomPath());
    audio.play();
}