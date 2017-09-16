var getDate = function(callback) {
  var code = document.getSelection().toString().replace(",","");
  var target = -1;
  if (code.charAt(0) == "$" && code.slice(1) == parseFloat(code.slice(1)) && parseFloat(code.slice(1)) >= 0)
      target = parseFloat(code.slice(1));
  else if (code == parseFloat(code) && parseFloat(code) >= 0)
    target = parseFloat(code);

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
        callback("Hey, you're losing money, please don't buy stuff.");
      }

      else if (monies['monies'][monies['monies'].length - 1] >= target)
        callback("Hey you have enough money for this");

      else if (target_date == todays_date)
        callback("Hey you can buy this today");

      else if (target_date == todays_date.slice(0, 9) + ((parseInt(todays_date.slice(9)) + 1).toString()))
        callback("Hey you can buy this tomorrow");

      else
        callback("At this rate, you'll be able to get this by " + target_local_time.toISOString().slice(0, 10));
      });
    });
  }

}

var tooltipDOM = document.createElement('div');
tooltipDOM.setAttribute('class', 'tooltip');
document.body.appendChild(tooltipDOM);

document.addEventListener('mouseup', function (e) {
  var code = window.getSelection().toString().replace(",","");
  if ((code.length > 0 && code.charAt(0) == "$" && code.slice(1) == parseFloat(code.slice(1)) && parseFloat(code.slice(1)) >= 0)
  || (code.length > 0 && code == parseFloat(code) && parseFloat(code) >= 0)) {
          getDate(function(str){
             renderTooltip(e.clientX, e.clientY,str);
          });
  }
}, false);


document.addEventListener('mousedown', function (e) {
tooltipDOM.innerHTML = '<span class="tooltiptext" style="visibility: hidden"></span>';
}, false);


function renderTooltip(mouseX, mouseY, selection) {
  console.log(selection);
  tooltipDOM.innerHTML = '<span class="tooltiptext" style="visibility: visible">' + selection + '</span>';
  console.log(tooltipDOM.innerHTML);
  tooltipDOM.style.top = mouseY + 'px';
  tooltipDOM.style.left = mouseX + 'px';
}
