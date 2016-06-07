/* global GameConstants, BattleUnits, Character, Common, _ */

function Party(world, phaserGame) {
  var spritesDataKey = GameConstants.ASSETS_KEYS.WORLDMAP_PARTY_SPRITES_DATA_JSON;
  var partyDataKey = GameConstants.ASSETS_KEYS.PARTY_DATA_JSON;

  this.world = world;
  this.worldMapSpritesData = phaserGame.cache.getJSON(spritesDataKey);
  this.partyData = phaserGame.cache.getJSON(partyDataKey);
  this.location = this.partyData.startingLocation;
  this.currentVehicle = this.partyData.startingVehicle;
  this.vehicles = [this.currentVehicle]; // List of vehicles that the party has.
  this.enabled = true;

  this.inBattleUnitGroup = null;
  this.FORBIDDEN_TILES = {};
  this.sprites = {};
  this.characters = {};
  this.inventory = {}; // Example: { 'Armor': Item[], 'Weapon': Item[] }
  this.spells = {};

  this._init(phaserGame);
}

// Adds phaser objects to this.sprites map.
Party.prototype._createSpritesWithAnimations = function(phaserGame) {
  Object.keys(this.worldMapSpritesData).forEach(function(spriteKey) {
    this.sprites[spriteKey] = Common.createSpriteFromConfig(
      this.worldMapSpritesData[spriteKey], spriteKey, false, phaserGame
    );
  }, this);
};

Party.prototype._createInBattleUnitsGroup = function(phaserGame) {
  var partyUnitsConfig = {
    x: phaserGame.width * 8 / 10,
    y: phaserGame.height * 0.5 / 10,
    padding: phaserGame.height * 1.8 / 10,
    isParty: true,
    cursorSpriteKey: GameConstants.ASSETS_KEYS.MENU_CURSOR_IMG
  };

  this.inBattleUnitGroup = new BattleUnits(partyUnitsConfig, phaserGame);
  var charactersData = phaserGame.cache.getJSON(GameConstants.ASSETS_KEYS.CHARACTERS_DATA_JSON);
  _.pluck(charactersData, 'role').forEach(function(characterRole) {
    this.inBattleUnitGroup.addUnit(new Character(phaserGame, 0, 0, characterRole));
  }, this);
  this.inBattleUnitGroup.getUnitsGroup().setAll('visible', false);
};

Party.prototype._init = function(phaserGame) {
  this._createSpritesWithAnimations(phaserGame);
  this._createInBattleUnitsGroup(phaserGame);
  this.sprites.walk.visible = true;

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
  var decreaseValue = this.worldMapSpritesData[this.currentVehicle].encounterSteps;
  var stepCorrection = this.world.worldmapData.tileSize / pixels;

  this.world.nextEncounterSteps -= decreaseValue / stepCorrection;
  if (this.world.nextEncounterSteps < 0 && this._currentTileIsValid()) {
    onBattleCallback(this);
    this.world.generateNextEncounterSteps();
  }
};

// Returns the tile type on the <left|right|up|down> side of the party.
// This is only for development for now.
Party.prototype.nextTile = function(direction) {
  var worldmapTiles = this.world.worldmapData.tiles;
  var worldmapTileTypes = this.world.worldmapData.tileTypes;
  var adjustment = { 'right': 0, 'left': -1, 'up': -1, 'down': 0 };
  var coordinates = this.world.calculatePlayerCooordinates();

  if (direction === 'right' || direction === 'left') {
    return worldmapTileTypes[worldmapTiles[coordinates.y][coordinates.x + adjustment[direction]]];
  }
  return worldmapTileTypes[worldmapTiles[coordinates.y + adjustment[direction]][coordinates.x]];
};

// Returns the type of the tile on which the party stands at the moment.
Party.prototype.currentTile = function() {
  var worldmapData = this.world.worldmapData;
  var coordinates = this.world.calculatePlayerCooordinates();
  return worldmapData.tileTypes[worldmapData.tiles[coordinates.y][coordinates.x]];
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
