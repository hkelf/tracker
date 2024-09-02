Installation

* Clone the project in ~/.tracker folder
* In your ~/.bashrc add:
```
function tracker() {
    node ~/.tracker/tracker.js "[Path to your home]\\.tracker\\tracker-log" $1 $2 $3
}
```

Then
```
source ~/.bashrc
```


```
    tracker start [task] # Starts a task
    tracker stop [task] # Stops a task
    tracker stop-all [task] # Stops all tasks
    tracker status [state] # List all tasks or tasks by state (start / stop)
    tracker report # List time spent by task gathered by weeks
    tracker add [task] [minutes] # Add minutes to a task
```
