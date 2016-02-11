/* global _ */

function BattleGround(party, randomizedMonsters, dbData, phaserGame) {
  this.party = party;
  this.randomizedMonsters = randomizedMonsters;
  this.dbData = dbData;
  this.phaserGame = phaserGame;

  this._init();
}

BattleGround.prototype._getContourFromText = function(text) {
  var coordinatesArray = text.split(',');
  return _.object(['x', 'y', 'width', 'height'], coordinatesArray);
};

// Set battle background according to the tile on which the party is.
BattleGround.prototype._setBattleBackground = function() {
  var battleGroundsObj = _.indexBy(this.dbData.battlebackgrounds, 'tile');
  var contour = this._getContourFromText(battleGroundsObj[this.party.currentTile()].spritecoords);
  var groundSprite = this.phaserGame.add.tileSprite(
    0, 0, contour.width, contour.height, 'battleBackgrounds'
  );

  var scaleX = this.phaserGame.width / contour.width;
  var scaleY = this.phaserGame.height * 7.5 / 10 / contour.height;
  groundSprite.tilePosition.x = 0 - contour.x;
  groundSprite.tilePosition.y = 0 - contour.y;
  groundSprite.scale.setTo(scaleX, scaleY);
};

BattleGround.prototype._init = function() {
  this._setBattleBackground();

  // Position monsters and the party.
  var monsterUnitsConfig = {
    x: 50,
    y: 50,
    padding: 170,
    // isParty: true,
    cursorSpriteKey: 'menuCursor'
  };

  function onMonsterClick(monster) {
    monster.destroy();
  }

  this._monsterUnits = new BattleUnits(monsterUnitsConfig, onMonsterClick, this.phaserGame);
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
