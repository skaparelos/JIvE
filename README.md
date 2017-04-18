# JIvE
A Javascript Isometric Game Engine (JIvE)

Written using VanillaJS in ECMAScript 6

## Map Editor
Check an example loaded map [here](https://skaparelos.github.io/JIvE/src%20v2/jive.html).

Use the left plus to load isometric images from examples/Example 3 Map Editor/imgs, and the layer plus button to add layers.

## Tutorials
Make sure to visit the Github [Wiki](https://github.com/skaparelos/JIvE/wiki) to see [tutorials](https://github.com/skaparelos/JIvE/wiki/Tutorials) on how to use JIvE.

## Currently Supported:
- map scroll
- tile selection
- use tiles of any size
- load maps from tiled (to some extent)
- zoom in, zoom out
- add layers of maps
- add images
- main menu and in-game menu using CSS and DOM

## How to use it

 1. Download it
 2. Edit the configure.js file to load your map, the images, etc..
 3. Write your code in the userGame.js

## Example 1: Loading a basic map
TODO

Before building anything I should briefly explain how the API works and how you should approach the isometric game.
A game map (e.g. like the age of empires map) consists of many layers. The first layer is the background, where we only draw the background tiles, while layer1 might consist of anything that does not move (e.g. trees, rocks, buildings, stone, rivers, etc.). Finally, layer2 might consist of the sprites (e.g units such as archers, horses, cars, etc..)


## Screenshots
Current:
![alt tag](https://raw.githubusercontent.com/skaparelos/JIvE/gh-pages/src/imgs/screenshot_v2.png)



