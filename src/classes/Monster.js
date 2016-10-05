/* global Unit */

// Extends Unit.
Monster.prototype = Object.create(Unit.prototype);
Monster.prototype.constructor = Monster;
function Monster(phaserGame, x, y, spriteKey, monsterData) {
  Unit.call(this, phaserGame, x, y, spriteKey, monsterData, monsterData.name);
}

Monster.prototype.kill = function() {
  var self = this;
  self.alive = false;
  var dieTween = this.game.add.tween(this);
  dieTween.to({ alpha: 0 }, 1200, 'Quart.easeOut');
  dieTween.onComplete.add(function() {
    Unit.prototype.kill.call(self);
  });
  dieTween.start();
};
