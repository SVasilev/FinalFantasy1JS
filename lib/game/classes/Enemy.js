var ENEMY_STATS = [
'experience', // Amount of experience gained by winning.
'gil', // Amount of gold gained by winning.
'maxHitPoints', // Enemy's Max HP.
'hitPoints', // Enemy's current HP.
'spells', // Spells and abilities enemy can cast.
'agility', // Ability to avoid hits.
'defense', // Physical Defense.
'strength', // Effects damage enemy can do.
'hitChance', // Likelihood of enemy scoring a hit.
'hitTimes', // Number of times enemy can score a hit.
'courage' //  Likelihood of enemy running.

// Decommited stats for enemy for this release.
// 'maxMagicPoints', // Enemy's Max MP.
// 'magicPoints', // Enemy's current MP.
// 'criticalChance', // Likelihood of enemy scoring Critical Hit.
// 'attackStatusEffect', // Status Effect caused by attack.
// 'statusChangeChance', // Likelihood of enemy causing effect.
// 'category', // Type of creature.
// 'weakness', // Elements enemy is weak to.
// 'resistance' // Elements with little or no effect.
];

function Enemy(sprite) {
  this.sprite = sprite;
}

Enemy.prototype.act = function(action) {

};