function Character(sprite, role) {
  this.sprite = sprite;
  this.role = role;
  this.stats = this._getStats(role);
}

Character.prototype._getStats = function(role) {
  var stats = {};
  GameConstants.CHARACTER_STATS.forEach(function(statName, index) {
    stats[statName] = GameConstants.INITIAL_CHARACTER_ROLE_STATS[role][index];
  });
  return stats;
};

Character.prototype.act = function(action) {
  var damageDealt = 0;
  return damageDealt;
};
