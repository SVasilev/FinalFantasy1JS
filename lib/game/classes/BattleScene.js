/* global Phaser, BattleUnits, GameMenu, BattleGround, _ */

function BattleScene(party, dbData, onBattleEndCallback, phaserGame) {
  this.party = party;
  this.dbData = dbData;
  this.onBattleEndCallback = onBattleEndCallback;
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
    var shouldSpawn = index === 2;//Phaser.Utils.chanceRoll(monsterType.encounterchance);
    var countRange = _.object(['min', 'max'], monsterType.countrange.split('-'));
    var randomizedCount = 1;//this._randomizeMonsterCountForGivenRange(countRange);
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

BattleScene.prototype._updateMonsterList = function() {
  this._monsterList && this._monsterList.destroy();
  var menuConfig = {
    x: 0,
    y: this.phaserGame.height * 7.5 / 10,
    width: this.phaserGame.width * 3 / 10,
    height: this.phaserGame.height * 2.5 / 10,
    margin: 20,
    canBeClosed: false,
    noCursor: true,
  };

  var monsterCount = {};
  this._battleGround._monsterUnits.getUnits().forEachAlive(function(monster) {
    var monsterName = monster.stats.name;
    monsterCount[monsterName] = monsterCount[monsterName] ? ++monsterCount[monsterName] : 1;
  });

  var monsterList = {};
  Object.keys(monsterCount).forEach(function(monsterName) {
    var monsterCountFromType = monsterCount[monsterName];
    monsterList[monsterName + ' (' + monsterCountFromType + ')'] = null;
  }, this);

  this._monsterList = new GameMenu(
    { background: 'menuBackground', cursor: 'menuCursor' }, monsterList, menuConfig, this.phaserGame
  );
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
    var oppositeUnitGroup = this._battleGround[this._negateTurn()];
    switch (selectedOption) {
      case 'Attack':
        oppositeUnitGroup.activate(true, function(monster) {
          self._currentUnitOnTurn.act('Attack', monster, function() {
            self._endUnitTurn();
            menu.enabled = true;
          });
        });
        break;
      case 'Defend':
        self._endUnitTurn();
        menu.enabled = true;
      case 'Item':
        // this._battleGround[this._turn].activate(true, function(character) {
        //   self._endUnitTurn();
        //   menu.enabled = true;
        // });
        break;
      case 'MagicFire':
        var currentUnitRole = self._currentUnitOnTurn.characterData.role; // HERE WILL LIE A BUG IF IT IS THE AI TURN.
        menu.enabled = true;
        var escapeKey = 'u+001b';
        self.phaserGame.input.keyboard.onUpCallback({ keyIdentifier: escapeKey });
        if (currentUnitRole === 'warrior' || currentUnitRole === 'thief') {
          alert('Not enough MP!');
          return;
        }
        oppositeUnitGroup.activate(true, function(monster) {
          self._currentUnitOnTurn.act('MagicFire', monster, function() {
            self._endUnitTurn();
          });
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
      'Fire': this._onMenuSelect,
      'Fira': this._onMenuSelect,
      'Fera': this._onMenuSelect,
    },
    'Item': this._onMenuSelect,
    'Flee': this._onMenuSelect,
  }, menuConfig, this.phaserGame);
};

BattleScene.prototype._updateCharacterList = function() {
  this._characterList && this._characterList.destroy();
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
  this._battleGround._partyUnits.getUnits().children.forEach(function(character) {
    var characterData = character.characterData;
    var indent = characterData.role === 'warrior' ? '            ' : '          ';
    var text = characterData.name + indent + 'HP: ' + character.health + '/' + character.maxHealth +
                                    indent + 'MP: ' + characterData.stats.magicPoints + '/' + characterData.stats.maxMagicPoints;
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
  var functionToCall = 'nextAlive';
  var currentUnitGroup = this._battleGround[this._turn]._unitsGroup;
  var switchUnitGroupTurn = currentUnitGroup.cursorIndex === currentUnitGroup.children.length - 1;

  if (switchUnitGroupTurn) {
    this._turn = this._negateTurn();
    this._battleGround[this._turn]._resetCursor();
    functionToCall = 'getFirstAlive';
  }

  var aiTurn = this._turn !== '_partyUnits';
  this._currentUnitOnTurn = this._battleGround[this._turn][functionToCall]();
  // this._setMenuFocus(!aiTurn);
  this._updateMonsterList();
  this._updateCharacterList();

  // End game if necessary.
  if (!Object.keys(this._monsterList.options).length) {
    this._endBattle();
    return;
  }
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
  this._updateMonsterList();
  this._updateCharacterList();
  this._initBattleMenu();
};

BattleScene.prototype._destroyScene = function() {
  this._battleGround.destroy();
  this._monsterList.destroy();
  this._battleMenu.destroy();
  this._characterList.destroy();
};

BattleScene.prototype._endBattle = function() {
  this._battleGround._partyUnits.getUnits().children.forEach(function(character) {
    // character.animations.play('win'); BUG WITH ANIMATION FRAMES.
  });
  setTimeout(function() {
    this._battleGround._partyUnits.getUnits().children.forEach(function(character) {
      character.animations.play('walk');
      character.animations.stop();
    });
    this._destroyScene();
    this.onBattleEndCallback();
  }.bind(this), 2000);
};
