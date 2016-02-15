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
  var functionToCall = damage > 0 ? 'damage' : 'heal';
  var textColor = damage > 0 ? 'rgb(250, 20, 20)' : 'rgb(23, 98, 20)';
  var addend = damage > 0 ? monster.width * 4 : monster.width;
  damage = Math.abs(damage);

  monster[functionToCall](damage);
  var damageText = character.game.add.text(monster.world.x + addend, monster.world.y, damage, {
    font: 'bold 20pt Courier New',
    fill: textColor
  });
  var damageTween = character.game.add.tween(damageText);
  damageTween.to({ y: damageText.y - 50, alpha: 0 }, 5000, "Quart.easeOut");
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
    case 'MagicFira':
    case 'MagicFera':
      var magicDamage = { 'MagicFire': 4, 'MagicFira': 5, 'MagicFera': 7 };
      var fireBall = this.game.add.sprite(this.world.x - this.width, this.world.y, 'spellSpriteSheet');
      var tween = this.game.add.tween(fireBall).to({ x: monster.world.x + monster.width, y: monster.world.y - 20 }, 500);

      tween.onComplete.add(function() {
        fireBall.animations.add('fire');
        fireBall.animations.play('fire', 10, true);
        window.setTimeout(function() {
          fireBall.animations.stop();
          fireBall.destroy();
          character._dealDamage(character, monster, magicDamage[action]);
          character.characterData.stats.magicPoints -= 3;
          afterAnimationCallback();
        }, 500);
      });
      tween.start();
      break;

    case 'ItemHP+':
    case 'ItemHP++':
    case 'ItemHP+++':
      var healAmount = (action.match(/\+/g) || []).length;
      character._dealDamage(this, this, -healAmount * 5);
      setTimeout(function() {
        afterAnimationCallback();
      }, 1000);
      break;

    case 'Flee':
      var willEscape = Phaser.Utils.chanceRoll(50);
      this.scale.x = this.scale.y * -1;
      this.animations.play('walk');

      var goBack = this.game.add.tween(this).to({ x: 0, y: this.y }, 1000, "Quart.easeOut");
      goBack.onComplete.add(function() {
        character.animations.stop();
        character.animations.play('walk');
        character.animations.stop();
        afterAnimationCallback();
      });

      var runAway = this.game.add.tween(this).to({ x: this.x + 300, y: this.y }, 1500, "Quart.easeOut");
      runAway.onComplete.add(function() {
        if (willEscape) {
          character.animations.stop();
          afterAnimationCallback(willEscape);
        }
        else {
          character.scale.x = character.scale.y;
          goBack.start();
        }
      });
      runAway.start();
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
