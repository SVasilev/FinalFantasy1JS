function BattleScene(party, battleMenu, dbData) {
  this.party = party;
  this.battleMenu = battleMenu;
  this.turn = ['player', 'AI'][Math.round(Math.random())];
  this.dbData = dbData;
}

BattleScene.prototype._randomizeEnemies = function() {

};
