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

BattleScene.prototype._randomizeMonsters = function() {
  var possibleMonsterTypes = [];
  this.dbData.monsters.forEach(function(monsterType) {
    if (monsterType.location === 'Cornelia') {
      possibleMonsterTypes.push(monsterType);
    }
  }, this);

  var randomizedMonsters = {};
  possibleMonsterTypes.forEach(function(monsterType) {
    var addend = monsterType.name === 'Imp' ? 1 : 0;
    var monsterCountFromType = Math.round(Math.random() * 2) + addend;
    for (var i = 0; i < monsterCountFromType; i++) {
      randomizedMonsters[monsterType.name] = {
        monster: monsterType,
        count: monsterCountFromType
      };
    }
  });
  return randomizedMonsters;
};

BattleScene.prototype._initBattleGround= function() {

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

  this._monsterList = new GameMenu({ background: 'menuBackground', cursor: 'menuCursor' }, monsterList, menuConfig, game);
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
  this.party.characters.forEach(function(character) {
    var indent = character.role === 'warrior' ? '            ' : '          ';
    var text = character.name + indent + 'HP: ' + character.stats.hitPoints + '/' + character.stats.maxHitPoints +
                                indent + 'MP: ' + character.stats.magicPoints + '/' + character.stats.maxMagicPoints;
    characterList[text] = null;
  }, this);

  this._characterList = new GameMenu({ background: 'menuBackground', cursor: 'menuCursor' }, characterList, menuConfig, game);
  this._characterList.grayOutOptions();
  this._characterList.enabled = false;
};

BattleScene.prototype._init = function() {
  this._initBattleGround();
  this._initMonsterList();
  this._initCharacterList();
  this._initBattleMenu();
};
