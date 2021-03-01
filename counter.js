var username;
var waitTime;

console.log("We in here baby")

function saveChanges() {
    // Get a value saved in a form.
    let localusername = document.getElementById("username").value;
    let localwaitTime = document.getElementById("waitTime").value;
    // Check that there's some code there.
    if (localusername) {
        chrome.storage.sync.set({ 'username': localusername}, function () {
        });
        document.getElementById("username").placeholder = localusername;
    }
    if (localwaitTime) {
        chrome.storage.sync.set({'waitTime': localwaitTime }, function () {
        });
        document.getElementById("waitTime").placeholder = localwaitTime;
    }   
}

document.getElementById("saveButton").addEventListener("click", function () { saveChanges() })

function syncVars() {
    chrome.storage.sync.get(["username", "waitTime"], function (results) {
        username = results.username
        waitTime = results.waitTime
        if (username == undefined) {
            username = ""
        }
        if (waitTime == undefined) {
            document.getElementById("waitTime").placeholder = "Seconds";
            return;
        }
        document.getElementById("username").placeholder = username;
        document.getElementById("waitTime").placeholder = waitTime;
    })
}

syncVars()