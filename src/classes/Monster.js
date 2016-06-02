/* global Phaser, UnitActions, _ */

// Extends Phaser.Sprite, Mixin UnitActions.
Monster.prototype = _.extend(Object.create(Phaser.Sprite.prototype), UnitActions.prototype);
Monster.prototype.constructor = Monster;
function Monster(phaserGame, x, y, width, height, spriteKey, monsterData) {
  Phaser.Sprite.call(this, phaserGame, x, y, spriteKey, monsterData.name);
  this.name = monsterData.name;
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
    Phaser.Sprite.prototype.kill.call(self);
  });
  dieTween.start();
};
