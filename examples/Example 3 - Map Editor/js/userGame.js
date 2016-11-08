/**
 * This file is to be manipulated by the users of JIvE
 * to contain the game and the menu logic
 */


var world;
var worldImageManager;
var worldSpriteSheetManager;
var worldSelector;
var worldMapLayer0;

// the name we gave to the html element to add the menu
const menuNameHTML = "hub"


/**
 * This is the main entry point
 */
function main() {

	var dim = calculateSideMenuDimensions()
	world = new World(dim.width, dim.height)
	worldImageManager = world.getImageManager();
	worldSpriteSheetManager = world.getSpriteSheet();

	// drag and drop is now disabled
	//enableDragging()

	initMenus()
	setupWorld()
}


function calculateSideMenuDimensions(){
	
	// set the size of the menu on the side
	var menuSpace = 400; // px
	var screenWidth = document.body.clientWidth
	var screenHeight = document.body.clientHeight

	// locate the position of the menu
	var hub = document.getElementById(menuNameHTML)
	hub.style.right = 0 + "px";
	hub.style.width = menuSpace + "px";
	hub.style.height = 100 + "%";
	hub.style.top = 0 + "px";

	return {
		width: screenWidth - menuSpace - 2, // -2 is just some padding for beauty
		height: screenHeight
	}
}


function setupWorld(){

	// Load the map layers
	var layer0 = new MapLayer()
	layer0.load(g_level0_map, false)
	world.getMap().addLayer(layer0)

	// Load images to the world
	im = world.getImageManager()
	im.load(g_selector_images)

	// put the callback in the last one, otherwise it might not work
	im.load(g_basic_tilesets, function(){

		worldSpriteSheetManager.load("first_tileset", g_first_tileset_frames) 

		worldSelector = world.getSelector()
		var selectorImg = worldImageManager.get("selector")
		worldSelector.setImg(selectorImg)

		worldMapLayer0 = world.getMap().getLayer(0)
		
		// once images have been loaded, start the world
		world.start()
	})
	
	world.on("mousemove", function(e){
		var tiles = world.screen2MapCoords(e)
		if (tiles === -1) return;
		world.getSelector().setSelectorPos(tiles.tileY, tiles.tileX)
	});


	world.on("leftclick", function(e){
		console.log("leftclick!!, selectorValue= " + selectorValue)
		var tiles = world.screen2MapCoords(e)
		if (tiles === -1) return;
		//layer0.setCell(tiles.tileX, tiles.tileY, selectorValue)
		worldMapLayer0.setCell(tiles.tileY, tiles.tileX, selectorValue) 
		// TODO the problem is that the renderer tries to load the picture from the spritesheet. HOWEVER, these pictures are only loaded into the imageManager
	});


}


/**
 * Initialises the side menu
 */
function initMenus(){

	// create a menu and add it to the hub
	var objectMenu = createMainMenu("objectMenu", 0, 0)

	// add the ability to add extra submenus
	var addMenus = createSubMenu(objectMenu, "+");
}


/**
 *  
 */
function createMainMenu(menuName, top, left){

	// make the menu box where we will add items
	var mainMenu = document.createElement('div')
	mainMenu.setAttribute("id", menuName)
	mainMenu.setAttribute('draggable', true)
	mainMenu.className = "menu"
	mainMenu.style.top = top + "px"
	mainMenu.style.left = left + "px"
	//mainMenu.style.cssText = 'position:absolute; background-color:blue; top:100px; left:400px; width:300px; height:100px;';

	// all main menus are added under the hub
	var hub = document.getElementById(menuNameHTML)
	hub.appendChild(mainMenu)

	return mainMenu
}


/**
 *
 */
