var fs = require("fs");

let currentLogs, names;

init();

if (process.argv[3] == 'start') {
    start(process.argv[4]);
} else if (process.argv[3] == 'stop') {
    stop(process.argv[4]);
} else if (process.argv[3] == 'ls') {
    ls(process.argv[4]);
} else if (process.argv[3] == 'stop-all') {
    stopAll();
} else if (process.argv[3] == 'add-min') {
    addMinutes(process.argv[4], process.argv[5]);
} else if (process.argv[3] == 'add-hours') {
    addHours(process.argv[4], process.argv[5]);
} else {
    console.log("Invalid command.");
    console.log(`
    tracker start [task] # Starts a task
    tracker stop [task] # Stops a task
    tracker ls [state] # List all tasks or tasks by state (start / stop)
    tracker add-min [task] [minutes] # Add minutes to a task
    tracker add-hours [task] [hours] # Add hours to a task
    `)
}

function init() {
    currentLogs = fs
        .readFileSync(process.argv[2], 'utf-8')
        .split('\n')
        .map(line => {
            const split = line.split(','); 
            return {
                event: split[0],
                name: split[1],
                ts: new Number(split[2])
            }
        });

    if (!currentLogs[currentLogs.length -1]["name"]) {
        currentLogs.pop();
    }

    names = [... new Set(currentLogs.map(log => log.name))];
}

function ls(event) {
    for (let i in names) {
        let name = names[i]
        let previousStartTime = null;
        let total = 0;
        let currentStatus = 'stop'

        let nameMaxSize = 5;
        let stateMaxSize = 5;
        let timeMaxSize = 5;

        currentLogs
            .filter(log => log.name === name)
            .forEach(log => {

                if (log.event === 'stop') {
                    if (previousStartTime === null) return;
                    
                    total += log.ts - previousStartTime;
                    previousStartTime = null;
                    currentStatus = log.event;
                } else if (log.event === 'start') {
                    if (previousStartTime !== null) return;
                    previousStartTime = log.ts;
                    currentStatus = log.event;
                } else if (log.event === 'add') {
                    total += log.ts;
                }
            })
        
        if (currentStatus == 'start' && previousStartTime !== null) {
            total += Date.now() - previousStartTime;
        }

        if (!event || event === currentStatus) {
            let displayedStatus = currentStatus;
            let time = msToTime(total);
            let color = "\x1b[0m";

            if (currentStatus === 'start') {
                displayedStatus = 'started';
                color = "\x1b[32m"
            } else if (currentStatus === 'stop') {
                displayedStatus = 'stopped';
                color = "\x1b[90m"
            }

            nameMaxSize = Math.max(name.length, nameMaxSize);
            nameMaxSize = Math.max(name.length, nameMaxSize);

            console.log(color, `${name.padEnd(15)} | ${displayedStatus.padEnd(15)} | ${time.padEnd(15)}`, "\x1b[0m")
        }
    }
}

function start(name) {
    if (isAlready("start", name)) {
        console.log(`${name} already started !`);
        return;
    }
    fs.appendFileSync(process.argv[2], `start,${name},${Date.now()}\n`)
    init();
    ls();
}

function stop(name) {
    console.log("stopping " + name)
    if (!isAlready("start", name)) {
        console.log(`${name} is not started !`);
        return;
    }
    fs.appendFileSync(process.argv[2], `stop,${name},${Date.now()}\n`);
    init();
    ls();
}

function stopAll() {
    console.log(names.filter(name => isAlready("start", name)))

    names.filter(name => isAlready("start", name)).forEach(name => stop(name))
}

function addMinutes(name, number) {
    let minutes = new Number(number);
    if (minutes === NaN) {
        console.log("Invalid value " + number);
        return;
    }

    fs.appendFileSync(process.argv[2], `add,${name},${number * 60 * 1000}\n`)
}


function addHours(name, number) {
    let hours = new Number(number);
    if (hours === NaN) {
        console.log("Invalid value " + hours);
        return;
    }

    fs.appendFileSync(process.argv[2], `add,${name},${hours * 60 * 60 * 1000}\n`)
}

function isAlready(event, name) {
    if (currentLogs.length <= 0) {
        return false;
    }
    
    var last = currentLogs
        .filter(l => l.name === name)
        .slice(-1)
        .pop();

    return !!last && last.event === event;
}

function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days"
  }