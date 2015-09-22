function Party(sprite, cursors, world) {
  this.sprite = sprite;
  this.cursors = cursors;
  this.world = world;
  this.partyIsMoving = false;
  this.vehicles = ['boots']; // List of vehicles that the party has.
  this.currentVehicle = 'boots';

  this.sprite.animations.add('walkDown', [0, 1], 10, true);
  this.sprite.animations.add('walkSideWays', [2, 3], 5, true);
  this.sprite.animations.add('walkUp', [4, 5], 10, true);

  this.forbiddenTiles = {
    'boots': ['sea', 'mountain'],
    'boat': ['grass', 'forest', 'mountain', 'desert', 'cold'],
    'canue': ['grass', 'forest', 'mountain', 'desert', 'cold'],
    'ship': []
  };
}

// Returns the tile type on the <left|right|up|down> side of the party.
// This is only for development for now.
Party.prototype.nextTile = function(direction) {
  var adjustment = { 'right': 0, 'left': -1, 'up': -1, 'down': 0 };
  var coordinates = this.world.calculatePlayerCooordinates();

  if (direction === 'right' || direction === 'left') {
    return  this.world.tileTypes[ this.world.tiles[coordinates.y][coordinates.x + adjustment[direction]]];
  }
  return  this.world.tileTypes[ this.world.tiles[coordinates.y + adjustment[direction]][coordinates.x]];
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

  this.world.sprite.tilePosition.x += pixels * adjustment[direction];
  this.undoMoveIfItWasInvalid(direction, pixels);
  this.sprite.anchor.setTo(anchor[direction], 0);
  this.sprite.scale.x = 3 * adjustment[direction];
  this.sprite.animations.play('walkSideWays');
};

Party.prototype.moveHorizontal = function(direction, pixels, animation) {
  var adjustment = { 'up': 1, 'down': -1 };

  this.world.sprite.tilePosition.y += pixels * adjustment[direction];
  this.undoMoveIfItWasInvalid(direction, pixels);
  this.sprite.animations.play(animation);
};

Party.prototype.move = function(pixels) {
  if (this.cursors.left.isDown) {
    this.moveVertical('left', pixels);
  }
  else if (this.cursors.right.isDown) {
    this.moveVertical('right', pixels);
  }
  else if (this.cursors.up.isDown) {
    this.moveHorizontal('up', pixels, 'walkUp');
  }
  else if (this.cursors.down.isDown) {
    this.moveHorizontal('down', pixels, 'walkDown');
  }
  else {
    this.sprite.animations.stop();
  }
};