function createSubMenu(parentMenu, subMenuName){

	var subMenu = document.createElement('button')
	subMenu.setAttribute("id", subMenuName + "-submenu")
	subMenu.className = 'accordion';
	subMenu.innerHTML = subMenuName;

	if (subMenuName !== "+"){

		// allow the submenu to collapse/show
		subMenu.onclick = function(){
			this.classList.toggle("active");
			this.nextElementSibling.classList.toggle("show");
		}
	}else{
		subMenu.onclick = function(){
			addSubMenu(this)
		}
	}
	parentMenu.appendChild(subMenu);

	// the panel is the place where any contents will be added for the submenu
	// IMPORTANT NOTE: the panel is not placed within the button but after it
	// otherwise, it would be collapsed everytime we click it contents!!
	// Thus, add it to 'parentMenu', NOT to 'subMenu'
	var subMenuPanel = document.createElement('div');
	subMenuPanel.setAttribute("id", subMenuName + "-submenu-panel");
	subMenuPanel.className = 'accordion-panel';
	parentMenu.appendChild(subMenuPanel)

	// add the ability to add your own photos using a + image
	// this should be done for every menu except the one that allows you to add
	// extra submenus
	if (subMenuName !== "+")
		addHTML2panel(subMenuPanel, addAddImage());

	var ret = {
		menu: subMenu,
		panel: subMenuPanel
	}

	return ret
}


function addHTML2panel(panel, htmlCode){
	panel.innerHTML += htmlCode;
}


function addImage(path){
	return "<input class='floatedImg' type='image' src='imgs/" + path + "' />"
}


/**
 *  Adds an 'addImage' button, that can be used to load pictures from the pc.
 */
function addAddImage(){
	return 	'<label class="custom-file-upload floatedImg"> <input id="browse" type="file" onchange="previewFiles(this)" multiple> + Add </label>' 
}


/**
 *  Add event listeners for dragging and droping.
 */
function enableDragging(){

	document.body.addEventListener('dragover', function(e){
		e.preventDefault();
	},false); 

	document.body.addEventListener("drop", function(e){
		var menu = document.getElementById(e.srcElement.lastChild.id);
		menu.style.left = e.clientX + "px";
		menu.style.top  = e.clientY + "px";
	}, false);
}


/**
 *  Adds dynamicaly an extra submenu to a menu.
 *  e.g. u might have menu with 'buildings, trees, terrain'
 *  and u might want to add a new submenu called 'UFOs'
 *  this function adds one dynamically
 */
//TODO add a + button to add the menu so we can take the menu to add it to.
function addSubMenu(menu){

	// ask for the name of the new subMenu
	var subMenuName = prompt("Adding a new subMenu. Type its name:", "e.g. trees");
	
	if (subMenuName !== "" && subMenuName !== null){
		this.innerHTML += '<input type="radio" name="radio-item" value="' + subMenuName + '"> ' + subMenuName + '<br>';
		createSubMenu(objectMenu, subMenuName);
	}
}


function imageLoaded(panelName, img, id){

	// load it to the spriteSheet
	var tempFrames = {}
	tempFrames[id] = [0, 0, img.width, img.height, 0, 0]
	worldSpriteSheetManager.load(id, tempFrames) 

	var panel = document.getElementById(panelName)
	addHTML2panel(panel, "<input id='" + id + "' class='floatedImg' type='image' onclick='imageClicked(this)' src='" + img.src + "' />");
}


var selectorValue = 0
function imageClicked(img){
	selectorValue = img.id
	var selectedImg = worldImageManager.get(img.id)
	worldSelector.setImg(selectedImg)
}


/**
 *  function taken from:
 *  https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
 */
function previewFiles(that) {

	var files = that.files
	var panelName = that.parentNode.parentNode.id 
	
	function readAndPreview(file) {

		// Make sure `file.name` matches our extensions criteria
		if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
			var reader = new FileReader();

			reader.addEventListener("load", function () {

				// use JIvE to load images so that it is easy to draw them on the map
				var imgPath = this.result
				worldImageManager.load2MapEditor(file.name, imgPath, panelName, imageLoaded);

				// alternatively you might use something like this: (not suggested)
				//var image = new Image();
				//image.height = 200;
				//image.title = file.name;
				//image.src = this.result;
				//addHTML2panel(panel, "<input class='floatedImg' type='image' src='" + image.src + "' />");

			}, false);

			reader.readAsDataURL(file);
		}

	}

	if (files) {
		[].forEach.call(files, readAndPreview);
	}

}

