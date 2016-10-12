/* global _, Phaser, GameConstants */

function UnitStats(phaserGame, stats, unit) {
  this.phaserGame = phaserGame;
  this.stats = stats;
  this._unit = unit;

  this._coreStats = _.clone(stats);
  this._statuseffectSprite = null;
  this._statusEffects = [];
}

UnitStats.prototype._applySingleStat = function(statusName, removeStatusEffect) {
  var statusRule = _.find(GameConstants.STATUS_EFFECTS, { name: statusName });
  statusRule.effects.forEach(function(effect) { // Increase every affected stat by percent.
    var updateBy = Math.round(this._coreStats[effect.statName] * (1 + (effect.updateBy / 100)));
    this.stats[effect.statName] += updateBy * (removeStatusEffect ? -1 : 1);
  }, this);
};

UnitStats.prototype._applyAllStats = function(removeStatusEffects) {
  this._statusEffects.forEach(function(effect) {
    this._applySingleStat(effect.name, removeStatusEffects);
  }, this);
};

UnitStats.prototype._updateStatusEffectsDuration = function() {
  this._statusEffects = _.reject(this._statusEffects, function(effect) {
    var remove = --effect.duration === 0 || Phaser.Utils.chanceRoll(effect.recoveryChance);
    remove && this._applySingleStat(effect.name, remove);
    return remove;
  }, this);
};

UnitStats.prototype._applyPoisonRule = function() {
  var unitIsPoisoned = this.hasStatusEffect(GameConstants.STATUS_POISON);
  this.stats.HP -= unitIsPoisoned ? this._coreStats.HP * 1 / 20 : 0;
  this.stats.HP = this.stats.HP < 1 ? 1 : Math.round(this.stats.HP);
  this._unit.health = this.stats.HP;
};

UnitStats.prototype._findAnimationToPlayKey = function() {
  var effectSpriteKey = '';
  _.forEach(this._statusEffects, function(effect) {
    if (_.includes(GameConstants.STATUS_EFFECTS_WITH_IMAGES, effect.name)) {
      effectSpriteKey = effect.name;
    }
  });
  return effectSpriteKey;
};

UnitStats.prototype._createStatusEffectSpriteIfNeeded = function() {
  if (!this._statuseffectSprite) {
    this._statuseffectSprite = this.phaserGame.add.sprite(
      this._unit.width / this._unit.scale.x, 0, GameConstants.ASSETS_KEYS.STATUS_EFFECTS_IMG
    );
    this._statuseffectSprite.scale.setTo(1 / this._unit.scale.x, 1 / this._unit.scale.y);
    this._unit.addChild(this._statuseffectSprite); // Attach the status effect image as a child for the unit.

    var STATUS_ANIMATION_FRAMES = 2;
    GameConstants.STATUS_EFFECTS_WITH_IMAGES.forEach(function(statusEffectName, index) {
      this._statuseffectSprite.animations.add(
        statusEffectName, [index * STATUS_ANIMATION_FRAMES, index * STATUS_ANIMATION_FRAMES + 1]
      );
    }, this);
  }
};

UnitStats.prototype.removeAllStatusEffects = function() {
  this._applyAllStats(true);
};

UnitStats.prototype.levelUp = function() {
  // var unitRole = this._unit.role;

  this._coreStats = _.extend({}, this._coreStats); // There should be rules for level up for each role.
  this.stats = _.clone(this._coreStats);
  this._applyAllStats();
};

UnitStats.prototype.addStatusEffect = function(statusEffectName) {
  this._statusEffects = _.reject(this._statusEffects, function(effect) {
    effect.name === statusEffectName && this._applySingleStat(effect.name, true); // Neglect stat if duplicate.
    return effect.name === statusEffectName;
  }, this);

  this._statusEffects.push(_.clone(_.find(GameConstants.STATUS_EFFECTS, { name: statusEffectName })));
  this._applySingleStat(statusEffectName);
};

 // I don't know if I really have to expose this function. We'll see in the future.
UnitStats.prototype.hasStatusEffect = function(statusEffectName) {
  return !!_.find(this._statusEffects, { name: statusEffectName });
};

UnitStats.prototype.update = function() {
  // Update each status effect duration and remove status if it has expired.
  this._updateStatusEffectsDuration();

  // Drain 5% life if the unit is infected with poison.
  this._applyPoisonRule();

  // Find the last animation key for the status effect (if exists).
  var effectSpriteKey = this._findAnimationToPlayKey();
  if (effectSpriteKey) {
    // Register status effect sprite and animations if the player is affected for the first time.
    this._createStatusEffectSpriteIfNeeded();
    // Render the status effect image in top right conrer of the unit.
    this._statuseffectSprite.animations.play(effectSpriteKey, 2, true);
  }

  if (!effectSpriteKey && this._statuseffectSprite) { // Fade out the sprite if status effect expired.
    this._statuseffectSprite.alpha = !this._statusEffects.length ? 0 : 1;
  }
};
