/* global Phaser, World Party utils $ */

// Load our utils
$.ajaxSetup({ async: false });
$.getScript('../lib/game/utils.js', function(utils) { eval(utils); });
$.ajaxSetup({ async: true });

utils.require('../lib/game/classes/World.js');
utils.require('../lib/game/classes/Party.js');

var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
  var partySpritesData = utils.loadJSON('../lib/game/config/party/spriteData.json');

  game.load.image('worldmap', './assets/img/game/world/tiledCopyOfWorldMapWithLocations.png');
  for (var sprite in partySpritesData) {
    var spriteData = partySpritesData[sprite];
    game.load.spritesheet(sprite, spriteData.location, spriteData.frameWidth, spriteData.frameHeight);
  }
}

function create() {
  var worldSprite = game.add.tileSprite(0, 0, 1280, 720, 'worldmap');
  worldSprite.scale.setTo(4, 4);
  worldSprite.tilePosition.x = 1888;//3990;//1888;
  worldSprite.tilePosition.y = 1408;//3763;//1408;

  var tileData = utils.loadJSON('../lib/game/config/world/tileData.json');
  this.world = new World(worldSprite, tileData.tiles);

  var spritesData = utils.loadJSON('../lib/game/config/party/spriteData.json');
  var partySprites = {};
  ['walk', 'boat'].forEach(function(spriteKey) {
    partySprites[spriteKey] = game.add.sprite(game.width / 2, game.height / 2 - 35, spriteKey);
    partySprites[spriteKey].visible = false;
    // Attach config property to the current Phaser sprite.
    partySprites[spriteKey].config = spritesData[spriteKey];
  });

  var walkSpriteScale = partySprites['walk'].config.scale;
  partySprites['walk'].visible = true;
  partySprites['walk'].scale.setTo(walkSpriteScale.x, walkSpriteScale.y);

  var cursors = game.input.keyboard.createCursorKeys();
  this.party = new Party(partySprites, cursors, this.world);

  game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
  game.scale.refresh();

  this.text  = game.add.text(300, 32, '', { fill: '#ffffff' });
  this.text1 = game.add.text(600, 32, '', { fill: '#ffffff' });
}

function update() {
  this.party.move(1.5);
}

function render () {
  game.debug.inputInfo(32, 32);
  var coords = this.world.calculatePlayerCooordinates();
  this.text.text = 'PositionX: ' + coords.x +
        '\nPositionY: ' + coords.y +
        '\nTileType: ' + this.party.currentTile() +
        '\nRightType: ' + this.party.nextTile('right') +
        '\nLeftType: ' + this.party.nextTile('left') +
        '\nUpType: ' + this.party.nextTile('up') +
        '\nDownType: ' + this.party.nextTile('down');

  this.text1.text = 'PositionX: ' + this.world.sprite.tilePosition.x +
        '\nPositionY: ' + this.world.sprite.tilePosition.y;

}