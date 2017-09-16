function addRow() {
   "use strict";

    var table = document.getElementById("table");
    var row= document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");

    td1.innerHTML = document.getElementById("name").value;
    td2.innerHTML  = document.getElementById("price").value;
    getDate(function(str){td3.innerHTML = str;});

    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);

    table.children[0].appendChild(row);
}

var getDate = function(callback) {
  var code = document.getSelection().toString().replace(",","");
  var target = -1;
  if (code.charAt(0) == "$" && code.slice(1) == parseFloat(code.slice(1)) && parseFloat(code.slice(1)) >= 0)
      target = parseFloat(code.slice(1));
  else if (code == parseFloat(code) && parseFloat(code) >= 0)
    target = parseFloat(code);
  else
    callback("Invalid");

  if (target >= 0) {
    chrome.storage.sync.get(['regression'], function(regression){
      var slope = regression['regression'][0];
      var y_intercept = regression['regression'][1];

      var target_time = new Date(Math.round((target - y_intercept) / slope));
      var current_time = new Date((new Date()).getTime());

      var offset = new Date().getTimezoneOffset();
      var target_local_time = new Date(target_time - 60000 * offset);
      var current_local_time = new Date(((new Date()).getTime() - 60000 * offset))

      var todays_date = current_local_time.toISOString().slice(0,10);
      var target_date = target_local_time.toISOString().slice(0,10);

      chrome.storage.sync.get(['monies'], function(monies){
      if(slope < 0){
        callback("You're losing money");
      }

      else if (monies['monies'][monies['monies'].length - 1] >= target)
        callback("Now!");

      else if (target_date == todays_date)
        callback("Today!");

      else if (target_date == todays_date.slice(0, 9) + ((parseInt(todays_date.slice(9)) + 1).toString()))
        callback("Tomorrow!");

      else
        callback(target_local_time.toISOString().slice(0, 10));
      });
    });
}}

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('link');
    getSlope(function(str){
      document.getElementById('slope').innerHTML = str;
      console.log(str);
    })
    link.addEventListener('click', function() {
        addRow();
    });
});

function getSlope(callback) {
  chrome.storage.sync.get(['regression'], function(regression){
    var slope = regression['regression'][0];
    if(slope < 0)
      callback("You are losing $" + slope * 86400000 + " per day.");
    else if(slope == 0)
      callback("You are breaking even.");
    else
      callback("You are making $" + slope* 86400000 + " per day.");
  });
}

document.addEventListener('DOMContentLoaded2', function() {
    var link = document.getElementById('link2');
    console.log(link1)
    link.addEventListener('click', function() {
        getSlope();
    });
});
