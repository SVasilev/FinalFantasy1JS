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

UnitStats.prototype.hasStatusEffect = function(statusEffectName) { // I don't know if I really have to expose this function. We'll see in the future.
  return !!_.find(this._statusEffects, { name: statusEffectName });
};

UnitStats.prototype.update = function() {
  // Update status effect duration and remove it if it has expired.
  this._statusEffects = _.reject(this._statusEffects, function(effect) {
    var shouldRemoveStatusEffect = --effect.duration === 0 || Phaser.Utils.chanceRoll(effect.recoveryChance);
    shouldRemoveStatusEffect && this._applySingleStat(effect.name, true);
    return shouldRemoveStatusEffect;
  }, this);

  // Drain 5% life if the unit is infected with poison.
  var unitIsPoisoned = this.hasStatusEffect('poison');
  this.stats.HP -= unitIsPoisoned ? this._coreStats.HP * 1 / 20 : 0;
  this.stats.HP = this.stats.HP < 1 ? 1 : Math.round(this.stats.HP);
  this._unit.health = this.stats.HP;

  // Find the last animation key for the status effect (if exists).
  var effectSpriteKey = '';
  _.forEach(this._statusEffects, function(effect) {
    if (_.includes(GameConstants.STATUS_EFFECTS_WITH_IMAGES, effect.name)) {
      effectSpriteKey = effect.name;
    }
  });

  if (effectSpriteKey) {
    if (!this._statuseffectSprite) { // Register status effect sprite and animations if it does not already exist.
      this._statuseffectSprite = this.phaserGame.add.sprite( // This should probably be this._unit.addChild(...), because the image has to follow the player
        this._unit.parent.x + this._unit.width, this._unit.parent.y + this._unit.y, 'statuseffects'
      );
      GameConstants.STATUS_EFFECTS_WITH_IMAGES.forEach(function(statusEffectName, index) {
        this._statuseffectSprite.animations.add(statusEffectName, [index * 2, index * 2 + 1]);
      }, this);
    }
    // Render the status effect image (if exists) in top right conrer of the unit.
    this._statuseffectSprite.animations.play(effectSpriteKey, 2, true);
  }

  if (!effectSpriteKey && this._statuseffectSprite) { // Remove sprite if status effect expired.
    this._statuseffectSprite.alpha = !this._statusEffects.length ? 0 : 1;
  }
};
