function BattleScene(party, dbData, phaserGame) {
  this.party = party;
  this.dbData = dbData;
  this.phaserGame = phaserGame;
  this.turn = ['player', 'AI'][Math.round(Math.random())];

  this._monsterList = null;
  this._battleMenu = null;
  this._partyList = null;

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

BattleScene.prototype._initMonsterList = function() {
  var randomizedMonsters = this._randomizeMonsters();
  var menuConfig = {
    x: 0,
    y: this.phaserGame.height * 8 / 10,
    width: this.phaserGame.width * 3 / 10,
    height: this.phaserGame.height * 2 / 10,
    margin: 20,
    canBeClosed: false,
    noCursor: true,
  };
  var monsterListTextFields = {};
  Object.keys(randomizedMonsters).forEach(function(monsterName) {
    var monsterCountFromType = randomizedMonsters[monsterName].count;
    monsterListTextFields[monsterName + ' (' + monsterCountFromType + ')'] = null;
  });

  this._monsterList = new GameMenu({ background: 'menuBackground', cursor: 'menuCursor' }, monsterListTextFields, menuConfig, game);
  this._monsterList.grayOutOptions();
  this._monsterList.enabled = false;
};

BattleScene.prototype._init = function() {
  this._initMonsterList();
};
