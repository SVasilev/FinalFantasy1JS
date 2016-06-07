/* global _, Monster, GameConstants, BattleUnits */

function BattleGround(party, randomizedMonsters, phaserGame) {
  this.party = party;
  this.randomizedMonsters = randomizedMonsters;
  this.phaserGame = phaserGame;

  this._groundSprite = null;
  this._monsterUnits = null;
  this._partyUnits = null;
  this._init();
}

// Gets [Int, Int, Int, Int] and returns { x: Int, y: Int, width: Int, height: Int }
BattleGround.prototype._getContourFromText = function(text) {
  return _.object(['x', 'y', 'width', 'height'], text);
};

// Set battle background according to the tile on which the party is.
BattleGround.prototype._setBattleBackground = function() {
  this._groundSprite = this.phaserGame.add.sprite(
    0, 0, GameConstants.ASSETS_KEYS.BATTLE_BACKGROUNDS_ATLAS, this.party.currentTile()
  );

  var scaleX = this.phaserGame.width / this._groundSprite.width;
  var scaleY = this.phaserGame.height * 7.5 / 10 / this._groundSprite.height;
  this._groundSprite.scale.setTo(scaleX, scaleY);
};

BattleGround.prototype._addMonsters = function() {
  var monsterUnitsConfig = {
    x: this.phaserGame.width * 1 / 10,
    y: 50,
    padding: 170,
    cursorSpriteKey: GameConstants.ASSETS_KEYS.MENU_CURSOR_IMG
  };

  this._monsterUnits = new BattleUnits(monsterUnitsConfig, this.phaserGame);
  Object.keys(this.randomizedMonsters).forEach(function(monsterName) {
    var monsterData = this.randomizedMonsters[monsterName].monster;
    var monsterCountFromType = this.randomizedMonsters[monsterName].count;
    var contour = this._getContourFromText(monsterData.spritecoords);
    for (var i = 0; i < monsterCountFromType; i++) {
      var monsterSprite = new Monster(
        this.phaserGame, 0, 0, contour.width, contour.height,
        GameConstants.ASSETS_KEYS.MONSTERS_ATLAS, monsterData
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
