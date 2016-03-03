/* global Phaser */

// Extends Phaser.TileSprite.
Monster.prototype = Object.create(Phaser.TileSprite.prototype);
Monster.prototype.constructor = Monster;
function Monster(phaserGame, x, y, width, height, spriteKey, stats) {
  Phaser.TileSprite.call(this, phaserGame, x, y, width, height, spriteKey);
  this.health = stats.hp;
  this.maxHealth = stats.hp;
  this.stats = stats;
  phaserGame.add.existing(this);
}

Monster.prototype.act = function(action, character, afterAnimationCallback) {
  var monster = this;

  var goBackToPosition = this.game.add.tween(this).to({ x: this.x, y: this.y }, 150, "Quart.easeOut");
  goBackToPosition.onComplete.add(function() {
    afterAnimationCallback();
  });

  var attack = this.game.add.tween(character).to({ alpha: 0.2 }, 300, "Quart.easeOut", false, 0, 0, true);
  attack.onComplete.add(function() {
    character.animations.play('walk');
    character.animations.stop();
  });
  attack.chain(goBackToPosition);

  var attackEnemy = this.game.add.tween(this);
  attackEnemy.to({ x: character.world.x - character.width * 2, y: character.y }, 150, "Quart.easeOut");
  attackEnemy.chain(attack);
  attackEnemy.onComplete.add(function() {
    var damageDone = monster.stats.atk - character.characterData.stats.armor;
    damageDone = damageDone < 1 ? 1 : damageDone;
    character.damage(damageDone);
    character.characterData.stats.hitPoints -= damageDone;
    var damageText = character.game.add.text(character.world.x - character.width, character.world.y, damageDone, {
      font: 'bold 20pt Courier New',
      fill: 'rgb(250, 20, 20)'
    });
    var damageTween = character.game.add.tween(damageText);
    damageTween.to({ y: damageText.y - 50, alpha: 0 }, 1000, "Quart.easeOut");
    damageTween.onComplete.add(function() {
      damageText.destroy();
    });
    damageTween.start();
    character.animations.play('block');
  });
  attackEnemy.start();
};

Monster.prototype.kill = function() {
  var self = this;
  self.alive = false;
  var dieTween = this.game.add.tween(this);
  dieTween.to({ alpha: 0 }, 1200, "Quart.easeOut");
  dieTween.onComplete.add(function() {
    Phaser.TileSprite.prototype.kill.call(self);
  });
  dieTween.start();
};
