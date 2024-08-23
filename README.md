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

That's all.

```
    tracker start [task] # Starts a task
    tracker stop [task] # Stops a task
    tracker ls [state] # List all tasks or tasks by state (start / stop)
    tracker add-min [task] [minutes] # Add minutes to a task
    tracker add-hours [task] [hours] # Add hours to a task
```
