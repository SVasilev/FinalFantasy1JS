var GameConstants = { // eslint-disable-line no-unused-vars
  CHARACTER_NAMES: {
    'warrior': 'Arus',
    'thief': 'Wedge',
    'whiteMage': 'Jenica',
    'blackMage': 'Topapa'
  },

  CHARACTER_STATS: [
    'agi', // This effects your evade rate.
    'atk', // This effects how much damage you deal.
    'def', // Armor This is your defense against physical attacks.
    'str', // This effects your damage rating.
    'vit', // This effects how much HP is gained at level up.
    'int', // This doesnt seem to do anything.
    'lvl', // This is what level youre on. As your levels go up, so do your stats.
    'hitRate', // % Hit Rate Accuracy, and it effects how many hits you do.
    'luck', // Luck Effects the ability to run. Doesnt work right on NES version.
    'exp', // This is your current # of experience points.
    'expToNxtLvl', // This is how many experience points you need to reach the next level.
    'HP', // This is your current HP.
    'maxMP', // This is your maximum MP.
    'MP', // This is your current MP.
    'EVAS' // % Evade Rate.
  ],

  INITIAL_CHARACTER_ROLE_STATS: {
    'warrior':   [7,  5, 2, 5, 5, 1, 1, 1,   70, 0, 100, 35, 35, 0,  0,  1],
    'thief':     [10, 4, 1, 3, 3, 1, 1, 1,   90, 0, 110, 30, 30, 0,  0,  5],
    'whiteMage': [5,  2, 0, 1, 2, 5, 1, 0.5, 75, 0, 90,  33, 33, 10, 10, 2],
    'blackMage': [4,  1, 0, 2, 3, 6, 1, 0.5, 78, 0, 105, 25, 25, 10, 10, 2]
  },

  MONSTER_STATS: [
    'agi', // Ability to avoid hits.
    'atk', // This effects how much damage is dealt.
    'def', // Physical Defense.
    'str', // Effects damage monster can do.
    'int', // This doesnt seem to do anything.
    'hitRate', // % Hit Rate Accuracy, and it effects how many hits can be done.
    'luck', // Luck Effects the ability to run. Doesnt work right on NES version.
    'exp', // Amount of experience gained by winning.
    'HP', // Monster's current HP.
    'maxHP', // Monster's Max HP.
    'MP', // This is your current MP.
    'maxMP', // This is your maximum MP.
    'EVAS', // % Evade Rate.
    'gil', // Amount of gold gained by winning.
  ],

  // Interesting stats in the future:
  // 'spells', // Spells and abilities a unit can cast.
  // 'courage' //  Likelihood of monster running.
  // 'criticalChance', // Likelihood of unit scoring Critical Hit.
  // 'attackStatusEffect', // Status Effect caused by attack.
  // 'statusChangeChance', // Likelihood of monster causing effect.
  // 'category', // Type of creature.
  // 'weakness', // Elements unit is weak to.
  // 'resistance' // Elements with little or no effect.

  ASSETS_KEYS: {
    'FF1_LOGO': 'ff1logo',
    'PROGRESS_BAR': 'progressbar',
    'WORLDMAP': 'worldmap',
    'WORLDMAP_TILE_DATA': 'worldmapData',
    'WORLDMAP_PARTY_SPRITES_DATA': 'worldMapPartySpritesData',
    'IN_BATTLE_PARTY_SPRITES_DATA': 'inBattlePartySpritesData',
    'PARTY_DATA': 'partyData',
    'MENU_BACKGROUND': 'menuBackground',
    'MENU_CURSOR': 'menuCursor',
    'BATTLE_BACKGROUNDS': 'battleBackgrounds',
    'MONSTERS_SHEET': 'monsters'
  },

  MAX_ENEMIES_IN_BATTLE: 9
};