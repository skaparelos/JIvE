function main () {

	// hide the main menu and show the game
	var uiMenu = document.getElementById('menu')
	uiMenu.style.display = "none"
	var ui = document.getElementById('ui')
	ui.style.display = "block"

	// start the game	
	init_world()
};

function init_world () {
	var world = new World(0, 0) // (0,0) means full screen
	world.start()
};
