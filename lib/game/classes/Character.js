/* global Common */

// Extends Phaser.Sprite.
Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;
function Character(phaserGame, x, y, spriteKey, characterData, spriteConfig) {
  Phaser.Sprite.call(this, phaserGame, x, y, spriteKey);
  Common.createSpriteFromConfig(spriteConfig, this, true);
  this.health = characterData.stats.hitPoints;
  this.maxHealth = characterData.stats.maxHitPoints;
  this.characterData = characterData;
  phaserGame.add.existing(this);
}

Character.prototype._dealDamage = function(character, monster, damage) {
  monster.damage(damage);
  var damageText = character.game.add.text(monster.world.x + monster.width * 4, monster.world.y, damage, {
    font: 'bold 20pt Courier New',
    fill: 'rgb(250, 20, 20)'
  });
  var damageTween = character.game.add.tween(damageText);
  damageTween.to({ y: damageText.y - 50, alpha: 0 }, 1000, "Quart.easeOut");
  damageTween.onComplete.add(function() {
    damageText.destroy();
  });
  damageTween.start();
};

Character.prototype.act = function(action, monster, afterAnimationCallback) {
  var character = this;
  switch (action) {
    case 'Attack':
      this.animations.play('walk');
      var goBackToPosition = this.game.add.tween(this).to({ x: 0, y: this.y }, 600, "Quart.easeOut");
      goBackToPosition.onComplete.add(function() {
        character.animations.stop();
        character.scale.x = character.scale.y;
        afterAnimationCallback();
      });

      var attack = this.game.add.tween(monster).to({ alpha: 0.2 }, 150, "Quart.easeOut", false, 0, 0, true);
      attack.chain(goBackToPosition);
      attack.onComplete.add(function() {
        character.scale.x = character.scale.y * -1;
        character.animations.play('walk');
      });

      var attackEnemy = this.game.add.tween(this);
      attackEnemy.to({ x: -this.game.width * 3 / 10, y: monster.y }, 600, "Quart.easeOut");
      attackEnemy.chain(attack);
      attackEnemy.onComplete.add(function() {
        character.animations.stop();
        var damageDone = character.characterData.stats.damage - monster.stats.def;
        damageDone = damageDone < 1 ? 1 : damageDone;
        character._dealDamage(character, monster, damageDone);
      });
      attackEnemy.start();
      break;

    case 'MagicFire':
      var fireBall = this.game.add.sprite(this.world.x - this.width, this.world.y, 'spellSpriteSheet');
      var tween = this.game.add.tween(fireBall).to({ x: monster.world.x + monster.width, y: monster.world.y - 20 }, 500);
      tween.onComplete.add(function() {
        fireBall.animations.add('fire');
        fireBall.animations.play('fire', 10, true);
        window.setTimeout(function() {
          fireBall.animations.stop();
          fireBall.destroy();
          character._dealDamage(character, monster, 7);
          character.characterData.stats.magicPoints -= 3;
          afterAnimationCallback();
        }, 500);
      });
      tween.start();
      break;

    default:
      break;
  }
  // console.log('I have characterData: ');
  // console.log(this.characterData);
  // console.log('I am ' + action + 'ing:');
  // console.log(monster.stats);
};

Character.prototype.kill = function() {
  alert('I should act differently');
};
