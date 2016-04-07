/* global GameConstants */

function CharacterData(role) {
  this.name = GameConstants.CHARACTER_NAMES[role];
  this.role = role;
  this.stats = this._getStats(role);
}

CharacterData.prototype._getStats = function(role) {
  var stats = {};
  GameConstants.CHARACTER_STATS.forEach(function(statName, index) {
    stats[statName] = GameConstants.INITIAL_CHARACTER_ROLE_STATS[role][index];
  });
  return stats;
};
