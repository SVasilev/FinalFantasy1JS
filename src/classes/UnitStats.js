/* global _, Phaser, GameConstants */

function UnitStats(stats, characterInstance) {
  this.stats = stats;
  this._characterInstance = characterInstance;
  this._coreStats = _.clone(stats);
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
  // var unitRole = this._characterInstance.role;

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
  this._characterInstance.health = this.stats.HP;
};
