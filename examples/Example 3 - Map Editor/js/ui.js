var activeTab = null;

function showTab(evt, tabName) {

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    activeTab = tabName;

    if(tabName == "Assets")
        showAllAssets();
}


function showAllEntities(){
    for (var bo in BasicObject.worldObjects){

    }
}


function showAllAssets(){
    var imgs = worldImageManager.getImages();
    for (var i in imgs){
        attachImage("flexitem1", imgs[i], i);
    }

}


/**
 * Calculates the size of the menu and the map editor.
 * @returns {{width: number, height: number}}
 */
function calculateSideMenuDimensions(){

    // set the size of the menu on the side
    var menuSpace = 400;
    var screenWidth = document.body.clientWidth;
    var screenHeight = document.body.clientHeight;

    // locate the position of the menu
    var hub = document.getElementById(menuNameHTML);
    hub.style.left = 0 + "px";
    hub.style.width = 100 + "%";
    hub.style.height = 250 + "px";
    hub.style.bottom = 0 + "px";

    return {
        width: screenWidth ,//- menuSpace - 2,
        height: screenHeight - 250 - 2
    }
}



/**
 * Used to load an image using the 'browse' button.
 *
 * function taken from:
 * https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
 *
 */
function previewFiles(that) {

    var files = that.files;

    function readAndPreview(file) {

        // Make sure `file.name` matches our extensions criteria
        if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
            var reader = new FileReader();

            reader.addEventListener("load", function () {

                // use JIvE to load images so it is easy to draw them on the map
                var imgPath = this.result;

                //remove the filename extension
                var fileName = file.name.replace(/\.[^/.]+$/, "");
                worldImageManager.load2MapEditor(fileName, imgPath, imageLoaded);

            }, false);
            reader.readAsDataURL(file);
        }
    }

    if (files) {
        [].forEach.call(files, readAndPreview);
    }
}



/**
 * Callback function that is called once an image uploaded by the user has been
 * loaded. It makes the uploaded image availabe to the user in the menu at the
 * bottom
 *
 * @param img -
 * @param fileName -
 */
function imageLoaded(img, fileName) {

    if (fileName === undefined || fileName == "") {
        console.log("An image doesn't have a name. Error!");
    }

    // load it to the spriteSheet
    var tempFrames = {};
    tempFrames[fileName] = [0, 0, img.width, img.height, 0, 0];
    worldSpriteSheetManager.load(fileName, tempFrames);

    // create a new basic object with the file name as identifier
    new BasicObject(fileName);

    // show the loaded image to the user by injecting it in the HTML code.
    attachImage("flexitem1", img, fileName)

}


function attachImage(elementId, img, fileName){

    var panel = document.getElementById(elementId);
    if (panel.innerHTML.includes("your images"))
        panel.innerHTML = "<input id='" + fileName + "' class='floatedImg' " +
            "type='image' style='max-width:150px; max-height:150px;' " +
            "onclick='imageClicked(this)' src='" + img.src + "'/>";
    else {
        // += instead of =
        panel.innerHTML += "<input id='" + fileName + "' class='floatedImg' " +
            "type='image' style='max-width:150px; max-height:150px;' " +
            "onclick='imageClicked(this)' src='" + img.src + "'/>";
    }
}


