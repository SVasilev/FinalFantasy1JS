var MONSTER_STATS = [
'experience', // Amount of experience gained by winning.
'gil', // Amount of gold gained by winning.
'maxHitPoints', // Monster's Max HP.
'hitPoints', // Monster's current HP.
'spells', // Spells and abilities monster can cast.
'agility', // Ability to avoid hits.
'defense', // Physical Defense.
'strength', // Effects damage monster can do.
'hitChance', // Likelihood of monster scoring a hit.
'hitTimes', // Number of times monster can score a hit.
'courage' //  Likelihood of monster running.

// Decommited stats for monster for this release.
// 'maxMagicPoints', // Monster's Max MP.
// 'magicPoints', // Monster's current MP.
// 'criticalChance', // Likelihood of monster scoring Critical Hit.
// 'attackStatusEffect', // Status Effect caused by attack.
// 'statusChangeChance', // Likelihood of monster causing effect.
// 'category', // Type of creature.
// 'weakness', // Elements monster is weak to.
// 'resistance' // Elements with little or no effect.
];


function Monster(sprite) {
  this.sprite = sprite;
}

Monster.prototype.act = function(action) {

};