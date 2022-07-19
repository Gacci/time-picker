# time-picker
Time picker module

## How to use it?

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

