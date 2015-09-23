function World(sprite, tileDataFile) {
  this.IMAGE_HEIGHT = 3840;
  this.IMAGE_WIDTH = 4240;
  this.TILE_SIZE = 16;

  this.sprite = sprite;

  this.tileTypes = {
    1: 'sea',
    2: 'grass',
    3: 'forest',
    4: 'mountain',
    5: 'river',
    6: 'shipyard',
    7: 'desert',
    8: 'cold'
  };

  /* eslint-disable indent */
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
  var widthOffset = 10;
  var tileOffset = 10;

  // Recalculate Phaser wrong tileSprites coordinates.
  if (spriteY < 0) {
    spriteY = this.IMAGE_HEIGHT - Math.abs(spriteY);
  }
  if (spriteX < 0) {
    spriteX = this.IMAGE_WIDTH - Math.abs(spriteX);
  }
  var currentY = Math.ceil((this.IMAGE_HEIGHT - spriteY + tileOffset) / this.TILE_SIZE) + heightOffset;
  var currentX = Math.ceil((this.IMAGE_WIDTH - spriteX + tileOffset) / this.TILE_SIZE) + widthOffset;
  if (spriteY <= 79.5) {
    currentY = heightOffset - Math.floor(spriteY / this.TILE_SIZE);
  }
  if (spriteX <= 159.5) {
    currentX = widthOffset - Math.floor(spriteX / this.TILE_SIZE);
  }

  return {
    y: currentY > this.tiles.length ? this.tiles.length : currentY,
    x: currentX > this.tiles[1].length ? this.tiles[1].length : currentX
  };
};
