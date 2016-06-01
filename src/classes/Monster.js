/* global Phaser, UnitActions, _ */

// Extends Phaser.TileSprite, Mixin UnitActions.
Monster.prototype = _.extend(Object.create(Phaser.TileSprite.prototype), UnitActions.prototype);
Monster.prototype.constructor = Monster;
function Monster(phaserGame, x, y, width, height, spriteKey, monsterData) {
  Phaser.TileSprite.call(this, phaserGame, x, y, width, height, spriteKey);
  this.stats = monsterData.stats;
  this.health = this.stats.HP;
  this.maxHealth = this.stats.maxHP;
  phaserGame.add.existing(this);
}

Monster.prototype.kill = function() {
  var self = this;
  self.alive = false;
  var dieTween = this.game.add.tween(this);
  dieTween.to({ alpha: 0 }, 1200, 'Quart.easeOut');
  dieTween.onComplete.add(function() {
    Phaser.TileSprite.prototype.kill.call(self);
  });
  dieTween.start();
};
