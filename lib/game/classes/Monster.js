// Extends Phaser.TileSprite.
Monster.prototype = Object.create(Phaser.TileSprite.prototype);
Monster.prototype.constructor = Monster;
function Monster(phaserGame, x, y, width, height, spriteKey, stats) {
  Phaser.TileSprite.call(this, phaserGame, x, y, width, height, spriteKey);
  this.stats = stats;
  phaserGame.add.existing(this);
}
