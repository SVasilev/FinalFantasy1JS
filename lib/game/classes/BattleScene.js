function BattleScene(party, menu) {
  this.party = party;
  this.menu = menu;
  this.turn = ['player', 'AI'][Math.round(Math.random())];
  this.enemies = [];
}

BattleScene.prototype._randomizeEnemies = function() {

};
