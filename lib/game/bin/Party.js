function Party(sprites, cursors, world) {
  this.sprites = sprites;
  this.cursors = cursors;
  this.world = world;
  this.vehicles = ['walk', 'boat']; // List of vehicles that the party has.
  this.currentVehicle = 'walk';

  // Load animations for each sprite.
  for (var name in sprites) {
    var animationData = sprites[name].config.animation;
    for (var direction in animationData) {
      this.sprites[name].animations.add(direction, animationData[direction], 10, true);
    }
  }

  this.forbiddenTiles = {
    'walk': ['sea', 'mountain'],
    'boat': ['grass', 'forest', 'mountain', 'desert', 'cold'],
    'canue': ['grass', 'forest', 'mountain', 'desert', 'cold'],
    'ship': []
  };
}

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
    this.sprites[this.currentVehicle].visible = false;
    this.currentVehicle = vehicle;
    this.sprites[vehicle].visible = true;
  }
};

Party.prototype.moveWorld = function(direction, pixels) {
  var adjustment = { 'right': -1, 'left': 1, 'up': 1, 'down': -1 };
  var axis = { 'right': 'x', 'left': 'x', 'up': 'y', 'down': 'y' };
  this.decreaseEncounterSteps(pixels);
  this.world.sprite.tilePosition[axis[direction]] += pixels * adjustment[direction];
};

Party.prototype.adjustScene = function(direction, pixels) {
  var currentTile = this.currentTile();
  var forbiddenTiles = this.forbiddenTiles[this.currentVehicle];

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

Party.prototype.moveScene = function(direction, pixels) {
  var adjustment = { 'right': -1, 'left': 1 };
  var anchor = { 'right': 1, 'left': 0 };
  var animation = { 'left': 'Sideways', 'right': 'Sideways', 'up': 'Up', 'down': 'Down' };
  var currentSprite = this.sprites[this.currentVehicle];

  this.moveWorld(direction, pixels);
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

Party.prototype.decreaseEncounterSteps = function(pixels) {
  var decreaseValue = { 'walk': 6, 'boat': 2, 'canue': 2, 'ship': 0 };
  var stepCorrection = this.world.TILE_SIZE / pixels;
  this.world.nextEncounterSteps -= decreaseValue[this.currentVehicle] / stepCorrection;
  if (this.world.nextEncounterSteps < 0) {
    // Enter battle code should be written here.
    this.world.generateNextEncounterSteps();
  }
};

Party.prototype.move = function(pixels) {
  var directions = ['left', 'right', 'up', 'down'];
  for (var i = 0; i < directions.length; i++) {
    var direction = directions[i];
    if (this.cursors[direction].isDown) {
      this.moveScene(direction, pixels);
      break;
    }
    if (direction === 'down') {
      // No key was pressed.
      this.sprites[this.currentVehicle].animations.stop();
    }
  }
};
