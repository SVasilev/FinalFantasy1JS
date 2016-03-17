/* global _, Monster, GameConstants, Character, BattleUnits */

function BattleGround(party, randomizedMonsters, dbData, phaserGame) {
  this.party = party;
  this.randomizedMonsters = randomizedMonsters;
  this.dbData = dbData;
  this.phaserGame = phaserGame;

  this._groundSprite = null;
  this._monsterUnits = null;
  this._partyUnits = null;
  this._init();
}

BattleGround.prototype._getContourFromText = function(text) {
  var coordinatesArray = text.split(',').map(function(value) {
    return parseInt(value);
  });
  return _.object(['x', 'y', 'width', 'height'], coordinatesArray);
};

// Set battle background according to the tile on which the party is.
BattleGround.prototype._setBattleBackground = function() {
  var battleGroundsObj = _.indexBy(this.dbData.battlebackgrounds, 'tile');
  var contour = this._getContourFromText(battleGroundsObj[this.party.currentTile()].spritecoords);
  this._groundSprite = this.phaserGame.add.tileSprite(
    0, 0, contour.width, contour.height, 'battleBackgrounds'
  );

  var scaleX = this.phaserGame.width / contour.width;
  var scaleY = this.phaserGame.height * 7.5 / 10 / contour.height;
  this._groundSprite.tilePosition.x = 0 - contour.x;
  this._groundSprite.tilePosition.y = 0 - contour.y;
  this._groundSprite.scale.setTo(scaleX, scaleY);
};

BattleGround.prototype._addMonsters = function() {
  var monsterUnitsConfig = {
    x: this.phaserGame.width * 1 / 10,
    y: 50,
    padding: 170,
    cursorSpriteKey: 'menuCursor'
  };

  this._monsterUnits = new BattleUnits(monsterUnitsConfig, this.phaserGame);
  Object.keys(this.randomizedMonsters).forEach(function(monsterName) {
    var monster = this.randomizedMonsters[monsterName].monster;
    var monsterCountFromType = this.randomizedMonsters[monsterName].count;
    var contour = this._getContourFromText(monster.spritecoords);
    for (var i = 0; i < monsterCountFromType; i++) {
      var monsterSprite = new Monster(this.phaserGame, 0, 0, contour.width, contour.height, 'monsters', monster);
      monsterSprite.tilePosition.x = 0 - contour.x;
      monsterSprite.tilePosition.y = 0 - contour.y;
      monsterSprite.scale.setTo(3, 3);
      this._monsterUnits.addUnit(monsterSprite);
    }
  }, this);
};

BattleGround.prototype._addParty = function() {
  var partyUnitsConfig = {
    x: this.phaserGame.width * 8 / 10,
    y: 40,
    padding: 130,
    isParty: true,
    cursorSpriteKey: 'menuCursor'
  };

  var charactersConfig = this.phaserGame.cache.getJSON('inBattlePartySpritesData');
  this._partyUnits = new BattleUnits(partyUnitsConfig, this.phaserGame);
  Object.keys(GameConstants.CHARACTER_NAMES).forEach(function(characterRole) {
    var characterConfig = charactersConfig[characterRole];
    var characterData = this.party.characters[characterRole];
    var characterSprite = new Character(this.phaserGame, 0, 0, characterRole, characterData, characterConfig);
    this._partyUnits.addUnit(characterSprite);
  }, this);
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
  this._partyUnits.destroy();
};
