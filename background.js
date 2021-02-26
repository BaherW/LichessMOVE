chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });
  });

chrome.storage.sync.get(["username"], function(items){
    var username = items;
    console.log(items)
});
chrome.storage.sync.get(["waitTime"], function(items){
    var waitTime = items;
    console.log(items)
});



