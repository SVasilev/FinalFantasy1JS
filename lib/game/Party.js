function Party(sprite, cursors, world) {
  this.sprite   = sprite;
  this.cursors  = cursors;
  this.world    = world;
  this.vehicles = ['boots']; // List of vehicles that the party has.
  this.currentVehicle = 'boots';

  this.sprite.animations.add('walkDown', [0, 1], 10, true);
  this.sprite.animations.add('walkSide', [2, 3], 10, true);
  this.sprite.animations.add('walkTop', [4, 5], 10, true);
}

Party.prototype.loadForbiddenTiles = function() {
  if (this.currentVehicle === 'boots') {
    return ['sea', 'mountain'];
  }
  if (this.currentVehicle === 'boat' || this.currentVehicle === 'canue') {
    return ['grass', 'forest', 'mountain', 'desert', 'cold'];
  }
  if (this.currentVehicle === 'ship') {
    return [];
  }

  // 01: 'sea',
  // 02: 'grass',
  // 03: 'forest',
  // 04: 'mountain',
  // 05: 'river',
  // 06: 'shipyard',
  // 07: 'desert',
  // 08: 'cold'
};

Party.prototype.moveIsValid = function(direction) {
  return this.loadForbiddenTiles().indexOf(this.world.next(direction)) === -1;
};

Party.prototype.move = function(pixels) {
  if(this.cursors.left.isDown && this.moveIsValid('left')) {
    this.world.sprite.tilePosition.x += pixels;
    this.sprite.anchor.setTo(0, 0);
    this.sprite.scale.x = 3;
    this.sprite.animations.play('walkSide');
  }
  else if(this.cursors.right.isDown && this.moveIsValid('right')) {
    this.world.sprite.tilePosition.x -= pixels;
    this.sprite.anchor.setTo(1, 0);
    this.sprite.scale.x = -3;
    this.sprite.animations.play('walkSide');
  }
  else if(this.cursors.up.isDown && this.moveIsValid('top')) {
    this.world.sprite.tilePosition.y += pixels;
    this.sprite.animations.play('walkTop');
  }
  else if (this.cursors.down.isDown && this.moveIsValid('down')) {
    this.world.sprite.tilePosition.y -= pixels;
    this.sprite.animations.play('walkDown');
  }
  else {
    this.sprite.animations.stop();
  }
  // this.sprite.animations.stop();
};
