/* global Phaser, GameMenu, BattleGround, _ */

function BattleScene(party, dbData, phaserGame) {
  this.party = party;
  this.dbData = dbData;
  this.phaserGame = phaserGame;
  this.turn = ['player', 'AI'][Math.round(Math.random())];

  this._randomizedMonsters = this._randomizeMonsters();
  this._battleGround = new BattleGround(party, this._randomizedMonsters, dbData, phaserGame);
  this._monsterList = null;
  this._battleMenu = null;
  this._characterList = null;

  this._init();
}

BattleScene.prototype._randomizeMonsterCountForGivenRange = function(range) {
  var rangeLength = parseInt(range.max) - parseInt(range.min) + 1;
  return Math.floor(Math.random() * rangeLength) + parseInt(range.min);
};

BattleScene.prototype._randomizeMonsters = function() {
  var possibleMonsterTypes = [];
  this.dbData.monsters.forEach(function(monsterType) {
    if (monsterType.location === 'Cornelia') {
      possibleMonsterTypes.push(monsterType);
    }
  }, this);

  var monsterCount = 0;
  var randomizedMonsters = {};
  possibleMonsterTypes.forEach(function(monsterType, index) {
    var shouldSpawn = Phaser.Utils.chanceRoll(monsterType.encounterchance);
    var countRange = _.object(['min', 'max'], monsterType.countrange.split('-'));
    var randomizedCount = this._randomizeMonsterCountForGivenRange(countRange);
    var countFromType = shouldSpawn ? randomizedCount : 0;

    // Do not let a battle with no monsters loaded.
    if (monsterCount === 0 && index === possibleMonsterTypes.length - 1) {
      countFromType = randomizedCount;
    }

    // Do not exceed the maximum count of monsters on the ground.
    var shouldAdd = countFromType && monsterCount + countFromType <= BattleUnits['MAX_UNIT_COUNT'];
    if (shouldAdd) {
      randomizedMonsters[monsterType.name] = {
        monster: monsterType,
        count: countFromType
      };
      monsterCount += countFromType;
    }
  }, this);

  return randomizedMonsters;
};

BattleScene.prototype._initMonsterList = function() {
  var menuConfig = {
    x: 0,
    y: this.phaserGame.height * 7.5 / 10,
    width: this.phaserGame.width * 3 / 10,
    height: this.phaserGame.height * 2.5 / 10,
    margin: 20,
    canBeClosed: false,
    noCursor: true,
  };
  var monsterList = {};
  Object.keys(this._randomizedMonsters).forEach(function(monsterName) {
    var monsterCountFromType = this._randomizedMonsters[monsterName].count;
    monsterList[monsterName + ' (' + monsterCountFromType + ')'] = null;
  }, this);

  this._monsterList = new GameMenu({ background: 'menuBackground', cursor: 'menuCursor' }, monsterList, menuConfig, this.phaserGame);
  this._monsterList.grayOutOptions();
  this._monsterList.enabled = false;
};

BattleScene.prototype._initBattleMenu = function() {
  var menuConfig = {
    x: this.phaserGame.width * 3 / 10,
    y: this.phaserGame.height * 7.5 / 10,
    width: this.phaserGame.width * 3 / 10,
    height: this.phaserGame.height * 2.5 / 10,
    margin: 15,
    cursorWidth: 35,
    cursorDistanceFromText: 15,
    canBeClosed: false
  };

  this._battleMenu = new GameMenu({ background: 'menuBackground', cursor: 'menuCursor' }, {
    'Attack': function() {
      alert('I am attacking');
    },
    'Defend': function() {
      alert('I am defending');
    },
    'Magic': {
      'Cure': function() {
        alert('Using cure');
      },
      'Cura': function() {
        alert('Using cura');
      }
    },
    'Item': function() {
      alert('I am using item');
    },
    'Flee': function() {
      alert('I am fleeing');
    }
  }, menuConfig, this.phaserGame);
};

BattleScene.prototype._initCharacterList = function() {
  var menuConfig = {
    x: this.phaserGame.width * 6 / 10,
    y: this.phaserGame.height * 7.5 / 10,
    width: this.phaserGame.width * 4 / 10,
    height: this.phaserGame.height * 2.5 / 10,
    margin: 20,
    canBeClosed: false,
    noCursor: true,
  };

  var characterList = {};
  Object.keys(this.party.characters).forEach(function(characterKey) {
    var character = this.party.characters[characterKey]
    var indent = character.role === 'warrior' ? '            ' : '          ';
    var text = character.name + indent + 'HP: ' + character.stats.hitPoints + '/' + character.stats.maxHitPoints +
                                indent + 'MP: ' + character.stats.magicPoints + '/' + character.stats.maxMagicPoints;
    characterList[text] = null;
  }, this);

  this._characterList = new GameMenu({ background: 'menuBackground', cursor: 'menuCursor' }, characterList, menuConfig, this.phaserGame);
  this._characterList.grayOutOptions();
  this._characterList.enabled = false;
};

BattleScene.prototype._init = function() {
  this._initMonsterList();
  this._initCharacterList();
  this._initBattleMenu();
};
