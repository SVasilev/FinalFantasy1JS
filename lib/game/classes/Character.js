/* global Common */

// Extends Phaser.Sprite.
Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;
function Character(phaserGame, x, y, spriteKey, characterData, spriteConfig) {
  Phaser.Sprite.call(this, phaserGame, x, y, spriteKey);
  Common.createSpriteFromConfig(spriteConfig, this, true);
  this.characterData = characterData;
  phaserGame.add.existing(this);
}

Character.prototype.act = function(action, monster) {
  // console.log('I have characterData: ');
  // console.log(this.characterData);
  // console.log('I am ' + action + 'ing:');
  // console.log(monster.stats);
};

Character.prototype.kill = function() {
  alert('I should act differently');
};
