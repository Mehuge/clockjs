<?php
header("Cache-Control: no-cache, must-revalidate");
header("Content-Type: text/javascript");
$t = $_GET["t"];
list($usec, $sec) = explode(" ", microtime());
$gmt = ((float)$sec * 1000) + (int)((float)$usec * 1000);
?>
Clock.calcAdjust(<?php echo $t - $gmt; ?>);
