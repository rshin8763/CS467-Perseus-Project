import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {mapRenderer} from './mapRenderer.js';
import {Controller} from './controller.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';
import {Navigator} from './navigator.js';
import {Ui} from './ui.js';
import {Worker} from './worker.js';
import {Player} from './player.js';
import {AI} from './ai.js';
import {Wizard} from './wizard.js';

var Perseus = Perseus || {};
Perseus.graphics = {}
// var Main = function() {};

// create the game, and pass it the configuration
Perseus.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var goldText, woodText, fortText, barracksText, towerText, enemyHealthText;

// RESOURCES TEXT OBJECTS
var buttonClick = false;

// GENERAL DECLARATIONS
var w = 800, h = 600;
var menuBar, pause_button, saveButton, quitButton, newGameButton, resumeButton, mute_button;
var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};

function preload() {
    this.load.tilemap('demo', 'assets/tilemaps/map2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('topbar', 'assets/topbar.png');
    // TODO insert tiles url and creators
    this.load.image('gameTiles', 'assets/tilemaps/forestTiles.png');
    this.load.image('tree', 'assets/images/tree.png');
    this.load.image('barracks', 'assets/barracks.png');
    this.load.image('fort', 'assets/fort.png');
    this.load.image('wizardtower', 'assets/wizardtower.png');
    this.load.image('ui', 'assets/ui/stoneMenu.png');
    this.load.image('hpbar', 'assets/healthbar.png');
    this.load.image('navSquare', 'assets/navSquare.png');
    

    this.load.spritesheet('command_buttons', 'assets/ui/icons.png', 32, 32);

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
    Perseus.game.load.image('fireball_right', 'assets/fireball_right.png');
    Perseus.game.load.image('fireball_left', 'assets/fireball_left.png');

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
    Perseus.navigator = new Navigator(Perseus.game, Perseus.map.x, Perseus.map.y, 32);

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    Perseus.map.addTilesetImage('forestTiles', 'gameTiles');

    //create layer
    Perseus.backgroundLayer= Perseus.map.createLayer('backgroundLayer');

    // Sets collision  TODO make it work with unit's move method.
    // This uses phaser arcade physics. Since we are using a navmap,

    //resizes the game world to match the layer dimensions
    Perseus.backgroundLayer.resizeWorld();

    //Create an objects array on the game object and add a soldier to it.
    Perseus.objects = [];

    // Create display groups to keep gui on top
    // TODO add to gameSprites group for every sprite creation call in the unit files
    Perseus.gameSprites = Perseus.game.add.group();
    Perseus.uiGraphics = Perseus.game.add.group();
    Perseus.gui = Perseus.game.add.group();

    //console.log(Perseus.navigator.navmap);

    // Perseus.navigator.markOccupied(300, 300);

    //Create resources
    Perseus.mapRenderer = new mapRenderer(Perseus);
    Perseus.mapRenderer.createResources();
    Perseus.ui = new Ui(Perseus);

    // ------------------------------------------------------------------------
    // PLAYER
    Perseus.Player = new Player(Perseus);
    Perseus.Player.Main();

    // ------------------------------------------------------------------------
    // AI
    Perseus.AI = new AI(Perseus);
    Perseus.AI.Main();

    // ------------------------------------------------------------------------
    // PAUSE BUTTON, MUTE, MENU
    // MENU BAR
    menuBar = Perseus.game.add.sprite(0, 0, 'menuBar'); // ADD MENU
    menuBar.fixedToCamera = true;
    menuBar.cameraOffset.setTo(0, 0);
    menuBar.fixedToCamera = true;
    menuBar.cameraOffset.setTo(0, 0);

    // GOLD COUNT DISPLAY
    goldText = Perseus.game.add.text(0, 0, 'Gold: ' + Perseus.Player.playerGold,
     style);
    goldText.fixedToCamera = true;
    goldText.cameraOffset.setTo(70, 3);
    
    // WOOD COUNT DISPLAY
    woodText = Perseus.game.add.text(0, 0, 'Wood: ' + Perseus.Player.playerWood,
     style);
    woodText.fixedToCamera = true;
    woodText.cameraOffset.setTo(170, 3);

    // FORT COUNT DISPLAY
    fortText = Perseus.game.add.text(0, 0,
     'Forts: ' + Perseus.Player.playerForts, style);
    fortText.fixedToCamera = true;
    fortText.cameraOffset.setTo(270, 3);

    // BARRACKS COUNT DISPLAY
    barracksText = Perseus.game.add.text(0, 0,
     'Barracks: ' + Perseus.Player.playerBarracks, style);
    barracksText.fixedToCamera = true;
    barracksText.cameraOffset.setTo(370, 3);

    // TOWER COUNT DISPLAY
    towerText = Perseus.game.add.text(0, 0,
     'Towers: ' + Perseus.Player.playerTowers, style);
    towerText.fixedToCamera = true;
    towerText.cameraOffset.setTo(470, 3);

    enemyHealthText = Perseus.game.add.text(0, 0, 
            'Enemy Buildings: ' + Perseus.AI.AIAllBuildings, style);
        enemyHealthText.fixedToCamera = true;
        enemyHealthText.cameraOffset.setTo(570, 3);

    var pause_button = Perseus.game.add.text(0, 0, 'Pause', style);
    pause_button.fixedToCamera = true;
    pause_button.cameraOffset.setTo(10, 3);
    pause_button.inputEnabled = true;
    pause_button.events.onInputUp.add(pause);

    mute_button = Perseus.game.add.text(0, 0, 'Mute', style);
    mute_button.fixedToCamera = true;
    mute_button.cameraOffset.setTo(755, 3);
    mute_button.inputEnabled = true;
    mute_button.events.onInputUp.add(muteMusic);

    Perseus.objects.push(new Wizard('human', 250, 250, Perseus));
    Perseus.objects.push(new SwordInfantry('human', 250, 400, Perseus));
    Perseus.objects.push(new Archer('human', 300, 300, Perseus));


    console.log(Perseus.objects);
}

function update()
{    
    Perseus.controller.update();
    //Call the update function on each game object
    Perseus.objects.forEach(function(obj){
        obj.update();
    });
    //Perseus.AI.update();

    
    // for(let i = 0; i < 80; i++)
    // {
    //     for(let j = 0; j < 80; j++)
    //     {
    //         if(Perseus.navigator.navmap[i][j] == 1)
    //         {
    //             let coords = Perseus.navigator.getCoords(i, j);
    //             Perseus.game.add.sprite(coords.x, coords.y, 'navSquare');
    //         }

    //     }
    // }

}

/******************************************************************************/

function pause()
{
    // ERROR HANDLING: GAME IS ALREADY PAUSED
    if (Perseus.game.paused) 
    {
        // do nothing
    }
    else
    {
        // ADD MENU BUTTONS
        resumeButton = Perseus.game.add.button(Perseus.game.camera.x + 20, Perseus.game.camera.y + 50,
                'resumeButton', unpause, this, 2, 1, 0);

        saveButton = Perseus.game.add.button(Perseus.game.camera.x + 300, Perseus.game.camera.y + 160,
                'saveButton', saveGame, this, 2, 1, 0);

        quitButton = Perseus.game.add.button(Perseus.game.camera.x + 300, Perseus.game.camera.y + 268,
                'quitButton', quitGame, this, 2, 1, 0);

        newGameButton = Perseus.game.add.button(Perseus.game.camera.x + 300, Perseus.game.camera.y + 376,
                'newGameButton', newGame, this, 2, 1, 0);
        Perseus.game.paused = true;
    }
    
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

}

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

function saveGame()
{
    unpause();
}
function quitGame()
{
    unpause();
}

function newGame()
{
    unpause();
}

Perseus.updateText = function (type)
{
    if(type == 'wood')
    {
        woodText = 'Wood: ' + Perseus.Player.playerWood;
    }
    else if (type == 'gold') 
    {
        goldText.text = 'Gold: ' + Perseus.Player.playerGold;
    }
    else if (type == 'fort')
    {
        fortText.text = 'Forts: ' + Perseus.Player.playerForts;
    }
    else if (type == 'barracks')
    {
        barracksText.text = 'Barracks: ' + Perseus.Player.playerBarracks;
    }
    else if (type == 'tower')
    {
        towerText.text = 'Tower: ' + Perseus.Player.playerTowers;
    }
    else if (type == 'enemy')
    {
        enemyHealthText = 'Enemy Buildings: ' + Perseus.AI.AIAllBuildings;
    }
    else
    {
        console.log("You tried to update a UI text and failed.");
    }
};

/******************************************************************************/


// Perseus.game.state.add('Main', Main);
// Perseus.game.state.add('Boot', Boot);bvg
// Perseus.game.state.add('MainMenu', MainMenu);
// Perseus.game.state.start('Boot');

