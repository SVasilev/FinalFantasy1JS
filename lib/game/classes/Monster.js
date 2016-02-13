// Extends Phaser.TileSprite.
Monster.prototype = Object.create(Phaser.TileSprite.prototype);
Monster.prototype.constructor = Monster;
function Monster(phaserGame, x, y, width, height, spriteKey, stats) {
  Phaser.TileSprite.call(this, phaserGame, x, y, width, height, spriteKey);
  this.stats = stats;
  phaserGame.add.existing(this);
}

Monster.prototype.act = function(action, character) {
  console.log('I have stats: ');
  console.log(this.stats);
  console.log('I am ' + action + 'ing:');
  console.log(character.characterData);
};
