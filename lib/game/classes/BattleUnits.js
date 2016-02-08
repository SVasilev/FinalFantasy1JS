function BattleUnits(config, phaserGame) {
  this.config = config;
  this.phaserGame = phaserGame;
  this.MAX_UNIT_COUNT = 9;

  this._cursorIndex = 0;
  this._unitCount = 0;
  this._cursorSprite = null;
  this._unitsGroup = null;
  this._init();
}

BattleUnits.prototype._init = function() {
  this._unitsGroup = this.phaserGame.add.group();
  this._unitsGroup.x = this.config.x;
  this._unitsGroup.y = this.config.y;

  this._cursorSprite = this.phaserGame.add.sprite(
    this._unitsGroup.x, this._unitsGroup.y, this.config.cursorSpriteKey
  );
  this._cursorSprite.x -= this._cursorSprite.width;
  this.activate(false);
  this._attachKeyPressEvents();
};

BattleUnits.prototype._attachKeyPressEvents = function() {
  this.phaserGame.input.keyboard.onUpCallback = function(event) {
    if (!this._cursorSprite.visible) {
      return;
    }

    var directionValue = { 'left': -3, 'right': 3, 'up': -1, 'down': 1 };
    var pressedKey = event.keyIdentifier.toLowerCase();
    var selectedUnit = this._unitsGroup.children[this._cursorIndex + directionValue[pressedKey]];
    if (selectedUnit) {
      this._cursorIndex += directionValue[pressedKey];
      this._cursorSprite.x = this._unitsGroup.x + selectedUnit.x - this._cursorSprite.width;
      this._cursorSprite.y = this._unitsGroup.x + selectedUnit.y;
    }
  }.bind(this);
};

BattleUnits.prototype.addUnit = function(unitSprite) {
  if (this._unitCount === this.MAX_UNIT_COUNT) {
    return;
  }

  var currentX = { 0: 0, 1: 0, 2: 0, 3: 150, 4: 150, 5: 150, 6: 300, 7: 300, 8: 300 };
  var currentY = { 0: 0, 1: 150, 2: 300, 3: 0, 4: 150, 5: 300, 6: 0, 7: 150, 8: 300 };

  unitSprite.x = currentX[this._unitCount];
  unitSprite.y = currentY[this._unitCount];
  this._unitsGroup.add(unitSprite);
  this._unitCount++;
};

BattleUnits.prototype.activate = function(action) {
  this._cursorSprite.visible = action;
};
