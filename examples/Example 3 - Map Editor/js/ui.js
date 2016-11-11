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



/**
 * Initialises the side menu
 */
function initMenus(){

	addExport2TilesetBtn()
	addExport2JSONBtn()

	// create a menu and add it to the hub
	var objectMenu = createMainMenu("objectMenu", 50, 0) // top, left

	// add the ability to add extra submenus
	var addMenus = createSubMenu(objectMenu, "+");

}


/**
 * This is the main menu where you can add submenus that will contain your tiles 
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
 *	This function adds a button which allows the user to export the tileset
 */ 
function addExport2TilesetBtn(){
	
	var exportBtn = document.createElement('button')
	exportBtn.innerHTML = "Export Tileset to console"
	exportBtn.setAttribute("id", "exporttileset")
	exportBtn.style.top = 0 + "px";
	exportBtn.style.right =  0 + "px";
	exportBtn.style.width = 100 + "px";
	exportBtn.style.height = 50 + "px";

	exportBtn.onclick = function(){
		worldImageManager.exportImages()
	}

	var hub = document.getElementById(menuNameHTML)
	hub.appendChild(exportBtn)
}


function addExport2JSONBtn(){

	var exportBtn = document.createElement('button')
	exportBtn.innerHTML = "Export map to JSON"
	exportBtn.setAttribute("id", "exportjson")
	exportBtn.style.top = 0 + "px";
	exportBtn.style.left =  100 + "px";
	exportBtn.style.width = 100 + "px";
	exportBtn.style.height = 50 + "px";

	exportBtn.onclick = function(){
		world.getMap().exportToJSON()
	}

	var hub = document.getElementById(menuNameHTML)
	hub.appendChild(exportBtn)
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


/**
 *	Adds some html to a given panel
 */ 
function addHTML2panel(panel, htmlCode){
	panel.innerHTML += htmlCode;
}


/**
 *	Adds an image that the user loaded to the appropriate submenu
 */
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


/**
 *  Adds dynamicaly an extra submenu to a menu.
 *  e.g. u might have menu with 'buildings, trees, terrain'
 *  and u might want to add a new submenu called 'UFOs'
 *  this function adds one dynamically
 */
//TODO add a + button to add the menu so we can take the menu to add it to.
function addSubMenu(menu){

	// ask for the name of the new subMenu
	var subMenuName = prompt("Adding a new subMenu. Type its name:", "e.g. buildings");
	
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

