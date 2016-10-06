var keys = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  W: 87,
  S: 83,
  A: 65,
  D: 68,
  P: 80,
  B: 66,
  ESC: 27,
  PLUS_firefox: 61, // firefox has different codes
  MINUS_firefox: 173,
  PLUS: 187,
  MINUS: 189
}

var keycode = new Array(0, 0, 0, 0, 2) // up, down, left, right, zoom_level

/**
 * key is pressed
 */
window.addEventListener('keydown', function (e) {
	/* Map scrolling */
  if (e.keyCode == keys.UP || e.keyCode == keys.W) keycode[0] = 1
  if (e.keyCode == keys.DOWN || e.keyCode == keys.S) keycode[1] = 1
  if (e.keyCode == keys.LEFT || e.keyCode == keys.A) keycode[2] = 1
  if (e.keyCode == keys.RIGHT || e.keyCode == keys.D) keycode[3] = 1

	/* zoom level */
  if (e.keyCode == keys.MINUS || e.keyCode == keys.MINUS_firefox) { // zoom out
    if (keycode[4] < 4)
      keycode[4]++
  }
  if (e.keyCode == keys.PLUS || e.keyCode == keys.PLUS_firefox) { // zoom in
    if (keycode[4] > 1)
      keycode[4]--
  }

	/* Game pause & resume */
  if (e.keyCode == keys.P) {
    if (g_running == true)
      g_running = false
    else
			g_running = true
  }
})

/* key no longer pressed */
window.addEventListener('keyup', function (e) {
  if (e.keyCode == keys.UP || e.keyCode == keys.W) keycode[0] = 0
  if (e.keyCode == keys.DOWN || e.keyCode == keys.S) keycode[1] = 0
  if (e.keyCode == keys.LEFT || e.keyCode == keys.A) keycode[2] = 0
  if (e.keyCode == keys.RIGHT || e.keyCode == keys.D) keycode[3] = 0
})

/* right click */
window.addEventListener('contextmenu', function (e) {
  e.preventDefault()
    // console.log("right click!");
  return false
}, false)

/* mouse click */
var _mouse_click_event
window.addEventListener('mousedown', function (e) {
  switch (e.which) {
    case 1: // left click
      _mouse_click_event = e
      break
    case 2: /* middle mouse button */ break
    case 3: /* right click has its own event listener (see above) */ break
		/* default:   alert("You have a strange mouse!"); */
  }
})

var _mouse_scroll_event
window.addEventListener('mousemove', function (e) {
  _mouse_scroll_event = e
})

/* on window resize: */
var _screen_resize = false
window.addEventListener('resize', function () {
  _screen_resize = true
})
