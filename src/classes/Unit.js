/* global _, Phaser, Monster, UnitStats, GameConstants */

// Common unit functionallity which extends Phaser.Sprite and is used in Character.js and Monster.js
Unit.prototype = Object.create(Phaser.Sprite.prototype);
Unit.prototype.constructor = Unit;
function Unit(phaserGame, x, y, spriteKey, unitData, frame) {
  Phaser.Sprite.call(this, phaserGame, x, y, spriteKey, frame);

  this.name = unitData.name;
  this.unitStats = new UnitStats(phaserGame, unitData.stats, this);
  this.health = this.unitStats.stats.HP;
  this.maxHealth = this.unitStats.stats.maxHP;
  phaserGame.add.existing(this);
}

// Unit.prototype.kill = function() {
//   this.unitStats.removeAllStatusEffects();
//   Phaser.Sprite.kill.call(this);
// }

Unit.prototype._adjustActedUnitsAnimations = function(targetUnit) {
  [this, targetUnit].forEach(function(actedUnit) {
    var animationToPlay = 'neutral';
    if (actedUnit.health < 1 / 10 * actedUnit.maxHealth) { // If unit is below 10% health.
      animationToPlay = actedUnit.alive ? 'exhaust' : 'dead';
    }

    actedUnit.animations.play(animationToPlay);
  });
};

Unit.prototype._waitAnimations = function(onAnimationComplete, targetUnit, willEscape) {
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

Unit.prototype._changeHealth = function(targetUnit, amount) {
  var functionName = amount < 0 ? 'damage' : 'heal';
  var absAmount = Math.abs(amount);

  // Deal damage or heal the unit.
  targetUnit[functionName](absAmount);
  targetUnit.unitStats.stats.HP = targetUnit.health;

  // Animate the amount.
  var redColor = 'rgb(250, 20, 20)';
  var greenColor = 'rgb(23, 98, 20)';
  var textColor = amount < 0 ? redColor : greenColor; // Not really, if someone attacks and deals 0 dmg, the text "0" will be green.
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

Unit.prototype._attack = function(targetUnit, onAnimationComplete) {
  var unitIsMonster = this instanceof Monster;
  var walkSpeed = unitIsMonster ? 250 : 600;
  var goBackToPosition = this.game.add.tween(this).to({ x: this.x, y: this.y }, walkSpeed, 'Quart.easeOut');
  goBackToPosition.onComplete.add(function() {
    this.animations.stop();
    this.scale.x = this.scale.y;
    this._waitAnimations(onAnimationComplete, targetUnit);
  }, this);

  var attack = this.game.add.tween(targetUnit).to({ alpha: 0.2 }, 150, 'Quart.easeOut', false, 0, 0, true);
  attack.chain(goBackToPosition);
  attack.onComplete.add(function() {
    var unitStats = this.unitStats.stats;
    var hitRateForClass = { 'warrior': 2, 'thief': 3, 'whiteMage': 1, 'blackMage': 1 };
    var hitRate = unitIsMonster ? unitStats.lvl * 5 : unitStats.hitRate + hitRateForClass[this.role] * (unitStats.lvl - 1);
    var numberOfHits = Math.floor(hitRate / 32) + 1;
    var damage = Math.max(1, _.range(numberOfHits).reduce(function(previous) {
      // Do not consider critical hits for now, since the AI engine will become harder.
      return previous + Math.floor(unitStats.str / 2) - targetUnit.unitStats.stats.def;
    }, 0), 1);
    this._changeHealth(targetUnit, -damage);

    this.scale.x = this.scale.y * -1;
    this.animations.play('walk');
  }, this);

  this.animations.play('walk');
  var targetUnitX = unitIsMonster ? targetUnit.world.x - targetUnit.width * 2 : -this.game.width * 3 / 10;
  var goToEnemy = this.game.add.tween(this);
  goToEnemy.to({ x: targetUnitX, y: targetUnit.y }, walkSpeed, 'Quart.easeOut');
  goToEnemy.chain(attack);
  goToEnemy.onComplete.add(function() {
    this.animations.play('neutral');
    targetUnit.animations.play('block');
  }, this);
  goToEnemy.start();
};

Unit.prototype._defend = function(onAnimationComplete) {
  this.unitStats.addStatusEffect(GameConstants.STATUS_DEF1);
  onAnimationComplete();
};

Unit.prototype._castSpell = function(magicName, targetUnit, onAnimationComplete) {
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
    this.unitStats.stats.MP -= magicDamage[magicName];
    this.unitStats.stats.MP = Math.max(0, this.unitStats.stats.MP);
    this._changeHealth(targetUnit, -magicDamage[magicName]);
  }, this);
  spellCastTween.chain(waitFireExplosion);
  spellCastTween.start();
};

Unit.prototype._useItem = function(itemName, targetUnit, onAnimationComplete) {
  var healAmount = (itemName.match(/\+/g) || []).length;
  this._changeHealth(targetUnit, healAmount * 5);
  this.game.tweens.update();
  this._waitAnimations(onAnimationComplete, targetUnit);
};

Unit.prototype._tryToEscape = function(targetUnit, onAnimationComplete) {
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

Unit.prototype.act = function(action, targetUnit, onAnimationComplete) {
  switch (action) {
    case 'Attack':
      this._attack(targetUnit, onAnimationComplete);
      break;
    case 'Defend':
      this._defend(onAnimationComplete);
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
