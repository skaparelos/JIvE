function main () {
	// init_menu();
	var ui = document.getElementById('ui');
	ui.style.display = "block";
	var uiMenu = document.getElementById('menu');
	uiMenu.style.display = "none";	
	init_world();

	/* code to get which menu button was pressed */
	var ui = document.getElementById('ui');
	ui.addEventListener('mouseup', function(e) {
		console.log(e.target.getAttribute('id'));
		e.target.src = "imgs/house_red.png";
	}, false);

};


function init_menu () {
	// TODO
	// this is the main menu, not the in-game menu
};


function init_world () {
	var world = new World(0, 0) // (0,0) means full screen
	world.start()
};
