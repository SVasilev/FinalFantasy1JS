/* global GameConstants */

function BattleUnits(config, phaserGame) {
  this.config = config;
  this.phaserGame = phaserGame;

  this._unitCount = 0;
  this._unitsGroup = null;
  this._cursorSprite = null;
  this._onSelectCallback = null;
  this._init();
}

BattleUnits.prototype._init = function() {
  this._unitsGroup = this.phaserGame.add.group();
  this._unitsGroup.x = this.config.x;
  this._unitsGroup.y = this.config.y;

  this._cursorSprite = this.phaserGame.add.sprite(0, 0, this.config.cursorSpriteKey);
  this._setCursorToUnit(0);
  this._attachKeyPressEvents();
  this.activate(false);
};

BattleUnits.prototype._attachKeyPressEvents = function() {
  this.phaserGame.input.keyboard.onUpCallback = function(event) {
    if (!this._cursorSprite.visible) {
      return;
    }

    var unitsGroupArray = this._unitsGroup.children;
    var cursorIndex = this._unitsGroup.cursorIndex;
    var pressedKey = event.keyIdentifier.toLowerCase();
    if (pressedKey === 'enter') {
      this._cursorSprite.visible = false;
      this._onSelectCallback(unitsGroupArray[cursorIndex]);
      return;
    }

    var directionValue = this.config.isParty ?
      { 'left': -0, 'right': 0, 'up': -1, 'down': 1 } :
      { 'left': -3, 'right': 3, 'up': -1, 'down': 1 };
    var selectedUnit = unitsGroupArray[cursorIndex + directionValue[pressedKey]];
    if (selectedUnit && !selectedUnit.alive) { // Check if the next unit in the row/column is alive.
      directionValue = { 'left': -6, 'right': 6, 'up': -2, 'down': 2 };
      selectedUnit = unitsGroupArray[cursorIndex + directionValue[pressedKey]];
    }

    if (selectedUnit && selectedUnit.alive) {
      this._setCursorToUnit(cursorIndex + directionValue[pressedKey]);
    }
  }.bind(this);
};

BattleUnits.prototype._setCursorToUnit = function(index) {
  var unit = this._unitsGroup.children[index] || { x: 0, y: 0 };
  this._unitsGroup.cursorIndex = index;
  this._cursorSprite.x = this._unitsGroup.x + unit.x - this._cursorSprite.width;
  this._cursorSprite.y = this._unitsGroup.y + unit.y + this._cursorSprite.height;
};

BattleUnits.prototype._resetCursor = function() {
  var firstAliveUnit = this._unitsGroup.getFirstAlive();
  this._unitsGroup.cursorIndex = this._unitsGroup.getIndex(firstAliveUnit);
  firstAliveUnit && this._setCursorToUnit(this._unitsGroup.cursorIndex);
};

BattleUnits.prototype._setUnitPosition = function(unitSprite, unitIndex) {
  var x = this.config.padding;
  var y = this.config.padding;
  var forthUnutX = this.config.isParty ? 0 : x;
  var forthUnitY = this.config.isParty ? y * 3 : 0;
  var currentX = { 0: 0, 1: 0, 2: 0, 3: forthUnutX, 4: x, 5: x, 6: x * 2, 7: x * 2, 8: x * 2 };
  var currentY = { 0: 0, 1: y, 2: y * 2, 3: forthUnitY, 4: y, 5: y * 2, 6: 0, 7: y, 8: y * 2 };
  unitSprite.x = currentX[unitIndex];
  unitSprite.y = currentY[unitIndex];
};

BattleUnits.prototype.resetUnitPositions = function() {
  this._unitsGroup.children.forEach(function(unitSprite, index) {
    this._setUnitPosition(unitSprite, index);
  }, this);
};

BattleUnits.prototype.addUnit = function(unitSprite) {
  if (this._unitCount === GameConstants.MAX_ENEMIES_IN_BATTLE) {
    return;
  }

  this._setUnitPosition(unitSprite, this._unitCount);
  unitSprite.events.onKilled.add(function() {
    this._resetCursor();
  }, this);

  this._unitsGroup.add(unitSprite);
  this._unitCount++;
};

BattleUnits.prototype.activate = function(action, onSelectCallback) {
  action && this._resetCursor();
  this._cursorSprite.visible = action;
  this._onSelectCallback = onSelectCallback;
  action && this._attachKeyPressEvents();
};

BattleUnits.prototype.getUnitsGroup = function() {
  return this._unitsGroup;
};

BattleUnits.prototype.nextAlive = function() {
  var unitsGroup = this._unitsGroup;
  for (var i = unitsGroup.cursorIndex + 1; i < unitsGroup.length; i++) {
    if (unitsGroup.children[i].alive) {
      unitsGroup.cursorIndex = i;
      return unitsGroup.children[i];
    }
  }
};

BattleUnits.prototype.getFirstAlive = function() {
  return this._unitsGroup.getFirstAlive();
};

BattleUnits.prototype.destroy = function() {
  this._cursorSprite.destroy();
  this._unitsGroup.destroy();
};
