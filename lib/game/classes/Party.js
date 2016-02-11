/* global Character */

function Party(spritesConfig, world, phaserGame) {
  this.sprites = {
    worldMap: this._createSpritesWithAnimations(phaserGame, spritesConfig.worldMap),
    inBattle: this._createSpritesWithAnimations(phaserGame, spritesConfig.inBattle)
  };
  this.world = world;
  this.gil = 500;
  this.location = 'Cornelia';
  this.CHARACTERS_COUNT = 4;
  this.characters = [];
  this.inventory = []; // Array of type Item
  this.vehicles = ['walk', 'boat']; // List of vehicles that the party has.
  this.currentVehicle = 'walk';
  this.spells = [];

  this._init();
}

Party.prototype._createSpritesWithAnimations = function(phaserGame, spritesConfig) {
  var partySprites = {};
  Object.keys(spritesConfig).forEach(function(spriteKey, index) {
    var spriteData = spritesConfig[spriteKey];
    partySprites[spriteKey] = phaserGame.add.sprite(phaserGame.width / 2, phaserGame.height / 2 - 35, spriteKey);
    partySprites[spriteKey].scale.setTo(spriteData.scale.x, spriteData.scale.y);
    partySprites[spriteKey].visible = false;
    // Attach config property to the current Phaser sprite.
    partySprites[spriteKey].config = spriteData;
  });
  return partySprites;
};

Party.prototype._init = function() {
  this.sprites.worldMap['walk'].visible = true;

  // Load animations for each sprite.
  for (var name in this.sprites.worldMap) {
    var animationData = this.sprites.worldMap[name].config.animation;
    for (var direction in animationData) {
      this.sprites.worldMap[name].animations.add(direction, animationData[direction], 10, true);
    }
  }

  ['warrior', 'thief', 'whiteMage', 'blackMage'].forEach(function(role) {
    this.characters.push(new Character(this.sprites.inBattle[role], role));
  }, this);

  this.FORBIDDEN_TILES = {
    'walk': ['sea', 'mountain'],
    'boat': ['grass', 'forest', 'mountain', 'desert', 'cold'],
    'canue': ['grass', 'forest', 'mountain', 'desert', 'cold'],
    'ship': []
  };
};

// Returns the tile type on the <left|right|up|down> side of the party.
// This is only for development for now.
Party.prototype.nextTile = function(direction) {
  var world = this.world;
  var adjustment = { 'right': 0, 'left': -1, 'up': -1, 'down': 0 };
  var coordinates = world.calculatePlayerCooordinates();

  if (direction === 'right' || direction === 'left') {
    return world.tileTypes[world.tiles[coordinates.y][coordinates.x + adjustment[direction]]];
  }
  return world.tileTypes[world.tiles[coordinates.y + adjustment[direction]][coordinates.x]];
};

// Returns the last type of the tile on which we were.
Party.prototype.previousTile = function(direction, pixels) {
  this.moveWorld(direction, -pixels);
  var currentTile = this.currentTile();
  this.moveWorld(direction, pixels);
  return currentTile;
};

// Returns the type of the tile on which the party stands at the moment.
Party.prototype.currentTile = function() {
  var world = this.world;
  var coordinates = world.calculatePlayerCooordinates();
  return world.tileTypes[world.tiles[coordinates.y][coordinates.x]];
};

Party.prototype.changeVehicle = function(vehicle) {
  if (this.vehicles.indexOf(vehicle) !== -1) {
    this.sprites.worldMap[this.currentVehicle].visible = false;
    this.currentVehicle = vehicle;
    this.sprites.worldMap[vehicle].visible = true;
  }
};

Party.prototype.moveWorld = function(direction, pixels, onBattleCallback) {
  var adjustment = { 'right': -1, 'left': 1, 'up': 1, 'down': -1 };
  var axis = { 'right': 'x', 'left': 'x', 'up': 'y', 'down': 'y' };
  this.world.sprite.tilePosition[axis[direction]] += pixels * adjustment[direction];
  this.decreaseEncounterSteps(pixels, onBattleCallback);
};

Party.prototype.adjustScene = function(direction, pixels) {
  var currentTile = this.currentTile();
  var forbiddenTiles = this.FORBIDDEN_TILES[this.currentVehicle];

  if (forbiddenTiles.indexOf(currentTile) !== -1) {
    if ((currentTile === 'grass' || currentTile === 'cold') &&
      this.currentVehicle === 'boat' && this.previousTile(direction, pixels) === 'shipyard') {
      // Port the ship and start walking.
      this.changeVehicle('walk');
      return;
    }
    // Undo move if it was invalid.
    this.moveWorld(direction, -pixels);
  }
};

Party.prototype.move = function(direction, pixels, onBattleCallback) {
  var adjustment = { 'right': -1, 'left': 1 };
  var anchor = { 'right': 1, 'left': 0 };
  var animation = { 'left': 'Sideways', 'right': 'Sideways', 'up': 'Up', 'down': 'Down' };
  var currentSprite = this.sprites.worldMap[this.currentVehicle];

  this.moveWorld(direction, pixels, onBattleCallback);
  this.adjustScene(direction, pixels);

  if (this.currentTile() === 'shipyard' && this.currentVehicle !== 'boat') {
    this.changeVehicle('boat');
  }

  if (direction === 'left' || direction === 'right') {
    currentSprite.anchor.setTo(anchor[direction], 0);
    currentSprite.scale.x = currentSprite.config.scale.x * adjustment[direction];
  }
  currentSprite.animations.play(this.currentVehicle + animation[direction]);
};

Party.prototype.decreaseEncounterSteps = function(pixels, onBattleCallback) {
  var decreaseValue = { 'walk': 6, 'boat': 2, 'canue': 2, 'ship': 0 };
  var stepCorrection = this.world.TILE_SIZE / pixels;
  this.world.nextEncounterSteps -= decreaseValue[this.currentVehicle] / stepCorrection;
  if (this.world.nextEncounterSteps < 0) {
    onBattleCallback(this);
    this.world.generateNextEncounterSteps();
  }
};
