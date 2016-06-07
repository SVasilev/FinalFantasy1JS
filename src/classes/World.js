/* global GameConstants, SYS_CONFIG */

function World(phaserGame) {
  var assetsKeys = GameConstants.ASSETS_KEYS;

  this.worldmapData = phaserGame.cache.getJSON(assetsKeys.WORLDMAP_TILE_DATA_JSON);
  this.sprite = phaserGame.add.tileSprite(
    0, 0, phaserGame.width, phaserGame.height, assetsKeys.WORLDMAP_IMG
  );
  this.sprite.scale.setTo(this.worldmapData.scale.x, this.worldmapData.scale.y);
  this.sprite.tilePosition.x = this.worldmapData.startPosition.x;//3990;
  this.sprite.tilePosition.y = this.worldmapData.startPosition.y;//3763;

  this.generateNextEncounterSteps();
}

World.prototype.calculatePlayerCooordinates = function() {
  var tiles = this.worldmapData.tiles;
  var tileSize = this.worldmapData.tileSize;
  var imageWidth = this.sprite.texture.width;
  var imageHeight = this.sprite.texture.height;
  var spriteX = this.sprite.tilePosition.x;
  var spriteY = this.sprite.tilePosition.y;
  var heightOffset = 5;
  var widthOffset = 10;
  var tileOffset = 10;

  // Recalculate Phaser wrong tileSprites coordinates.
  if (spriteY < 0) {
    spriteY = imageHeight - Math.abs(spriteY);
  }
  if (spriteX < 0) {
    spriteX = imageWidth- Math.abs(spriteX);
  }
  var currentY = Math.ceil((imageHeight - spriteY + tileOffset) / tileSize) + heightOffset;
  var currentX = Math.ceil((imageWidth- spriteX + tileOffset) / tileSize) + widthOffset;
  if (spriteY <= 79.5) {
    currentY = heightOffset - Math.floor(spriteY / tileSize);
  }
  if (spriteX <= 159.5) {
    currentX = widthOffset - Math.floor(spriteX / tileSize);
  }

  return {
    y: currentY > tiles.length ? tiles.length : currentY,
    x: currentX > tiles[1].length ? tiles[1].length : currentX
  };
};

// Random encounters can occur after 50-255 steps.
World.prototype.generateNextEncounterSteps = function() {
  var minEncSteps = 50;
  var maxEncSteps = 255;
  var randomEncounterSteps = Math.random() * (maxEncSteps - minEncSteps + 1);

  this.nextEncounterSteps = Math.floor(randomEncounterSteps) + minEncSteps;
  this.nextEncounterSteps = SYS_CONFIG.BATTLE_DEBUG ? 20 : this.nextEncounterSteps;
};
