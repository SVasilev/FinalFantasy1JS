/* global Phaser, World Party */

var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.json('tileData', '../lib/game/config/world/tileData.json');
  game.load.json('partySprites', '../lib/game/config/party/spriteData.json');
  game.load.image('worldmap', './assets/img/game/world/tiledCopyOfWorldMapWithLocations.png');

  game.load.onFileComplete.add(function(progress, fileKey) {
    if (fileKey === 'worldmap') {
      var partySpritesData = game.cache.getJSON('partySprites');
      Object.keys(partySpritesData).forEach(function(key) {
        var spriteData = partySpritesData[key];
        game.load.spritesheet(key, spriteData.location, spriteData.frameWidth, spriteData.frameHeight);
      });
    }
  }, game);
}

function create() {
  var worldSprite = game.add.tileSprite(0, 0, 1280, 720, 'worldmap');
  worldSprite.scale.setTo(4, 4);
  worldSprite.tilePosition.x = 1888;//3990;//1888;
  worldSprite.tilePosition.y = 1408;//3763;//1408;

  var tileData = game.cache.getJSON('tileData');
  this.world = new World(worldSprite, tileData.tiles);

  var spritesData = game.cache.getJSON('partySprites');
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

  this.text  = game.add.text(300, 32, '', { fill: '#ffff00' });
  this.text1 = game.add.text(600, 32, '', { fill: '#ffff00' });
  this.text2 = game.add.text(900, 32, '', { fill: '#ffff00' });
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
  this.text2.text = 'Next encounter steps: ' + this.world.nextEncounterSteps;
}