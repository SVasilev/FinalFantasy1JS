function BattleUnits(config, onSelectCallback, phaserGame) {
  this.config = config;
  this.onSelectCallback = onSelectCallback;
  this.phaserGame = phaserGame;
  this.MAX_UNIT_COUNT = 9;

  this._unitCount = 0;
  this._cursorSprite = null;
  this._unitsGroup = null;
  this._init();
}

BattleUnits.prototype._init = function() {
  this._unitsGroup = this.phaserGame.add.group();
  this._unitsGroup.x = this.config.x;
  this._unitsGroup.y = this.config.y;

  alert(this._unitsGroup.cursorIndex);

  this._cursorSprite = this.phaserGame.add.sprite(0, 0, this.config.cursorSpriteKey);
  this._setCursorToUnit({ x: 0, y: 0 });
  this._attachKeyPressEvents();
  this.activate(false);
};

BattleUnits.prototype._attachKeyPressEvents = function() {
  this.phaserGame.input.keyboard.onUpCallback = function(event) {
    if (!this._cursorSprite.visible) {
      return;
    }

    var pressedKey = event.keyIdentifier.toLowerCase();
    if (pressedKey === 'enter') {
      this.onSelectCallback(this._unitsGroup.children[this._unitsGroup.cursorIndex]);
      return;
    }

    var directionValue = this.config.isParty ? { 'left': -0, 'right': 0, 'up': -1, 'down': 1 } :
                                               { 'left': -3, 'right': 3, 'up': -1, 'down': 1 };
    var selectedUnit = this._unitsGroup.children[this._unitsGroup.cursorIndex + directionValue[pressedKey]];
    if (selectedUnit.alive) {
      this._unitsGroup.cursorIndex += directionValue[pressedKey];
      this._setCursorToUnit(selectedUnit);
    }
  }.bind(this);
};

BattleUnits.prototype._setCursorToUnit = function(unit) {
  this._cursorSprite.x = this._unitsGroup.x + unit.x - this._cursorSprite.width;
  this._cursorSprite.y = this._unitsGroup.x + unit.y;
};

BattleUnits.prototype._resetCursor = function() {
  var firstAliveUnit = this._unitsGroup.getFirstAlive();
  this._unitsGroup.cursorIndex = this._unitsGroup.getIndex(firstAliveUnit);
  firstAliveUnit && this._setCursorToUnit(firstAliveUnit);
};

BattleUnits.prototype.addUnit = function(unitSprite) {
  if (this._unitCount === this.MAX_UNIT_COUNT) {
    return;
  }

  var padding = this.config.padding;
  var forthUnutX = this.config.isParty ? 0 : padding;
  var forthUnitY = this.config.isParty ? padding * 3 : 0;
  var currentX = { 0: 0, 1: 0, 2: 0, 3: forthUnutX, 4: padding, 5: padding, 6: padding * 2, 7: padding * 2, 8: padding * 2 };
  var currentY = { 0: 0, 1: padding, 2: padding * 2, 3: forthUnitY, 4: padding, 5: padding * 2, 6: 0, 7: padding, 8: padding * 2 };
  unitSprite.x = currentX[this._unitCount];
  unitSprite.y = currentY[this._unitCount];

  unitSprite.events.onKilled.add(function(sprite) {
    this._resetCursor();
  }, this);

  this._unitsGroup.add(unitSprite);
  this._unitCount++;
};

BattleUnits.prototype.activate = function(action) {
  this._cursorSprite.visible = action;
};

BattleUnits.prototype.getUnits = function() {
  return this._unitsGroup;
};
