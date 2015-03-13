Implements a clock and countdown timer API that uses an NTP server to compensate for inaccurate client clocks so regardless of how out a client's clock is, this API will still show the correct time.

Example Usage:

```
  <script src="http://clock.sorcerer.co.uk/clock.js"></script>
  <script>
    (function(global) {
      (new Clock()).ready(function(clock) {
        clock.createEvent(Clock.makeTime(2014,12,25,00,00,00,-8), function(e) {
          // e.now (adjusted time now) as ms since epoch
          // e.when (event time, as a string)
          // e.diff (time in ms between now and the event)
          // e.countdown (countdown expressed as days, hours, minutes, seconds and ms)
          console.log(JSON.stringify(e.countdown));
        });
        clock.createClock(function(e) {
          console.log(e.now);
        })
      });
    })(window);
  </script>
```