import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {mapRenderer} from './mapRenderer.js';
import {Controller} from './controller.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';
import {Mine} from './mine.js';
import {Navigator} from './navigator.js';
import {Ui} from './ui.js';
import {Worker} from './worker.js';
import {Player} from './player.js';
import {AI} from './ai.js';
import {Wizard} from './wizard.js';
import {SaveGame} from './saveGame.js';
import {Prompter} from './prompter.js';

var Perseus = Perseus || {};
Perseus.graphics = {}

// create the game, and pass it the configuration
Perseus.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var goldText, woodText, fortText, barracksText, towerText, enemyHealthText;
var titlescreen, easyGameButton, loadGameButton, music, newGameButton, hardGameButton, gameName, mute_button, music;
var style = { font: "20px Times New Roman", fill: "#ffffff", align: "center"};

// RESOURCES TEXT OBJECTS
var buttonClick = false;

// GENERAL DECLARATIONS
// var w = 800, h = 600;
// var menuBar, pause_button, saveButton, quitButton, newGameButton, resumeButton, mute_button;
// var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};

function preload() {
    this.load.tilemap('demo', 'assets/tilemaps/map2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('topbar', 'assets/topbar.png');
    this.load.image('gameTiles', 'assets/tilemaps/forestTiles.png');
    this.load.image('tree', 'assets/images/tree.png');
    this.load.image('barracks_human', 'assets/barracks.png');
    this.load.image('barracks_orc', 'assets/barracks_orc.png');
    this.load.image('fort_human', 'assets/fort.png');
    this.load.image('fort_orc', 'assets/fort_orc.png');
    this.load.image('wizardtower_human', 'assets/wizardtower.png');
    this.load.image('wizardtower_orc', 'assets/wizardtower_orc.png');
    this.load.image('archeryrange_human', 'assets/archeryrange.png');
    this.load.image('archeryrange_orc', 'assets/archeryrange_orc.png');
    this.load.image('ui', 'assets/ui/stoneMenu.png');
    this.load.image('archeryrange', 'assets/archeryrange.png');
    this.load.image('hpbar_human', 'assets/healthbar.png');
    this.load.image('hpbar_orc', 'assets/healthbar_orc.png');
    this.load.image('navSquare', 'assets/navSquare.png');
    this.load.spritesheet('command_buttons', 'assets/ui/icons.png', 32, 32);
    Perseus.game.load.spritesheet('mine', 'assets/gold_mine.png', 96, 96);
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
    Perseus.game.load.image('resumeButton', 'assets/images/resumeButton.png');
    Perseus.game.load.image('easyButton', 'assets/images/easyButton.png');
    Perseus.game.load.image('hardButton', 'assets/images/hardButton.png');
    Perseus.game.load.image('titlescreen', 'assets/images/titlescreen.png');
    Perseus.game.load.audio('backgroundMusic', 'assets/audio/GardenParty.mp3');
    Perseus.game.load.image('loadButton', 'assets/images/loadButton.png');
}

function create() 
{
    Perseus.ui = {};
    Perseus.map = this.game.add.tilemap('demo');
    Perseus.controller = new Controller(Perseus);
    Perseus.navigator = new Navigator(Perseus.game, Perseus.map.width, Perseus.map.height, 32);
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    Perseus.map.addTilesetImage('forestTiles', 'gameTiles');
    //create layer
    Perseus.backgroundLayer = Perseus.map.createLayer('backgroundLayer');
    Perseus.dirtLayer = Perseus.map.createLayer('dirtLayer');
    Perseus.collisionLayer = Perseus.map.createLayer('collisionLayer');
    Perseus.rockLayer = Perseus.map.createLayer('rockLayer');
    //resizes the game world to match the layer dimensions
    Perseus.backgroundLayer.resizeWorld();
    //Create an objects array on the game object and add a soldier to it.
    Perseus.objects = [];
    // Create display groups to keep gui on top
    Perseus.gameSprites = Perseus.game.add.group();
    Perseus.gui = Perseus.game.add.group();
  
    // ------------------------------------------------------------------------
    // MAIN MENU FORK  
    Perseus.SaveGame = new SaveGame(Perseus);


    Perseus.prompter = new Prompter(Perseus);
    Perseus.AI = new AI(Perseus);
    Perseus.Player = new Player(Perseus);
    //Perseus.AI.Main();
    //Create resources
    Perseus.mapRenderer = new mapRenderer(Perseus);
    Perseus.mapRenderer.createResources();

    Perseus.ui = new Ui(Perseus);
    Perseus.SaveGame = new SaveGame(Perseus);
    //Perseus.MainMenu = new MainMenu(Perseus);
    //Perseus.ui.StartingScreen();

    // Perseus.objects.push(new Wizard('human', 250, 250, Perseus));
    // Perseus.objects.push(new SwordInfantry('human', 250, 400, Perseus));
    // Perseus.objects.push(new Archer('human', 300, 300, Perseus));

    Perseus.Player.playerWood = 5000;
    Perseus.Player.playerGold = 5000;


    console.log(Perseus.objects);
    console.log(Perseus.resources);
    console.log(Perseus.navigator.navmap);
    startScreen();


}

function update()
{    
    // console.log(Perseus.objects);
    Perseus.controller.update();
    //Call the update function on each game object
    Perseus.objects.forEach(function(obj){
        obj.update();
    });

    Perseus.AI.update();

    Perseus.prompter.update();

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
    Perseus.SaveGame.SaveAIBuildings();
}
function quitGame()
{
    unpause();
}

function newGame()
{
    Perseus.GameState.LoadGame();
}

function startScreen()
{
    if(Perseus.game.paused == false)
    {
        Perseus.game.paused = true;
    }
    
    titlescreen = Perseus.game.add.sprite(400, 300, 'titlescreen');
    titlescreen.scale.setTo(.57, .57);
    titlescreen.anchor.setTo(0.5, 0.5);

    // TITLE
    gameName = Perseus.game.add.text(275, 75, "Perseus", 
    {
    font: 'bold 60pt Times New Roman',
    fill: '#ffffff'});

    //EASY MODE BUTTON
    easyGameButton = Perseus.game.add.sprite(400, 450, 'easyButton');
    easyGameButton.scale.setTo(.57, .57);
    easyGameButton.anchor.setTo(0.5, 0.5);
    easyGameButton.inputEnabled = true;
    easyGameButton.events.onInputUp.add(
    function ()
    {
        if(Perseus.game.paused)
        {
            Perseus.game.paused = false;
        }
        loadGameButton.destroy();
        hardGameButton.destroy();
        easyGameButton.destroy();
        titlescreen.destroy();
        gameName.destroy();
        Perseus.Player.EasyMode();
        Perseus.AI.EasyMode();
    });

    // HARD MODE BUTTON
    hardGameButton = Perseus.game.add.sprite(400, 350, 'hardButton');
    hardGameButton.scale.setTo(.57, .57);
    hardGameButton.anchor.setTo(0.5, 0.5);
    hardGameButton.inputEnabled = true;
    hardGameButton.events.onInputUp.add(
    function ()
    {
        if(Perseus.game.paused)
        {
            Perseus.game.paused = false;
        }
        loadGameButton.kill();
        hardGameButton.destroy();
        easyGameButton.destroy();
        titlescreen.destroy();
        gameName.destroy();
        Perseus.Player.HardMode();
        Perseus.AI.HardMode();
    });

    // LOAD GAME BUTTON
    loadGameButton = Perseus.game.add.sprite(400, 250, 'loadButton');
    loadGameButton.scale.setTo(.57, .57);
    loadGameButton.anchor.setTo(0.5, 0.5);
    loadGameButton.inputEnabled = true;
    loadGameButton.events.onInputUp.add(
    function () 
    {
        if(Perseus.game.paused)
        {
            Perseus.game.paused = false;
        }
        loadGameButton.destroy();
        hardGameButton.destroy();
        easyGameButton.destroy();
        titlescreen.destroy();
        gameName.destroy();
        Perseus.SaveGame.LoadGame();
    });
}


/******************************************************************************/
