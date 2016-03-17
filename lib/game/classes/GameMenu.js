/* global _ */

// This is an Utility which I can design for reuse and upload on github.
function GameMenu(spriteKeys, options, config, phaserGame) {
  this.enabled = true;
  this.spriteKeys = spriteKeys;
  this.options = options;
  this.config = config;
  this.phaserGame = phaserGame;

  this._menuItems = {};
  this._currentOptionIndex = 0;
  this._margin = 0;
  this._init();
  this._attachKeyPressEvents();
}

GameMenu.prototype._init = function() {
  this.config.canBeClosed = this.config.canBeClosed === undefined ? true : this.config.canBeClosed;
  this._margin = Math.max(this._margin, this.config.margin);
  var menuHeight = this.config.height || Object.keys(this.options).length * 40 + this._margin * 2;

  var backgroundSprite = this.phaserGame.add.sprite(
    this.config.x, this.config.y, this.spriteKeys.background
  );
  backgroundSprite.width = this.config.width;
  backgroundSprite.height = menuHeight;
  this._menuItems['background'] = backgroundSprite;

  var cursorBoxWidth = 0;
  if (!this.config.noCursor) {
    var cursorSprite = this.phaserGame.add.sprite(
      this.config.x + this._margin, this.config.y + this._margin, this.spriteKeys.cursor
    );
    cursorSprite.width = this.config.cursorWidth;
    this._menuItems['cursor'] = cursorSprite;
    cursorBoxWidth = cursorSprite.width + this.config.cursorDistanceFromText;
  }

  var optionsGroup = this.phaserGame.add.group();
  optionsGroup.x = backgroundSprite.x + this._margin + cursorBoxWidth;
  optionsGroup.y = backgroundSprite.y + this._margin;

  var maxTextWidth = this.config.width - 2 * this._margin - cursorBoxWidth;
  Object.keys(this.options).forEach(function(optionText, index) {
    var child = this.phaserGame.add.text(0, index * 50, optionText, {
      font: 'bold 20pt Courier New',
      fill: 'rgb(150, 150, 100)'
    });
    child.width = Math.min(child.width, maxTextWidth);
    optionsGroup.add(child);
  }, this);

  optionsGroup.height = (menuHeight - this._margin * 2);
  this._menuItems['options'] = optionsGroup;
  optionsGroup.length && this._highlightOption(this._currentOptionIndex);
};

GameMenu.prototype._highlightOption = function(childIndex) {
  var child = this._menuItems['options'].children[childIndex];
  if (!this.config.noCursor) {
    var childrenCount = this._menuItems['options'].children.length - 1 || 1; // Don't divide by 0.
    var childrenBoxHeight = this._menuItems['background'].height - 2 * this._margin - child.height;
    var childY = this._menuItems['options'].y + childIndex * childrenBoxHeight / childrenCount;
    this._menuItems['cursor'].y = childY;
  }

  this.grayOutOptions();
  child.addColor('rgb(255, 255, 255)', 0);
};

GameMenu.prototype._moveCursor = function(direction) {
  var addend = { 'up': -1, 'down': 1 };
  this._currentOptionIndex += addend[direction];
  this._currentOptionIndex = Math.max(0, this._currentOptionIndex);
  this._currentOptionIndex = Math.min(this._menuItems['options'].children.length - 1, this._currentOptionIndex);

  this._highlightOption(this._currentOptionIndex);
};

GameMenu.prototype._resetCursor = function() {
  this._currentOptionIndex = 0;
  this._highlightOption(this._currentOptionIndex);
};

GameMenu.prototype._attachKeyPressEvents = function() {
  this.phaserGame.input.keyboard.onUpCallback = function(event) {
    if (!this.enabled) {
      return;
    }

    var pressedKey = event.keyIdentifier.toLowerCase();
    var escapeKey = 'u+001b';
    switch (pressedKey) {
    case 'up':
    case 'down':
      this._moveCursor(pressedKey);
      break;
    case 'enter':
      var currentChoiceText = this._menuItems['options'].children[this._currentOptionIndex].text;
      var choiceCallback = this.options[currentChoiceText];
      if (typeof choiceCallback === 'function') {
        choiceCallback(this, (this.config._parent || '') + currentChoiceText);
      }
      else { // Open submenu
        this.enabled = false;
        var subMenuConfig = _.extend(_.clone(this.config), {
          _parent: (this.config._parent || '') + currentChoiceText,
          x: this.config.x + this.config.width,
          y: this.config.y - 50,
          canBeClosed: true,
          onExit: function() {
            this.enabled = true;
            this._attachKeyPressEvents();
          }.bind(this)
        });
        new GameMenu(this.spriteKeys, choiceCallback, subMenuConfig, this.phaserGame);
      }
      break;
    case escapeKey:
      if (this.config.canBeClosed) {
        this.destroy();
        this.config.onExit && this.config.onExit();
      }
      break;
    }
  }.bind(this);
};

GameMenu.prototype.visible = function(action, skipOne) {
  this.enabled = action;
  for (var menuItemKey in this._menuItems) {
    this._menuItems[menuItemKey].visible = action;
  }

  if (skipOne) {
    this.phaserGame.input.keyboard.onUpCallback = function() {
      this._attachKeyPressEvents();
    }.bind(this);
  } else {
    this.phaserGame.input.keyboard.onUpCallback = null;
    action && this._attachKeyPressEvents();
  }
};

GameMenu.prototype.activate = function(action) {
  this._menuItems['cursor'].visible = action;
  action && this._attachKeyPressEvents();
};

GameMenu.prototype.hideCursor = function(action) {
  if (action) {
    this._menuItems['cursor'].visible = false;
    this.grayOutOptions();
  }
  else {
    this._resetCursor();
  }
};

GameMenu.prototype.grayOutOptions = function() {
  this._menuItems['options'].children.forEach(function (child) {
    child.clearColors();
    child.addColor('rgb(150, 150, 100)');
  });
};

GameMenu.prototype.destroy = function() {
  Object.keys(this._menuItems).forEach(function(itemKey) {
    var phaserObject = this._menuItems[itemKey];
    phaserObject.destroy();
  }, this);
  this.phaserGame.input.keyboard.onUpCallback = null;
};
