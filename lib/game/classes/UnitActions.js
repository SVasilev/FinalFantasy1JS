/* global window, Phaser, Monster */

// Common unit functionallity used as Mixin in Character.js and Monster.js
function UnitActions() {}

UnitActions.prototype._changeHealth = function(targetUnit, amount) {
  var redColor = 'rgb(250, 20, 20)';
  var greenColor = 'rgb(23, 98, 20)';
  var textColor = amount < 0 ? redColor : greenColor;
  var functionToCall = amount < 0 ? 'damage' : 'heal';
  var absAmount = Math.abs(amount);
  var amountText = this.game.add.text(targetUnit.world.x , targetUnit.world.y, absAmount, {
    font: 'bold 20pt Courier New',
    fill: textColor
  });
  var damageTween = this.game.add.tween(amountText);

  // Deal damage or heal the unit. Animate the text.
  targetUnit[functionToCall](absAmount);
  damageTween.to({ x: amountText.x, y: amountText.y - 50, alpha: 0 }, 5000, 'Quart.easeOut');
  damageTween.onComplete.add(function() {
    amountText.destroy();
  });
  damageTween.start();
};

UnitActions.prototype._attack = function(targetUnit, afterAnimationCallback) {
  this.animations.play('walk');
  var goBackToPosition = this.game.add.tween(this).to({ x: this.x, y: this.y }, 600, 'Quart.easeOut');
  goBackToPosition.onComplete.add(function() {
    this.animations.stop();
    this.scale.x = this.scale.y;
    afterAnimationCallback();
  }.bind(this));

  var attack = this.game.add.tween(targetUnit).to({ alpha: 0.2 }, 150, 'Quart.easeOut', false, 0, 0, true);
  attack.chain(goBackToPosition);
  attack.onComplete.add(function() {
    targetUnit.animations.play('walk');
    targetUnit.animations.stop();
    this.scale.x = this.scale.y * -1;
    this.animations.play('walk');
  }.bind(this));

  var targetUnitX = this instanceof Monster ? targetUnit.world.x - targetUnit.width * 2 : -this.game.width * 3 / 10;
  var goToEnemy = this.game.add.tween(this);
  goToEnemy.to({ x: targetUnitX, y: targetUnit.y }, 600, 'Quart.easeOut');
  goToEnemy.chain(attack);
  goToEnemy.onComplete.add(function() {
    this.animations.stop();
    var damageDone = this.stats.atk - targetUnit.stats.def;
    damageDone = damageDone < 1 ? 1 : damageDone;
    this._changeHealth(targetUnit, -damageDone);
    targetUnit.animations.play('block');
  }.bind(this));
  goToEnemy.start();
};

UnitActions.prototype._castSpell = function(magicName, targetUnit, afterAnimationCallback) {
  var magicDamage = { 'MagicFire': 4, 'MagicFira': 5, 'MagicFera': 7 };
  var fireBall = this.game.add.sprite(this.world.x - this.width, this.world.y, 'spellSpriteSheet');
  var targetCoords = { x: targetUnit.world.x + targetUnit.width, y: targetUnit.world.y - 20 };
  var tween = this.game.add.tween(fireBall).to(targetCoords, 500);

  tween.onComplete.add(function() {
    fireBall.animations.add('fire');
    fireBall.animations.play('fire', 10, true);
    window.setTimeout(function() {
      fireBall.animations.stop();
      fireBall.destroy();
      this._changeHealth(targetUnit, -magicDamage[magicName]);
      this.stats.magicPoints -= 3;
      afterAnimationCallback();
    }.bind(this), 500);
  }.bind(this));
  tween.start();
};

UnitActions.prototype._useItem = function(itemName, afterAnimationCallback) {
  var healAmount = (itemName.match(/\+/g) || []).length;
  this._changeHealth(this, healAmount * 5);
  setTimeout(function() {
    afterAnimationCallback();
  }, 1000);
};

UnitActions.prototype._tryToEscape = function(afterAnimationCallback) {
  var willEscape = Phaser.Utils.chanceRoll(50);
  this.scale.x = this.scale.y * -1;
  this.animations.play('walk');

  var goBack = this.game.add.tween(this).to({ x: 0, y: this.y }, 1000, 'Quart.easeOut');
  goBack.onComplete.add(function() {
    this.animations.stop();
    this.animations.play('walk');
    this.animations.stop();
    afterAnimationCallback();
  }.bind(this));

  var runAway = this.game.add.tween(this).to({ x: this.x + 300, y: this.y }, 1500, 'Quart.easeOut');
  runAway.onComplete.add(function() {
    if (willEscape) {
      this.animations.stop();
      afterAnimationCallback(willEscape);
    }
    else {
      this.scale.x = this.scale.y;
      goBack.start();
    }
  }.bind(this));
  runAway.start();
};

UnitActions.prototype.act = function(action, targetUnit, afterAnimationCallback) {
  switch (action) {
  case 'Attack':
    this._attack(targetUnit, afterAnimationCallback);
    break;
  case 'MagicFire':
  case 'MagicFira':
  case 'MagicFera':
    this._castSpell(action, targetUnit, afterAnimationCallback);
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
