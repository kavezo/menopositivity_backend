// args: one of the lower arrays, # of hours
function triggerFunction(trigger_array, event_lag){
    var idx = Math.ceil(event_lag)-1
    if (event_lag==0) return 1
    if (idx < 0 || idx >= trigger_array.length) return 0
    return trigger_array[idx][1];
}


function updateScore(trigger, event){  
    event_lag = event.time - trigger.time;
    trigger_array = trigger.function;
    score = triggerFunction(trigger_array, event_lag);

    trigger.score_average += score;
}

// for trigger in cache

// for each trigger, look for an event in its window
// if there are more than one, we want to choose the first one


/* hardcoded trigger functions.  The first column is the upper bound hours,
   the second column is the score*/ 

var alc_array = [  
    [1,   1], 
    [2, 0.8],
    [3, 0.6],
    [4, 0.4],
    [5, 0.4]
];

var caffeine_array = [  
    [1,   1], 
    [2, 0.9],
    [3, 0.85],
    [4, 0.6],
    [5, 0.5],
    [6, 0.4]
];

var sugar_array = [
    [1, 1],
    [2,.7]
];
var stress_array = [
    [1, 1],
    [2,.7]
];
var nicotine_array = [
    [1, 1],
    [2, 0.7],
    [3, 0.5]
];

var default_array =  [1, 1];

var typedict = {
    'Alcohol': alc_array,
    'Caffeine': caffeine_array,
    'Sugar': sugar_array,
    'Stress': stress_array,
    'Nicotine': nicotine_array
}

console.log(triggerFunction(alc_array, 59));