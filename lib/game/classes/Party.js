function Party(sprites, cursors, world) {
  this.sprites = sprites;
  this.cursors = cursors;
  this.world = world;
  this.vehicles = ['walk']; // List of vehicles that the party has.
  this.currentVehicle = 'walk';

  for (var name in this.sprites) {
    var animationData = this.sprites[name].config.animation;
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

// Returns the type of the tile on which the party stands at the moment.
Party.prototype.currentTile = function() {
  var world = this.world;
  var coordinates = world.calculatePlayerCooordinates();
  return world.tileTypes[world.tiles[coordinates.y][coordinates.x]];
};

Party.prototype.undoMoveIfItWasInvalid = function(direction, pixels) {
  var adjustment = { 'right': 1, 'left': -1, 'up': -1, 'down': 1 };
  var axis = { 'right': 'x', 'left': 'x', 'up': 'y', 'down': 'y' };

  var forbiddenTiles = this.forbiddenTiles[this.currentVehicle];
  if (forbiddenTiles.indexOf(this.currentTile()) !== -1) {
    this.world.sprite.tilePosition[axis[direction]] += pixels * adjustment[direction];
  }
};

Party.prototype.moveVertical = function(direction, pixels) {
  var adjustment = { 'right': -1, 'left': 1 };
  var anchor = { 'right': 1, 'left': 0 };
  var currentSprite = this.sprites[this.currentVehicle];

  this.world.sprite.tilePosition.x += pixels * adjustment[direction];
  this.undoMoveIfItWasInvalid(direction, pixels);
  currentSprite.anchor.setTo(anchor[direction], 0);
  currentSprite.scale.x = currentSprite.config.scale.x * adjustment[direction];
  currentSprite.animations.play(this.currentVehicle + 'Sideways');
};

Party.prototype.moveHorizontal = function(direction, pixels, animation) {
  var adjustment = { 'up': 1, 'down': -1 };
  var currentSprite = this.sprites[this.currentVehicle];

  this.world.sprite.tilePosition.y += pixels * adjustment[direction];
  this.undoMoveIfItWasInvalid(direction, pixels);
  currentSprite.animations.play(animation);
};

Party.prototype.move = function(pixels) {
  if (this.cursors.left.isDown) {
    this.moveVertical('left', pixels);
  }
  else if (this.cursors.right.isDown) {
    this.moveVertical('right', pixels);
  }
  else if (this.cursors.up.isDown) {
    this.moveHorizontal('up', pixels, this.currentVehicle + 'Up');
  }
  else if (this.cursors.down.isDown) {
    this.moveHorizontal('down', pixels, this.currentVehicle + 'Down');
  }
  else {
    this.sprites[this.currentVehicle].animations.stop();
  }
};
