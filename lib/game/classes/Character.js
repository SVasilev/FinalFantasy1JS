/* global window, alert, Phaser, Common */

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

Character.prototype._changeHealth = function(character, monster, amount) {
  var redColor = 'rgb(250, 20, 20)';
  var greenColor = 'rgb(23, 98, 20)';
  var textColor = amount > 0 ? redColor : greenColor ;
  var functionToCall = amount >= 0 ? 'damage' : 'heal';
  var addend = amount > 0 ? monster.width * 4 : monster.width;
  var absAmount = Math.abs(amount);
  var amountText = character.game.add.text(monster.world.x + addend, monster.world.y, absAmount, {
    font: 'bold 20pt Courier New',
    fill: textColor
  });
  var damageTween = character.game.add.tween(amountText);

  // Deal damage or heal the unit. Animate the text.
  monster[functionToCall](absAmount);
  damageTween.to({ y: amountText.y - 50, alpha: 0 }, 5000, 'Quart.easeOut');
  damageTween.onComplete.add(function() {
    amountText.destroy();
  });
  damageTween.start();
};

Character.prototype._attack = function(monster, afterAnimationCallback) {
  var character = this;
  this.animations.play('walk');
  var goBackToPosition = this.game.add.tween(this).to({ x: 0, y: this.y }, 600, 'Quart.easeOut');
  goBackToPosition.onComplete.add(function() {
    character.animations.stop();
    character.scale.x = character.scale.y;
    afterAnimationCallback();
  });

  var attack = this.game.add.tween(monster).to({ alpha: 0.2 }, 150, 'Quart.easeOut', false, 0, 0, true);
  attack.chain(goBackToPosition);
  attack.onComplete.add(function() {
    character.scale.x = character.scale.y * -1;
    character.animations.play('walk');
  });

  var attackEnemy = this.game.add.tween(this);
  attackEnemy.to({ x: -this.game.width * 3 / 10, y: monster.y }, 600, 'Quart.easeOut');
  attackEnemy.chain(attack);
  attackEnemy.onComplete.add(function() {
    character.animations.stop();
    var damageDone = character.characterData.stats.damage - monster.stats.def;
    damageDone = damageDone < 1 ? 1 : damageDone;
    character._changeHealth(character, monster, damageDone);
  });
  attackEnemy.start();
};

Character.prototype._castSpell = function(magicName, monster, afterAnimationCallback) {
  var character = this;
  var magicDamage = { 'MagicFire': 4, 'MagicFira': 5, 'MagicFera': 7 };
  var fireBall = this.game.add.sprite(this.world.x - this.width, this.world.y, 'spellSpriteSheet');
  var targetCoords = { x: monster.world.x + monster.width, y: monster.world.y - 20 };
  var tween = this.game.add.tween(fireBall).to(targetCoords, 500);

  tween.onComplete.add(function() {
    fireBall.animations.add('fire');
    fireBall.animations.play('fire', 10, true);
    window.setTimeout(function() {
      fireBall.animations.stop();
      fireBall.destroy();
      character._changeHealth(character, monster, magicDamage[magicName]);
      character.characterData.stats.magicPoints -= 3;
      afterAnimationCallback();
    }, 500);
  });
  tween.start();
};

Character.prototype._useItem = function(itemName, afterAnimationCallback) {
  var healAmount = (itemName.match(/\+/g) || []).length;
  this._changeHealth(this, this, -healAmount * 5);
  setTimeout(function() {
    afterAnimationCallback();
  }, 1000);
};

Character.prototype._tryToEscape = function(afterAnimationCallback) {
  var character = this;
  var willEscape = Phaser.Utils.chanceRoll(50);
  this.scale.x = this.scale.y * -1;
  this.animations.play('walk');

  var goBack = this.game.add.tween(this).to({ x: 0, y: this.y }, 1000, 'Quart.easeOut');
  goBack.onComplete.add(function() {
    character.animations.stop();
    character.animations.play('walk');
    character.animations.stop();
    afterAnimationCallback();
  });

  var runAway = this.game.add.tween(this).to({ x: this.x + 300, y: this.y }, 1500, 'Quart.easeOut');
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
};

Character.prototype.act = function(action, monster, afterAnimationCallback) {
  switch (action) {
  case 'Attack':
    this._attack(monster, afterAnimationCallback);
    break;
  case 'MagicFire':
  case 'MagicFira':
  case 'MagicFera':
    this._castSpell(action, monster, afterAnimationCallback);
    break;
  case 'ItemHP+':
  case 'ItemHP++':
  case 'ItemHP+++':
    this._useItem(action, afterAnimationCallback);
    break;
  case 'Flee':
    this._tryToEscape(afterAnimationCallback);
    break;
  }
};

Character.prototype.kill = function() {
  alert('I should act differently');
};
