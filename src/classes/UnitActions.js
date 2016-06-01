/* global _, Phaser, Monster */

// Common unit functionallity used as Mixin in Character.js and Monster.js
function UnitActions() {}

UnitActions.prototype._adjustActedUnitsAnimations = function(targetUnit) {
  [this, targetUnit].forEach(function(actedUnit) {
    var animationToPlay = 'neutral';
    if (actedUnit.health < 1 / 10 * actedUnit.maxHealth) { // If unit is below 10% health.
      animationToPlay = actedUnit.alive ? 'exhaust' : 'dead';
    }

    actedUnit.animations.play(animationToPlay);
  });
};

UnitActions.prototype._waitAnimations = function(onAnimationComplete, targetUnit, willEscape) {
  typeof willEscape !== 'boolean' && this._adjustActedUnitsAnimations(targetUnit);
  var slowestTween = _.max(this.game.tweens.getAll(), function(tween) {
    // Sum the duration of all the chained tweens.
    return _.reduce(tween.timeline, function(accumolatedTime, event) {
      return accumolatedTime + event.duration;
    }, 0);
  });

  // If there is no tween or the tween we've found is not running (it has finished), return.
  var isDamageText = slowestTween.target instanceof Phaser.Text &&
                     slowestTween.target.fill.indexOf('rgb(250') === 0;
  if (!slowestTween || !slowestTween.isRunning || isDamageText) {
    return onAnimationComplete(willEscape);
  }
  // The tween which will finish last still runs, so attach the callback to it.
  slowestTween.onComplete.add(onAnimationComplete);
};

UnitActions.prototype._changeHealth = function(targetUnit, amount) {
  var functionName = amount < 0 ? 'damage' : 'heal';
  var absAmount = Math.abs(amount);

  // Deal damage or heal the unit.
  targetUnit[functionName](absAmount);

  // Animate the amount.
  var redColor = 'rgb(250, 20, 20)';
  var greenColor = 'rgb(23, 98, 20)';
  var textColor = amount < 0 ? redColor : greenColor;
  var amountText = this.game.add.text(targetUnit.world.x , targetUnit.world.y, absAmount, {
    font: 'bold 20pt Courier New',
    fill: textColor
  });
  var amountTextTween = this.game.add.tween(amountText);
  amountTextTween.to({ x: amountText.x, y: amountText.y - 50, alpha: 0 }, 800, 'Quart.easeOut');
  amountTextTween.onComplete.add(function() {
    amountText.destroy();
  });
  amountTextTween.start();
};

UnitActions.prototype._attack = function(targetUnit, onAnimationComplete) {
  var walkSpeed = this instanceof Monster ? 250 : 600;
  var goBackToPosition = this.game.add.tween(this).to({ x: this.x, y: this.y }, walkSpeed, 'Quart.easeOut');
  goBackToPosition.onComplete.add(function() {
    this.animations.stop();
    this.scale.x = this.scale.y;
    this._waitAnimations(onAnimationComplete, targetUnit);
  }, this);

  var attack = this.game.add.tween(targetUnit).to({ alpha: 0.2 }, 150, 'Quart.easeOut', false, 0, 0, true);
  attack.chain(goBackToPosition);
  attack.onComplete.add(function() {
    var damage = Math.max(123, this.stats.atk - targetUnit.stats.def);
    this._changeHealth(targetUnit, -damage);

    this.scale.x = this.scale.y * -1;
    this.animations.play('walk');
  }, this);

  this.animations.play('walk');
  var targetUnitX = this instanceof Monster ? targetUnit.world.x - targetUnit.width * 2 : -this.game.width * 3 / 10;
  var goToEnemy = this.game.add.tween(this);
  goToEnemy.to({ x: targetUnitX, y: targetUnit.y }, walkSpeed, 'Quart.easeOut');
  goToEnemy.chain(attack);
  goToEnemy.onComplete.add(function() {
    this.animations.play('neutral');
    targetUnit.animations.play('block');
  }, this);
  goToEnemy.start();
};

UnitActions.prototype._castSpell = function(magicName, targetUnit, onAnimationComplete) {
  var magicDamage = { 'MagicFire': 4, 'MagicFira': 5, 'MagicFera': 7 };
  var fireBall = this.game.add.sprite(this.world.x - this.width, this.world.y, 'spellSpriteSheet');

  var waitFireExplosion = this.game.add.tween(fireBall).to({ alpha: 0 }, 500);
  waitFireExplosion.onComplete.add(function() {
    fireBall.destroy();
    this._waitAnimations(onAnimationComplete, targetUnit);
  }, this);

  var targetCoords = { x: targetUnit.world.x + targetUnit.width, y: targetUnit.world.y - 20 };
  var spellCastTween = this.game.add.tween(fireBall).to(targetCoords, 500);
  spellCastTween.onComplete.add(function() {
    fireBall.animations.add('fire');
    fireBall.animations.play('fire', 10, true);
    this.stats.magicPoints -= magicDamage[magicName];
    this.stats.magicPoints = Math.max(0, this.stats.magicPoints);
    this._changeHealth(targetUnit, -magicDamage[magicName]);
  }, this);
  spellCastTween.chain(waitFireExplosion);
  spellCastTween.start();
};

UnitActions.prototype._useItem = function(itemName, targetUnit, onAnimationComplete) {
  var healAmount = (itemName.match(/\+/g) || []).length;
  this._changeHealth(targetUnit, healAmount * 5);
  this.game.tweens.update();
  this._waitAnimations(onAnimationComplete, targetUnit);
};

UnitActions.prototype._tryToEscape = function(targetUnit, onAnimationComplete) {
  var willEscape = Phaser.Utils.chanceRoll(50);

  var goBack = this.game.add.tween(this).to({ x: 0, y: this.y }, 1000, 'Quart.easeOut');
  goBack.onComplete.add(function() {
    this.animations.play('neutral');
    this._waitAnimations(onAnimationComplete, targetUnit, willEscape);
  }, this);

  this.scale.x = this.scale.y * -1;
  this.animations.play('walk');
  var runAway = this.game.add.tween(this).to({ x: this.x + 300, y: this.y }, 1500, 'Quart.easeOut');
  runAway.onComplete.add(function() {
    if (willEscape) {
      this.animations.play('neutral');
      this._waitAnimations(onAnimationComplete, targetUnit, willEscape);
    }
    else {
      this.scale.x = this.scale.y;
      goBack.start();
    }
  }, this);
  runAway.start();
};

UnitActions.prototype.act = function(action, targetUnit, onAnimationComplete) {
  switch (action) {
    case 'Attack':
      this._attack(targetUnit, onAnimationComplete);
      break;
    case 'MagicFire':
    case 'MagicFira':
    case 'MagicFera':
      this._castSpell(action, targetUnit, onAnimationComplete);
      break;
    case 'ItemHP+':
    case 'ItemHP++':
    case 'ItemHP+++':
      this._useItem(action, targetUnit, onAnimationComplete);
      break;
    case 'Flee':
      this._tryToEscape(targetUnit, onAnimationComplete);
      break;
  }
};
