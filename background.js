chrome.storage.sync.get(["username"], function(items){
    var username = items;
    console.log(items)
});
chrome.storage.sync.get(["waitTime"], function(items){
    var waitTime = items;
    console.log(items)
});



