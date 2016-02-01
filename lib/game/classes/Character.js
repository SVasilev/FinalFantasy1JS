var CHARACTER_PROPERTIES = [
  'maxHitPoints', // This is your maximum HP.
  'hitPoints', // This is your current HP.
  'maxMagicPoints', // This is your maximum MP.
  'magicPoints', // This is your current MP.
  'level', // This is what level youre on. As your levels go up, so do your stats.
  'experience', // This is your current # of experience points.
  'expToNextLevel', // This is how many experience points you need to reach the next level.
  'strength', // This effects your damage rating.
  'agility', // This effects your evade rate.
  'intelligence', // This doesnt seem to do anything.
  'vitality', // This effects how much HP is gained at level up.
  'luck', // Luck Effects the ability to run. Doesnt work right on NES version.
  'damage', // This effects how much damage you deal.
  'hitRate', // % Hit Rate Accuracy, and it effects how many hits you do.
  'armor', // Armor This is your defense against physical attacks.
  'evadeChance' // % Evade Rate.
];

var CHARACTER_ROLE_STATS = {
  'warior':    [35, 35, 0,   0, 1, 0, 100, 5,  7, 1, 5, 70, 3,   1, 2, 1],
  'thief':     [30, 30, 0,   0, 1, 0, 110, 3, 10, 1, 3, 90, 2,   1, 1, 5],
  'whiteMage': [33, 33, 10, 10, 1, 0,  90, 1,  5, 5, 2, 75, 1, 0.5, 0, 2],
  'blackMage': [25, 25, 10, 10, 1, 0, 105, 2,  4, 6, 3, 78, 1, 0.5, 0, 2]
};

function Character(sprite, role) {
  this.sprite = sprite;
  this.role = role;
  this.stats = this._getStats(role);
};

Character.prototype._getStats = function(role) {
  var stats = {};
  CHARACTER_PROPERTIES.forEach(function(statName, index) {
    stats[statName] = CHARACTER_ROLE_STATS[role][index];
  });
  return stats;
};

Character.prototype.act = function(action) {
  var damageDealt = 0;
  return damageDealt;
};
