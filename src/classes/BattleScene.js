/* global alert, SYS_CONFIG, Phaser, GameConstants, GameMenu, BattleGround, _ */

function BattleScene(party, onBattleEndCallback, phaserGame) {
  this.party = party;
  this.onBattleEndCallback = onBattleEndCallback;
  this.phaserGame = phaserGame;

  this._menuAssetsKeys = {
    background: GameConstants.ASSETS_KEYS.MENU_BACKGROUND_IMG,
    cursor: GameConstants.ASSETS_KEYS.MENU_CURSOR_IMG
  };
  this._randomizedMonsters = this._randomizeMonsters();
  this._battleGround = new BattleGround(party, this._randomizedMonsters, phaserGame);
  // this._turn = ['ai', 'player'][Math.round(Math.random())];
  this._turn = 'player';
  this._currentUnitOnTurn = this._battleUnitsOnTurn().getUnitsGroup().getFirstAlive();
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
  var monstersData = this.phaserGame.cache.getJSON(GameConstants.ASSETS_KEYS.MONSTERS_DATA_JSON);
  monstersData.forEach(function(monsterType) {
    if (monsterType.location === this.party.location) {
      possibleMonsterTypes.push(monsterType);
    }
  }, this);

  var debug = SYS_CONFIG.BATTLE_DEBUG;
  var monsterTypes = 0;
  var monsterCount = 0;
  var randomizedMonsters = {};
  possibleMonsterTypes.forEach(function(monsterType, index) {
    var shouldSpawn = debug ? index === 2 : Phaser.Utils.chanceRoll(monsterType.encounterchance);
    var countRange = _.object(['min', 'max'], monsterType.countrange.split('-'));
    var randomizedCount = debug ? 1 : this._randomizeMonsterCountForGivenRange(countRange);
    var countFromType = shouldSpawn ? randomizedCount : 0;

    // Do not let a battle with no monsters loaded.
    if (monsterCount === 0 && index === possibleMonsterTypes.length - 1) {
      countFromType = randomizedCount;
    }

    // Add the monsterType if the maximum count of monsters and monster types are not exceeded.
    var maxTypesNotExceeded = monsterTypes < GameConstants.MAX_ENEMY_TYPES_IN_BATTLE;
    var maxCountNotExceeded = monsterCount + countFromType <= GameConstants.MAX_ENEMIES_IN_BATTLE;
    if (countFromType && maxTypesNotExceeded && maxCountNotExceeded) {
      randomizedMonsters[monsterType.name] = {
        monster: monsterType,
        count: countFromType
      };
      monsterCount += countFromType;
      monsterTypes++;
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
    noCursor: true
  };

  var monsterCount = {};
  this._battleGround.getMonsterUnits().getUnitsGroup().forEachAlive(function(monster) {
    var monsterName = monster.name;
    monsterCount[monsterName] = monsterCount[monsterName] ? ++monsterCount[monsterName] : 1;
  });

  var monsterList = [];
  Object.keys(monsterCount).forEach(function(monsterName) {
    var monsterCountFromType = monsterCount[monsterName];
    monsterList.push(monsterName + ' (' + monsterCountFromType + ')');
  }, this);

  this._monsterList = new GameMenu(this._menuAssetsKeys, monsterList, menuConfig, this.phaserGame);
  this._monsterList.enabled = false;
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
    noCursor: true
  };

  var characterList = [];
  this._battleGround.getPartyUnits().getUnitsGroup().children.forEach(function(c) {
    characterList.push(c.name + '\tHP: ' + c.health + '/' + c.maxHealth + '\tMP: ' + c.stats.MP + '/' + c.stats.maxMP);
  }, this);

  this._characterList = new GameMenu(this._menuAssetsKeys, characterList, menuConfig, this.phaserGame);
  this._characterList.enabled = false;
};

BattleScene.prototype._initBattleMenu = function() {
  this._onMenuSelect = function(menu, selectedOption) {
    var escapeKey = 'u+001b';
    var self = this;
    var currentUnitIndex = self._battleUnitsOnTurn().getUnitsGroup().cursorIndex;
    var oppositeUnitGroup = this._oppositeUnitsOnTurn();
    menu.enabled = false;
    switch (selectedOption) {
      case 'Attack':
        oppositeUnitGroup.activate(true, function(unit) {
          self._currentUnitOnTurn.act('Attack', unit, function() {
            self._endUnitTurn();
            menu.enabled = true;
          });
        });
        break;
      case 'Defend':
        self._endUnitTurn();
        menu.enabled = true;
        break;
      case 'ItemHP+':
      case 'ItemHP++':
      case 'ItemHP+++':
        menu.enabled = true;
        self.phaserGame.input.keyboard.onUpCallback({ keyIdentifier: escapeKey });
        this._battleUnitsOnTurn().activate(true, function(unit) {
          unit.act(selectedOption, unit, function() {
            self._battleUnitsOnTurn().getUnitsGroup().cursorIndex = currentUnitIndex;
            self._endUnitTurn();
            menu.enabled = true;
          });
        });
        break;
      case 'MagicFire':
      case 'MagicFira':
      case 'MagicFera':
        var currentUnitRole = self._currentUnitOnTurn.role; // HERE WILL LIE A BUG IF IT IS THE AI TURN.
        menu.enabled = true;
        self.phaserGame.input.keyboard.onUpCallback({ keyIdentifier: escapeKey });
        if (currentUnitRole === 'warrior' || currentUnitRole === 'thief') {
          alert('Not enough MP!');
          break;
        }
        oppositeUnitGroup.activate(true, function(monster) {
          self._currentUnitOnTurn.act(selectedOption, monster, function() {
            self._endUnitTurn();
          });
        });
        break;
      case 'Flee':
        self._currentUnitOnTurn.act(selectedOption, null, function(escaped) {
          if (escaped) {
            self._endBattle();
            return;
          }
          self._battleUnitsOnTurn().getUnitsGroup().cursorIndex = currentUnitIndex;
          self._endUnitTurn();
          menu.enabled = true;
        });
        break;
      default:
        break;
    }
  }.bind(this);

  var menuConfig = {
    x: this.phaserGame.width * 3 / 10,
    y: this.phaserGame.height * 7.5 / 10,
    width: this.phaserGame.width * 3 / 10,
    height: this.phaserGame.height * 2.5 / 10,
    margin: 15,
    cursorWidth: 35,
    cursorDistanceFromText: 15,
    canBeClosed: false,
    choiceCallback: this._onMenuSelect
  };

  this._battleMenu = new GameMenu(
    this._menuAssetsKeys,
    ['Attack', 'Defend', { 'Magic': ['Fire', 'Fira', 'Fera'] }, { 'Item': ['HP+', 'HP++', 'HP+++'] }, 'Flee'],
    menuConfig, this.phaserGame
  );
};

BattleScene.prototype._repositionCharacters = function() {
  this._battleGround.getPartyUnits().resetUnitPositions();
  this._battleGround.getMonsterUnits().resetUnitPositions();

  var multiplier = { player: 1, ai: -1 };
  this._currentUnitOnTurn.x -= this._currentUnitOnTurn.width * multiplier[this._turn];
};

BattleScene.prototype._setMenuFocus = function(action) {
  this._battleGround.getMonsterUnits().activate(false);
  this._battleGround.getPartyUnits().activate(false);
  this._battleMenu.activate(action);
  this._battleMenu.hideCursor(!action);
};

BattleScene.prototype._negateTurn = function() {
  this._turn = this._turn === 'ai' ? 'player' : 'ai';
};

BattleScene.prototype._battleUnitsOnTurn = function() {
  return this._turn === 'ai' ? this._battleGround.getMonsterUnits() : this._battleGround.getPartyUnits();
};

BattleScene.prototype._oppositeUnitsOnTurn = function() {
  return this._turn === 'ai' ? this._battleGround.getPartyUnits() : this._battleGround.getMonsterUnits();
};

BattleScene.prototype._endUnitTurn = function() {
  if (this._oppositeUnitsOnTurn().getUnitsGroup().countLiving() === 0) {
    return this._endBattle(this._turn === 'ai' ? 'lost' : 'won');
  }

  this._currentUnitOnTurn = this._battleUnitsOnTurn().getAliveUnit('next');
  var newIndex = this._battleUnitsOnTurn().getUnitsGroup().getIndex(this._currentUnitOnTurn);
  this._battleUnitsOnTurn().getUnitsGroup().cursorIndex = newIndex;
  if (!this._currentUnitOnTurn) {
    this._negateTurn();
    this._battleUnitsOnTurn()._resetCursor();
    this._currentUnitOnTurn = this._battleUnitsOnTurn().getFirstAlive();
  }

  var aiTurn = this._turn !== 'player';
  // this._setMenuFocus(!aiTurn);
  this._updateMonsterList();
  this._updateCharacterList();

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
  var randomIndex = [0, 1, 2, 3][Math.round(Math.random() * 3)];

  setTimeout(function() {
    this._onMenuSelect(this._battleMenu, 'Attack');
    this._battleGround.getPartyUnits()._setCursorToUnit(randomIndex);
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

BattleScene.prototype._endBattle = function(outcome) {
  var partyGroup = this._battleGround.getPartyUnits().getUnitsGroup();
  outcome === 'won' && partyGroup.forEachAlive(function(characterSprite) {
    characterSprite.animations.play('win', 4);
  });

  setTimeout(function() {
    partyGroup.forEachAlive(function(characterSprite) {
      characterSprite.animations.play('neutral');
    });
    partyGroup.resetCursor();
    this._destroyScene();
    this.onBattleEndCallback();
    // Do more stuff if outcome === 'lost'
  }.bind(this), 1500);
};
