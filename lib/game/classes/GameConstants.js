var GameConstants = { // eslint-disable-line no-unused-vars
  CHARACTER_NAMES: {
    'warrior': 'Arus',
    'thief': 'Wedge',
    'whiteMage': 'Jenica',
    'blackMage': 'Topapa'
  },

  CHARACTER_STATS: [
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
    'atk', // This effects how much damage you deal.
    'hitRate', // % Hit Rate Accuracy, and it effects how many hits you do.
    'def', // Armor This is your defense against physical attacks.
    'evadeChance' // % Evade Rate.
  ],

  INITIAL_CHARACTER_ROLE_STATS: {
    'warrior':   [35, 35, 0,   0, 1, 0, 100, 5,  7, 1, 5, 70, 5,   1, 2, 1],
    'thief':     [30, 30, 0,   0, 1, 0, 110, 3, 10, 1, 3, 90, 4,   1, 1, 5],
    'whiteMage': [33, 33, 10, 10, 1, 0,  90, 1,  5, 5, 2, 75, 2, 0.5, 0, 2],
    'blackMage': [25, 25, 10, 10, 1, 0, 105, 2,  4, 6, 3, 78, 1, 0.5, 0, 2]
  },

  MONSTER_STATS: [
    'experience', // Amount of experience gained by winning.
    'gil', // Amount of gold gained by winning.
    'maxHitPoints', // Monster's Max HP.
    'hitPoints', // Monster's current HP.
    'spells', // Spells and abilities monster can cast.
    'agility', // Ability to avoid hits.
    'def', // Physical Defense.
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
  ]
};