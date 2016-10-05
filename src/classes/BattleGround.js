/* global _, Monster, GameConstants, BattleUnits, SYS_CONFIG, Phaser */

function BattleGround(party, phaserGame) {
  this.party = party;
  this.phaserGame = phaserGame;

  this._groundSprite = null;
  this._monsterUnits = null;
  this._partyUnits = null;
  this._init();
}

// Set battle background according to the tile on which the party is.
BattleGround.prototype._setBattleBackground = function() {
  this._groundSprite = this.phaserGame.add.sprite(
    0, 0, GameConstants.ASSETS_KEYS.BATTLE_BACKGROUNDS_ATLAS, this.party.currentTile()
  );

  var scaleX = this.phaserGame.width / this._groundSprite.width;
  var scaleY = this.phaserGame.height * 7.5 / 10 / this._groundSprite.height;
  this._groundSprite.scale.setTo(scaleX, scaleY);
};

BattleGround.prototype._randomizeMonsterCountForGivenRange = function(range) {
  var rangeLength = parseInt(range.max) - parseInt(range.min) + 1;
  return Math.floor(Math.random() * rangeLength) + parseInt(range.min);
};

BattleGround.prototype._randomizeMonsters = function() {
  var debug = SYS_CONFIG.BATTLE_DEBUG;
  var monsterTypes = 0;
  var monsterCount = 0;
  var monstersData = this.phaserGame.cache.getJSON(GameConstants.ASSETS_KEYS.MONSTERS_DATA_JSON);

  return monstersData.reduce(function(randomizedMonsters, monsterType, index) {
    var shouldSpawn = debug ? index === 48 : Phaser.Utils.chanceRoll(monsterType.encounterchance);
    var countRange = _.object(['min', 'max'], monsterType.countrange.split('-'));
    var randomizedCount = debug ? 1 : this._randomizeMonsterCountForGivenRange(countRange);
    var countFromType = shouldSpawn ? randomizedCount : 0;

    // Do not let a battle with no monsters loaded.
    if (monsterCount === 0 && index === monstersData.length - 1) {
      countFromType = randomizedCount;
    }

    // Add the monsterType if the maximum count of monsters and monster types
    // are not exceeded and monster location matches party's location.
    var maxTypesNotExceeded = monsterTypes < GameConstants.MAX_ENEMY_TYPES_IN_BATTLE;
    var maxCountNotExceeded = monsterCount + countFromType <= GameConstants.MAX_ENEMIES_IN_BATTLE;
    var monsterLocationMatch = monsterType.location === this.party.location;
    if (countFromType && maxTypesNotExceeded && maxCountNotExceeded && monsterLocationMatch) {
      randomizedMonsters[monsterType.name] = {
        monster: monsterType,
        count: countFromType
      };
      monsterCount += countFromType;
      monsterTypes++;
    }
    return randomizedMonsters;
  }.bind(this), {});
};

BattleGround.prototype._addMonsters = function() {
  var monsterUnitsConfig = {
    x: this.phaserGame.width * 1 / 10,
    y: 50,
    padding: 170,
    cursorSpriteKey: GameConstants.ASSETS_KEYS.MENU_CURSOR_IMG
  };

  this._monsterUnits = new BattleUnits(monsterUnitsConfig, this.phaserGame);
  var randomizedMonsters = this._randomizeMonsters();
  Object.keys(randomizedMonsters).forEach(function(monsterName) {
    var monsterData = randomizedMonsters[monsterName].monster;
    var monsterCountFromType = randomizedMonsters[monsterName].count;
    for (var i = 0; i < monsterCountFromType; i++) {
      var monsterSprite = new Monster(
        this.phaserGame, 0, 0, GameConstants.ASSETS_KEYS.MONSTERS_ATLAS, monsterData
      );
      monsterSprite.scale.setTo(3, 3);
      this._monsterUnits.addUnit(monsterSprite);
    }
  }, this);
};

BattleGround.prototype._addParty = function() {
  this._partyUnits = this.party.inBattleUnitGroup;
  var partyGroup = this._partyUnits.getUnitsGroup();

  // Fix sprites orientation if party member escaped the battle last time.
  partyGroup.forEach(function(character) {
    character.scale.x = character.scale.y;
  });

  partyGroup.setAll('visible', true);
  this.phaserGame.world.bringToTop(partyGroup);
  this.phaserGame.world.bringToTop(this._partyUnits.getCursorSprite());
};

BattleGround.prototype._init = function() {
  this._setBattleBackground();
  this._addMonsters();
  this._addParty();
};

BattleGround.prototype.getPartyUnits = function() {
  return this._partyUnits;
};

BattleGround.prototype.getMonsterUnits = function() {
  return this._monsterUnits;
};

BattleGround.prototype.destroy = function() {
  this._groundSprite.destroy();
  this._monsterUnits.destroy();
  this._partyUnits.getUnitsGroup().setAll('visible', false);
};
