/* global alert, Phaser, GameConstants, GameMenu, BattleGround */

function BattleScene(party, onBattleEndCallback, phaserGame) {
  this.party = party;
  this.onBattleEndCallback = onBattleEndCallback;
  this.phaserGame = phaserGame;

  this._menuAssetsKeys = {
    background: GameConstants.ASSETS_KEYS.MENU_BACKGROUND_IMG,
    cursor: GameConstants.ASSETS_KEYS.MENU_CURSOR_IMG
  };
  this._battleGround = new BattleGround(party, phaserGame);
  // this._turn = ['ai', 'player'][Math.round(Math.random())];
  this._turn = 'player';
  this._currentUnitOnTurn = this._battleUnitsOnTurn().getUnitsGroup().getFirstAlive();
  this._monsterList = null;
  this._battleMenu = null;
  this._characterList = null;

  this._init();
  this._repositionCharacters();
}

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
  this._battleGround.getPartyUnits().getUnitsGroup().children.forEach(function(character) {
    var stats = character.unitStats.stats;
    characterList.push(character.name + '\tHP: ' + stats.HP + '/' + stats.maxHP + '\tMP: ' + stats.MP + '/' + stats.maxMP);
  }, this);

  this._characterList = new GameMenu(this._menuAssetsKeys, characterList, menuConfig, this.phaserGame);
  this._characterList.enabled = false;
};

BattleScene.prototype._initBattleMenu = function() {
  this._onMenuSelect = function(menu, selectedOption) {
    var self = this;
    var currentUnitIndex = self._battleUnitsOnTurn().getUnitsGroup().cursorIndex;
    menu.enabled = false;
    switch (selectedOption) {
      case 'Attack':
        this._oppositeUnitsOnTurn().activate(true, function(unit) {
          self._currentUnitOnTurn.act('Attack', unit, function() {
            self._endUnitTurn();
          });
        });
        break;
      case 'Defend':
        this._currentUnitOnTurn.act(selectedOption, null, function() {
          self._endUnitTurn();
        });
        break;
      case 'ItemHP+':
      case 'ItemHP++':
      case 'ItemHP+++':
        menu.enabled = true;
        self.phaserGame.input.keyboard.onUpCallback({ keyCode: Phaser.KeyCode.ESC });
        this._battleUnitsOnTurn().activate(true, function(unit) {
          unit.act(selectedOption, unit, function() {
            self._battleUnitsOnTurn().getUnitsGroup().cursorIndex = currentUnitIndex;
            self._endUnitTurn();
          });
        });
        break;
      case 'MagicFire':
      case 'MagicFira':
      case 'MagicFera':
        var currentUnitRole = self._currentUnitOnTurn.role; // HERE WILL LIE A BUG IF IT IS THE AI TURN.
        menu.enabled = true;
        self.phaserGame.input.keyboard.onUpCallback({ keyCode: Phaser.KeyCode.ESC });
        if (currentUnitRole === 'warrior' || currentUnitRole === 'thief') {
          alert('Not enough MP!');
          break;
        }
        this._oppositeUnitsOnTurn().activate(true, function(monster) {
          self._currentUnitOnTurn.act(selectedOption, monster, function() {
            self._endUnitTurn();
          });
        });
        break;
      case 'Flee':
        self._currentUnitOnTurn.act(selectedOption, null, function(escaped) {
          if (escaped) {
            return self._endBattle();
          }
          self._battleUnitsOnTurn().getUnitsGroup().cursorIndex = currentUnitIndex;
          self._endUnitTurn();
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
  this._currentUnitOnTurn.unitStats.update();
  this._updateMonsterList();
  this._updateCharacterList();
  if (this._oppositeUnitsOnTurn().getUnitsGroup().countLiving() === 0) {
    return this._endBattle(this._turn === 'ai' ? 'lost' : 'won');
  }

  this._currentUnitOnTurn = this._battleUnitsOnTurn().getAliveUnit('next');
  var newIndex = this._battleUnitsOnTurn().getUnitsGroup().getIndex(this._currentUnitOnTurn);
  this._battleUnitsOnTurn().getUnitsGroup().cursorIndex = newIndex;
  if (!this._currentUnitOnTurn) {
    this._negateTurn();
    this._battleUnitsOnTurn().resetCursor();
    this._currentUnitOnTurn = this._battleUnitsOnTurn().getFirstAlive();
  }

  var aiTurn = this._turn !== 'player';
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
  var randomIndex = 3;//[0, 1, 2, 3][Math.round(Math.random() * 3)];

  setTimeout(function() {
    this._onMenuSelect(this._battleMenu, 'Attack');
    this._battleGround.getPartyUnits()._setCursorToUnit(randomIndex);
    this.phaserGame.input.keyboard.onUpCallback({ keyCode: Phaser.KeyCode.ENTER });
  }.bind(this), 500);
};

BattleScene.prototype._init = function() {
  this._battleGround.getPartyUnits().resetCursor();
  this._battleGround.getPartyUnits().onCancel =
  this._battleGround.getMonsterUnits().onCancel = function () {
    this._setMenuFocus(true);
  }.bind(this);
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
  outcome === 'won' && partyGroup.forEachAlive(function(character) {
    // Add exp for each character.
    character.animations.play('win', 4);
  });

  setTimeout(function() {
    partyGroup.forEachAlive(function(character) {
      character.animations.play('neutral');
    });
    this._destroyScene();
    this.onBattleEndCallback();
    // Do more stuff if outcome === 'lost'
  }.bind(this), 1500);
};
