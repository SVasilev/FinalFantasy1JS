/* global GameConstants, _ */

function BattleUnits(config, phaserGame) {
  this.config = config;
  this.onCancel = null; // On canceling choice callback.
  this.phaserGame = phaserGame;

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
  var cursorIndexUponActivation = this._unitsGroup.cursorIndex;
  this.phaserGame.input.keyboard.onUpCallback = function(event) {
    if (!this._cursorSprite.visible) {
      return;
    }

    var unitsGroupArray = this._unitsGroup.children;
    var cursorIndex = this._unitsGroup.cursorIndex;
    var pressedKey = GameConstants.KEY_CODES_MAPPING[event.keyCode];
    switch (pressedKey) {
      case 'enter':
        this._cursorSprite.visible = false;
        this._onSelectCallback(unitsGroupArray[cursorIndex]);
        break;
      case 'escape':
        this._unitsGroup.cursorIndex = cursorIndexUponActivation;
        this.onCancel && this.onCancel();
        break;
      case 'left':
      case 'up':
      case 'right':
      case 'down':
        if (this.config.isParty && _.contains(['left', 'right'], pressedKey)) {
          return;
        }

        var directionValue = { 'left': -3, 'right': 3, 'up': -1, 'down': 1 };
        var selectedUnit = unitsGroupArray[cursorIndex + directionValue[pressedKey]];
        if (selectedUnit && !selectedUnit.alive) { // Check for the next or previous alive unit.
          var findNextUnit = _.contains(['right', 'down'], pressedKey);
          selectedUnit = this.getAliveUnit(findNextUnit ? 'next' : 'previous');
        }
        selectedUnit && this._setCursorToUnit(selectedUnit.z);
        break;
    }
  }.bind(this);
};

BattleUnits.prototype._setCursorToUnit = function(index) {
  var unit = this._unitsGroup.children[index] || { x: 0, y: 0 };
  this._unitsGroup.cursorIndex = index;
  this._cursorSprite.x = this._unitsGroup.x + unit.x - this._cursorSprite.width;
  this._cursorSprite.y = this._unitsGroup.y + unit.y + this._cursorSprite.height;
};

BattleUnits.prototype.resetCursor = function() {
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

BattleUnits.prototype.getAliveUnit = function(orientation) {
  var startIndex = this._unitsGroup.cursorIndex;
  var characters = this._unitsGroup.filter(function(child, index) {
    if (!child.alive) {
      return false;
    }
    return orientation === 'next' ? index > startIndex : index < startIndex;
  }, true);
  return orientation === 'next' ? characters.first : characters.list[characters.total - 1];
};

BattleUnits.prototype.resetUnitPositions = function() {
  this._unitsGroup.children.forEach(function(unitSprite, index) {
    this._setUnitPosition(unitSprite, index);
  }, this);
};

BattleUnits.prototype.addUnit = function(unitSprite) {
  if (this._unitsGroup.length === GameConstants.MAX_ENEMIES_IN_BATTLE) {
    return;
  }

  this._setUnitPosition(unitSprite, this._unitsGroup.length);
  unitSprite.events.onKilled.add(function() {
    this.resetCursor();
  }, this);

  this._unitsGroup.add(unitSprite);
};

BattleUnits.prototype.activate = function(action, onSelectCallback) {
  this._cursorSprite.visible = action;
  this._onSelectCallback = onSelectCallback;
  action && this._attachKeyPressEvents();
  action && this.resetCursor();
};

BattleUnits.prototype.getUnitsGroup = function() {
  return this._unitsGroup;
};

BattleUnits.prototype.getCursorSprite = function() {
  return this._cursorSprite;
};

BattleUnits.prototype.getFirstAlive = function() {
  return this._unitsGroup.getFirstAlive();
};

BattleUnits.prototype.destroy = function() {
  this._cursorSprite.destroy();
  this._unitsGroup.destroy();
};
