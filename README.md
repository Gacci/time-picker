# time-picker
Time picker module


## Basic usage

```
<input type="text" class="time-picker">


<link type="text/css" rel="stylesheet" href="css/time-picker.css">
<script type="text/javascript" src="js/time-picker.js"></script>


<script type="text/javascript">
document.addEventListener('DOMContentLoaded', function(e) {
	let time = new TimePicker(document.querySelector('.time-picker'), {
		position: 'auto', // auto | left | right
		notation: 'ampm', // ampm | 24hrs
		onBeforeOpen: function() {
			console.log('TimePickerEvent.onBeforeOpen');
		},
		onAfterOpen: function() {
			console.log('TimePickerEvent.onAfterOpen');
		},
		onBeforeClose: function() {
			console.log('TimePickerEvent.onBeforeClose');
		},
		onAfterClose: function() {
			console.log('TimePickerEvent.onAfterClose');
		},
		onValueConfirmed: function(time) {
			console.log('TimePickerEvent.onValueConfirmed', time);
		},
		onValueChange: function(now, then) {
			console.log('TimePickerEvent.onValueChage', now, then);
		}
	});
	
	console.log(time);
});
</script>
```


![time-picker screenshot](https://github.com/Gacci/time-picker/blob/master/screenshots/Screenshot%202022-07-19%20131412.png)


### onBeforeOpen
event emited before time picker opens (is visible)

### onAfterOpen
event emitted after time picker has opened (is hidden)

### onBeforeClose
event emitted before time picker is closed

### onAfterClose
event emitted after time picker has closed

### onValueConfirmed
event emitted when user clicks OK button

### onValueChanged
event emitted when value (time) selected has changed from previous
