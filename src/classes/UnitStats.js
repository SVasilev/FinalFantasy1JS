/* global _, Phaser, GameConstants */

function UnitStats(stats) {
  this.stats = stats;
  this._coreStats = _.clone(stats);
  this._statusEffects = [];
}

// Increase "stat" by "percent"
UnitStats.prototype._mutateStat = function(stat, percent, remove) {
  percent = 1 + (remove ? 0 : (percent / 100));
  this.stats[stat] = Math.round(this._coreStats[stat] * percent);
};

UnitStats.prototype._updateSingleStat = function(statusName, removeStatusEffect) {
  var statusRule = _.find(GameConstants.STATUS_EFFECTS, { name: statusName });
  this._mutateStat(statusRule.statName, statusRule.updateBy, removeStatusEffect);
};

UnitStats.prototype._updateAllStats = function(removeStatusEffects) {
  this._statusEffects.forEach(function(effect) {
    this._updateSingleStat(effect.name, removeStatusEffects);
  }, this);
};

UnitStats.prototype.removeAllStatusEffects = function() {
  this._updateAllStats(true);
};

UnitStats.prototype.levelUp = function() {
  // var unitRole = this.stats.role;

  this._coreStats = _.extend({}, this._coreStats); // There should be rules for level up for each role.
  this.stats = _.clone(this._coreStats);
  this._updateAllStats();
};

UnitStats.prototype.addStatus = function(statusName) {
  this._statusEffects = _.reject(this._statusEffects, function(effect) {
    return effect.name === statusName; // !!!See if it starts with. For example def+ should be replaced with def++.
  });
  this._statusEffects.push(_.clone(_.find(GameConstants.STATUS_EFFECTS, { name: statusName })));
  this._updateSingleStat(statusName);
};

UnitStats.prototype.hasStatusEffect = function(statusEffectName) { // I don't know if I really have to expose this function. We'll see in the future.
  return !!_.find(this._statusEffects, { name: statusEffectName });
};

UnitStats.prototype.update = function() {
  // Update status effect duration and remove it if it has expired.
  this._statusEffects = _.reject(this._statusEffects, function(effect) {
    var shouldRemoveStatusEffect = --effect.duration === 0 || Phaser.Utils.chanceRoll(effect.recoveryChance);
    shouldRemoveStatusEffect && this._updateSingleStat(effect.name, true);
    return shouldRemoveStatusEffect;
  }, this);

  // Drain 5% life if the unit is infected with poison.
  var unitIsPoisoned = this.hasStatusEffect('poison');
  this.stats.HP -= unitIsPoisoned ? this._coreStats.HP * 1 / 20 : 0;
  this.stats.HP = this.stats.HP < 1 ? 1 : Math.round(this.stats.HP);
};
