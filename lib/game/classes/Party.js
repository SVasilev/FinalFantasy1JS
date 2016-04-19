/* global CharacterData, Common */

function Party(spritesConfig, world, phaserGame) {
  this.sprites = this._createSpritesWithAnimations(spritesConfig, phaserGame);
  this.world = world;
  this.gil = 500;
  this.location = 'Cornelia';
  this.CHARACTERS_COUNT = 4;
  this.characters = {};
  this.inventory = []; // Array of type Item
  this.vehicles = ['walk', 'boat']; // List of vehicles that the party has.
  this.currentVehicle = 'walk';
  this.spells = [];
  this.enabled = true;

  this._init();
}

Party.prototype._createSpritesWithAnimations = function(spritesConfig, phaserGame) {
  var partySprites = {};
  Object.keys(spritesConfig).forEach(function(spriteKey) {
    partySprites[spriteKey] = Common.createSpriteFromConfig(
      spritesConfig[spriteKey], spriteKey, false, phaserGame
    );
  });
  return partySprites;
};

Party.prototype._init = function() {
  this.sprites['walk'].visible = true;

  ['warrior', 'thief', 'whiteMage', 'blackMage'].forEach(function(role) {
    this.characters[role] = new CharacterData(role);
  }, this);

  this.FORBIDDEN_TILES = {
    'walk': ['sea', 'mountain'],
    'boat': ['grass', 'forest', 'mountain', 'desert', 'cold'],
    'canue': ['grass', 'forest', 'mountain', 'desert', 'cold'],
    'ship': []
  };
};

// Returns true if we are staying on valid tile at the moment.
Party.prototype._currentTileIsValid = function() {
  return this.FORBIDDEN_TILES[this.currentVehicle].indexOf(this.currentTile()) === -1;
};

// Returns the last type of the tile on which we were.
Party.prototype._previousTile = function(direction, pixels) {
  this._moveWorld(direction, -pixels);
  var currentTile = this.currentTile();
  this._moveWorld(direction, pixels);
  return currentTile;
};

Party.prototype._changeVehicle = function(vehicle) {
  if (this.vehicles.indexOf(vehicle) !== -1) {
    this.sprites[this.currentVehicle].visible = false;
    this.currentVehicle = vehicle;
    this.sprites[vehicle].visible = true;
  }
};

Party.prototype._moveWorld = function(direction, pixels, onBattleCallback) {
  var adjustment = { 'right': -1, 'left': 1, 'up': 1, 'down': -1 };
  var axis = { 'right': 'x', 'left': 'x', 'up': 'y', 'down': 'y' };
  this.world.sprite.tilePosition[axis[direction]] += pixels * adjustment[direction];
  this._decreaseEncounterSteps(pixels, onBattleCallback);
};

Party.prototype._adjustScene = function(direction, pixels) {
  var currentTile = this.currentTile();

  if (!this._currentTileIsValid()) {
    if ((currentTile === 'grass' || currentTile === 'cold') &&
      this.currentVehicle === 'boat' && this._previousTile(direction, pixels) === 'shipyard') {
      // Port the ship and start walking.
      this._changeVehicle('walk');
      return;
    }
    // Undo move if it was invalid.
    this._moveWorld(direction, -pixels);
  }
};

Party.prototype._decreaseEncounterSteps = function(pixels, onBattleCallback) {
  var decreaseValue = { 'walk': 6, 'boat': 2, 'canue': 2, 'ship': 0 };
  var stepCorrection = this.world.TILE_SIZE / pixels;

  this.world.nextEncounterSteps -= decreaseValue[this.currentVehicle] / stepCorrection;
  if (this.world.nextEncounterSteps < 0 && this._currentTileIsValid()) {
    onBattleCallback(this);
    this.world.generateNextEncounterSteps();
  }
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

// Returns the type of the tile on which the party stands at the moment.
Party.prototype.currentTile = function() {
  var world = this.world;
  var coordinates = world.calculatePlayerCooordinates();
  return world.tileTypes[world.tiles[coordinates.y][coordinates.x]];
};

Party.prototype.move = function(direction, pixels, onBattleCallback) {
  var anchor = { 'right': 1, 'left': 0 };
  var animation = { 'left': 'Sideways', 'right': 'Sideways', 'up': 'Up', 'down': 'Down' };
  var currentSprite = this.sprites[this.currentVehicle];

  this._moveWorld(direction, pixels, onBattleCallback);
  this._adjustScene(direction, pixels);

  if (this.currentTile() === 'shipyard' && this.currentVehicle !== 'boat') {
    this._changeVehicle('boat');
  }

  var adjustment = { 'right': -1, 'left': 1 };
  if (direction === 'left' || direction === 'right') {
    currentSprite.anchor.setTo(anchor[direction], 0);
    currentSprite.scale.x = currentSprite.scale.y * adjustment[direction];
  }
  currentSprite.animations.play(this.currentVehicle + animation[direction]);
};
