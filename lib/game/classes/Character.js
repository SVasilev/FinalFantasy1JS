/* global alert, Phaser, Common, UnitActions, _ */

// Extends Phaser.Sprite, Mixin UnitActions.
Character.prototype = _.extend(Object.create(Phaser.Sprite.prototype), UnitActions.prototype);
Character.prototype.constructor = Character;
function Character(phaserGame, x, y, spriteKey, characterData, spriteConfig) {
  Phaser.Sprite.call(this, phaserGame, x, y, spriteKey);
  Common.createSpriteFromConfig(spriteConfig, this, true);
  this.stats = characterData.stats;
  this.health = this.stats.hitPoints;
  this.maxHealth = this.stats.maxHitPoints;
  this.characterData = characterData;
  phaserGame.add.existing(this);
}

Character.prototype.kill = function() {
  alert('I should act differently');
};
