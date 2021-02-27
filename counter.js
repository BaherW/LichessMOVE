var username;
var waitTime;

console.log("We in here baby")

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