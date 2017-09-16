
var Monies = parseFloat(document.getElementsByClassName('vx_h2 enforceLtr ')[0].innerHTML.split("$")[1]);
var time = (new Date()).getTime();

chrome.storage.sync.get(['monies'], function(monies){
    isEmpty = Object.keys(monies).length === 0 && monies.constructor === Object;
    console.log(Monies);
    if(!isEmpty && Monies){
        chrome.storage.sync.get(['times'], function(times
            if(time - times['times'][times['times'].length - 1] > 2 || monies['monies'][monies['monies'].length - 1] != Monies){
                console.log(monies['monies']);
                console.log(times['times']);
                monies['monies'].push(Monies);
                times['times'].push(time);
                chrome.storage.sync.set({"monies": monies['monies']}, function(){});
                chrome.storage.sync.set({"times": times['times']}, function(){});
                regression = findLineByLeastSquares(times['times'],monies['monies']);
                console.log(regression);

                chrome.storage.sync.set({"regression": regression}, function(){});

            }
        });
    } else if (Monies){
        chrome.storage.sync.set({"monies": [Monies]}, function(){});
        chrome.storage.sync.set({"times": [time]}, function(){});
    }
});

function findLineByLeastSquares(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length === 0) {
        return [ [], [] ];
    }

    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }

    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;

    var result_values_x = [];
    var result_values_y = [];

    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }

    var result_slope = (result_values_y[1] - result_values_y[0]) / (result_values_x[1] - result_values_x[0]);
    var result_y_intercept = result_values_y[0] - (result_slope * result_values_x[0]);

    return [result_slope, result_y_intercept];
}
