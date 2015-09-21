function World(sprite, tileDataFile) {
  this.IMAGE_HEIGHT = 3840;
  this.IMAGE_WIDTH = 4240;
  this.TILE_SIZE = 16;

  this.sprite = sprite;

  this.elements = {
    1: 'sea',
    2: 'grass',
    3: 'forest',
    4: 'mountain',
    5: 'river',
    6: 'shipyard',
    7: 'desert',
    8: 'cold'
  };

  /* eslint-disable */
  this.locations = {
    11.1: 'Conralia Town',
    11.2: 'Cornalia Castle',
      12: 'Temple of Fiends',
      13: 'Matoyas Cave',
      14: 'PravokaTown',
    15.1: 'Elfland Town',
    15.2: 'Castle of Elf',
      16: 'Marsh Cave',
      17: 'Ancient Castle',
      18: 'Dwarf Cave',
      19: 'Melmond Town',
    20.1: 'Titan\'s Tunnel Entrance',
    20.2: 'Titan\'s Tunnel Exit',
      21: 'Sarda\'s Cave',
      22: 'Earth Cave',
      23: 'Crescent Lake Town',
      24: 'Gurgu Volcano',
      25: 'Ice Cave',
      26: 'Ryukan Desert',
      27: 'Castle of Ordeals',
    28.1: 'Dragon Cave 1',
    28.2: 'Dragon Cave 2',
    28.3: 'Dragon Cave 3',
    28.4: 'Dragon Cave 4',
    28.5: 'Dragon Cave 5',
    28.6: 'Dragon Cave 6',
    28.7: 'Dragon Cave 7',
      29: 'The Caravan',
      30: 'Gaia Town',
      31: 'Onrac Town',
      32: 'The Waterfall',
      33: 'Lefein Town',
      34: 'Mirage Tower'
  };
  /* eslint-enable */

  this.tiles = tileDataFile;
}

World.prototype.calculatePlayerCooordinates = function() {
  var spriteX = this.sprite.tilePosition.x;
  var spriteY = this.sprite.tilePosition.y;
  var heightOffset = 5;
  var widthOffset  = 10;
  // Recalculate Phaser bullshit with tileSprites
  if (spriteY < 0) spriteY = this.IMAGE_HEIGHT - Math.abs(spriteY);
  if (spriteX < 0) spriteX = this.IMAGE_WIDTH - Math.abs(spriteX);
  var currentY = Math.ceil((this.IMAGE_HEIGHT - spriteY) / this.TILE_SIZE) + heightOffset;
  var currentX = Math.ceil((this.IMAGE_WIDTH  - spriteX) / this.TILE_SIZE) + widthOffset;
  if (spriteY <= 79.5) currentY = heightOffset - Math.floor(spriteY / this.TILE_SIZE);
  if (spriteX <= 159.5) currentX = widthOffset - Math.floor(spriteX / this.TILE_SIZE);

  return {
    y: currentY > this.tiles.length ? this.tiles.length : currentY,
    x: currentX > this.tiles[1].length ? this.tiles[1].length : currentX
  };
};

World.prototype.next = function(direction) {
  // Left and top values must not be -1 because entering a tile is detected by the left and top boarders of the party pic.
  // TODO: Movement must be exact so this problem wont occur. this.TILE_SIZE will do the work as a unit.
  //       Or find another solution
  var values = { 'current': 0, 'right': 1, 'left': 0, 'top': 0, 'down': 1 };
  var coords = this.calculatePlayerCooordinates();

  if (direction === 'right' || direction === 'left') {
    return this.elements[this.tiles[coords.y][coords.x + values[direction]]];
  }
  return this.elements[this.tiles[coords.y + values[direction]][coords.x]];
};
