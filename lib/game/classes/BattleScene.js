/* global Phaser, BattleUnits, GameMenu, BattleGround, _ */

function BattleScene(party, dbData, phaserGame) {
  this.party = party;
  this.dbData = dbData;
  this.phaserGame = phaserGame;

  this._randomizedMonsters = this._randomizeMonsters();
  this._battleGround = new BattleGround(party, this._randomizedMonsters, dbData, phaserGame);
  // var turn = ['_monsterUnits', '_partyUnits'][Math.round(Math.random())];
  this._turn = '_partyUnits';
  this._currentUnitOnTurn = this._battleGround[this._turn]._unitsGroup.getFirstAlive();
  this._monsterList = null;
  this._battleMenu = null;
  this._characterList = null;

  this._init();
  this._repositionCharacters();
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

  this._onMenuSelect = function(menu, selectedOption) {
    menu.enabled = false;
    var self = this;
    var currentUnitsGroup = this._battleGround[this._negateTurn()];
    switch (selectedOption) {
      case 'Attack':
        currentUnitsGroup.activate(true, function(monster) {
          self._currentUnitOnTurn.act('attack', monster);
          self._endUnitTurn();
          menu.enabled = true;
        });
        break;

      default:
        break;
    }
  }.bind(this);

  this._battleMenu = new GameMenu({ background: 'menuBackground', cursor: 'menuCursor' }, {
    'Attack': this._onMenuSelect,
    'Defend': this._onMenuSelect,
    'Magic': {
      'Cure': this._onMenuSelect,
      'Cura': this._onMenuSelect,
    },
    'Item': this._onMenuSelect,
    'Flee': this._onMenuSelect,
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
    var character = this.party.characters[characterKey];
    var indent = character.role === 'warrior' ? '            ' : '          ';
    var text = character.name + indent + 'HP: ' + character.stats.hitPoints + '/' + character.stats.maxHitPoints +
                                indent + 'MP: ' + character.stats.magicPoints + '/' + character.stats.maxMagicPoints;
    characterList[text] = null;
  }, this);

  this._characterList = new GameMenu({ background: 'menuBackground', cursor: 'menuCursor' }, characterList, menuConfig, this.phaserGame);
  this._characterList.grayOutOptions();
  this._characterList.enabled = false;
};

BattleScene.prototype._repositionCharacters = function() {
  this._battleGround._partyUnits.resetUnitPositions();
  this._battleGround._monsterUnits.resetUnitPositions();

  var multiplier = { '_partyUnits': 1, _monsterUnits: -1 };
  this._currentUnitOnTurn.x -= this._currentUnitOnTurn.width * multiplier[this._turn];
};

BattleScene.prototype._setMenuFocus = function(action) {
  this._battleGround._monsterUnits.activate(false);
  this._battleGround._partyUnits.activate(false);
  this._battleMenu.activate(action);
  this._battleMenu.hideCursor(!action);
};

BattleScene.prototype._negateTurn = function() {
  return this._turn === '_monsterUnits' ? '_partyUnits' : '_monsterUnits';
};

BattleScene.prototype._endUnitTurn = function() {
  var functionToCall = 'next';
  var currentUnitGroup = this._battleGround[this._turn]._unitsGroup;
  var switchUnitGroupTurn = currentUnitGroup.cursorIndex === currentUnitGroup.children.length - 1;

  if (switchUnitGroupTurn) {
    this._turn = this._negateTurn();
    this._battleGround[this._turn]._resetCursor();
    functionToCall = 'getFirstAlive';
  }

  var aiTurn = this._turn !== '_partyUnits';
  this._currentUnitOnTurn = this._battleGround[this._turn]._unitsGroup[functionToCall]();
  // this._setMenuFocus(!aiTurn);
  this._repositionCharacters();
  // aiTurn && this._aiMove();
  var controlAI = false; // Only for development.
  if (controlAI) {
    this._setMenuFocus(true);
  }
  else {
    this._setMenuFocus(!aiTurn);
    aiTurn && this._aiMove();
  }
};

BattleScene.prototype._aiMove = function() {
  this._onMenuSelect(this._battleMenu, 'Attack');
  var randomIndex = [0, 1, 2, 3][Math.round(Math.random() * 3)];
  this._battleGround._partyUnits._setCursorToUnitWithIndex(randomIndex);
  setTimeout(function() {
    this.phaserGame.input.keyboard.onUpCallback({ keyIdentifier: 'enter' });
  }.bind(this), 500);
};

BattleScene.prototype._init = function() {
  this._initMonsterList();
  this._initCharacterList();
  this._initBattleMenu();
};
