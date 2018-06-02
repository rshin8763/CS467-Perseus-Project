import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {mapRenderer} from './mapRenderer.js';
import {Controller} from './controller.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';
import {Navigator} from './navigator.js';
import {Player} from './player.js';
import {AI} from './ai.js';


var Perseus = Perseus || {};
Perseus.graphics = {}
// var Main = function() {};

// create the game, and pass it the configuration
Perseus.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

// RESOURCES TEXT OBJECTS
var buttonClick = false;

// GENERAL DECLARATIONS
var w = 800, h = 600;
var menuBar, pause_button, saveButton, quitButton, newGameButton, resumeButton, mute_button;
var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};


function preload() {
    this.load.tilemap('demo', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('topbar', 'assets/topbar.png');
    // TODO insert tiles url and creators
    this.load.image('gameTiles', 'assets/tilemaps/forestTiles.png');
    this.load.image('tree', 'assets/images/tree.png');
    this.load.image('barracks', 'assets/barracks.png');
    this.load.image('fort', 'assets/fort.png');
    this.load.image('ui', 'assets/ui/stoneMenu.png');

    Perseus.game.load.spritesheet('swordsman_human', 'assets/images/units/swordsman_human.png', 64, 64);
    Perseus.game.load.spritesheet('swordswoman_human', 'assets/images/units/swordswoman_human.png', 64, 64);
    Perseus.game.load.spritesheet('archer_male_human', 'assets/images/units/archer_male_human.png', 64, 64);
    Perseus.game.load.spritesheet('archer_female_human', 'assets/images/units/archer_female_human.png', 64, 64);
    Perseus.game.load.spritesheet('worker_male_human', 'assets/images/units/worker_male_human.png', 64, 64);
    Perseus.game.load.spritesheet('worker_female_human', 'assets/images/units/worker_female_human.png', 64, 64);
    Perseus.game.load.spritesheet('wizard_male_human', 'assets/images/units/wizard_male_human.png', 64, 64);
    Perseus.game.load.spritesheet('wizard_female_human', 'assets/images/units/wizard_female_human.png', 64, 64);
    Perseus.game.load.spritesheet('pikeman_male_human', 'assets/images/units/pikeman_male_human.png', 64, 64);
    Perseus.game.load.spritesheet('pikeman_female_human', 'assets/images/units/pikeman_female_human.png', 64, 64);

    Perseus.game.load.spritesheet('swordsman_orc', 'assets/images/units/swordsman_orc.png', 64, 64);
    Perseus.game.load.spritesheet('swordswoman_orc', 'assets/images/units/swordswoman_orc.png', 64, 64);
    Perseus.game.load.spritesheet('archer_male_orc', 'assets/images/units/archer_male_orc.png', 64, 64);
    Perseus.game.load.spritesheet('archer_female_orc', 'assets/images/units/archer_female_orc.png', 64, 64);
    Perseus.game.load.spritesheet('worker_male_orc', 'assets/images/units/worker_male_orc.png', 64, 64);
    Perseus.game.load.spritesheet('worker_female_orc', 'assets/images/units/worker_female_orc.png', 64, 64);
    Perseus.game.load.spritesheet('wizard_male_orc', 'assets/images/units/wizard_male_orc.png', 64, 64);
    Perseus.game.load.spritesheet('wizard_female_orc', 'assets/images/units/wizard_female_orc.png', 64, 64);
    Perseus.game.load.spritesheet('pikeman_male_orc', 'assets/images/units/pikeman_male_orc.png', 64, 64);
    Perseus.game.load.spritesheet('pikeman_female_orc', 'assets/images/units/pikeman_female_orc.png', 64, 64);
    Perseus.game.load.image('arrow_right', 'assets/arrow_right.png');
    Perseus.game.load.image('arrow_left', 'assets/arrow_left.png');

    // MENU BAR AND BUTTONS
    Perseus.game.load.image('menuBar', 'assets/images/menuBar.png');
    Perseus.game.load.image('saveButton', 'assets/images/saveButton.png');
    Perseus.game.load.image('quitButton', 'assets/images/quitButton.png');
    Perseus.game.load.image('resumeButton', 'assets/images/resumeButton.png');
    Perseus.game.load.image('newGameButton', 'assets/images/newGameButton.png');
}

function create() {

    Perseus.ui = {};
    Perseus.map = this.game.add.tilemap('demo');
    Perseus.controller = new Controller(Perseus);
    Perseus.navigator = new Navigator(Perseus.game, 25, 19, 32);

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    Perseus.map.addTilesetImage('forestTiles', 'gameTiles');

    //create layer
    Perseus.backgroundLayer= Perseus.map.createLayer('backgroundLayer');
    Perseus.collisionLayer = Perseus.map.createLayer('collisionLayer');

    // Sets collision  TODO make it work with unit's move method.
    // This uses phaser arcade physics. Since we are using a navmap,
    // TODO find a way to prarse collision layer tiles into navmap
    Perseus.map.setCollisionByExclusion([], true, Perseus.collisionLayer, true);

    //I added a 800x20 sprite that's just a blue bar
    //let topbar = this.add.sprite(0, 0, 'topbar');
    ////And set it fixed to Camera
    //topbar.fixedToCamera = true;
    // let style = { font: "12px Arial", fill: "#ffffff", align: "center" };
    // this.barText = this.add.text(100, 0, "This number can change each update:", style);
    // this.testText = "This number can change each update:";
    // this.barText.fixedToCamera = true;

    //resizes the game world to match the layer dimensions
    Perseus.backgroundLayer.resizeWorld();

    //Create an objects array on the game object and add a soldier to it.
    Perseus.objects = [];

    Perseus.objects.push(new SwordInfantry('human', 250, 250, Perseus));
    Perseus.objects.push(new SwordInfantry('human', 200, 400, Perseus));
    Perseus.objects.push(new Archer('human', 300, 300, Perseus));

    //Create resources
    Perseus.mapRenderer = new mapRenderer(Perseus);
    Perseus.mapRenderer.createResources();

    // ------------------------------------------------------------------------
    // PLAYER
    Perseus.Player = new Player(Perseus);
    Perseus.Player.Main();

    // ------------------------------------------------------------------------
    // AI
    Perseus.AI = new AI(Perseus);
    Perseus.AI.Main();

    // ------------------------------------------------------------------------
    // Create GUI bar
    let bar = this.add.sprite(0,0,'ui');
    bar.fixedToCamera = true;
    bar.height = 600;
    bar.width =  192;
    Perseus.ui.bar = bar;

    // Create GUI info box
    let infoBox = this.add.graphics();
    Perseus.ui.infoBox = infoBox;
    infoBox.lineStyle(2, 0xFFFFFF, 1);
    infoBox.drawRect(10,410,172,180);
    infoBox.fixedToCamera = true;

    // Create GUI command box
    let commandBox = this.add.graphics();
    Perseus.ui.commandBox = commandBox;
    commandBox.lineStyle(2, 0xFFFFFF, 1);
    commandBox.drawRect(10,210,172, 180);
    commandBox.fixedToCamera = true;

    // ------------------------------------------------------------------------
    // PAUSE BUTTON, MUTE, MENU
    var pause_button = Perseus.game.add.text(0, 0, 'Pause', style);
    pause_button.fixedToCamera = true;
    pause_button.cameraOffset.setTo(10, 0);
    pause_button.inputEnabled = true;
    pause_button.events.onInputUp.add(pause);

    mute_button = Perseus.game.add.text(0, 0, 'Mute', style);
    mute_button.fixedToCamera = true;
    mute_button.cameraOffset.setTo(700, 0);
    mute_button.inputEnabled = true;
    mute_button.events.onInputUp.add(muteMusic);
}


function update(){
    Perseus.controller.update();
    //Call the update function on each game object
    Perseus.objects.forEach(function(obj){
        obj.update();
    });
}

/*****
 ** DESCRIPTION: PAUSES THE GAME STATE
 ** ADDS RESUME, SAVE, QUIT, AND NEW GAME BUTTONS TO THE GAME STATE
 *****/
function pause()
{
    // ADD MENU BUTTONS
    resumeButton = Perseus.game.add.button(Perseus.game.camera.x + 300, Perseus.game.camera.y + 50,
            'resumeButton', unpause, this, 2, 1, 0);

    saveButton = Perseus.game.add.button(Perseus.game.camera.x + 300, Perseus.game.camera.y + 160,
            'saveButton', saveGame, this, 2, 1, 0);

    quitButton = Perseus.game.add.button(Perseus.game.camera.x + 300, Perseus.game.camera.y + 268,
            'quitButton', quitGame, this, 2, 1, 0);

    newGameButton = Perseus.game.add.button(Perseus.game.camera.x + 300, Perseus.game.camera.y + 376,
            'newGameButton', newGame, this, 2, 1, 0);
    Perseus.game.paused = true;
}

/*****
 ** DESCRIPTION: UNPAUSES THE GAME STATE
 ** DESTROYS RESUME, SAVE, QUIT, AND NEW GAME BUTTONS FROM THE GAME STATE
 *****/
function unpause()
{
    if(Perseus.game.paused)
    {
        Perseus.game.paused = false;
        saveButton.destroy();
        quitButton.destroy();
        newGameButton.destroy();
        resumeButton.destroy();
    }
}

/*****
 ** DESCRIPTION: SAVES THE CURRENT GAME STATE
 ** RETURNS NOTHING
 *****/
function saveGame()
{
    Perseus.unpause();
}

/*****
 ** DESCRIPTION: QUITS THE CURRENT GAME STATE
 ** IMMEDIATELY LOADS MAIN MENU
 *****/
function quitGame()
{

    Perseus.unpause();
}

/*****
 ** DESCRIPTION: RESTARTS THE GAME FROM SCRATCH
 ** RETURNS NOTHING
 *****/
function newGame()
{
    Perseus.unpause();
}

function muteMusic()
{
    if(music.mute == true)
    {
        music.mute = false;
    }
    else
    {
        music.mute = true;
    }

};

// Perseus.game.state.add('Main', Main);
// Perseus.game.state.add('Boot', Boot);
// Perseus.game.state.add('MainMenu', MainMenu);
// Perseus.game.state.start('Boot');

