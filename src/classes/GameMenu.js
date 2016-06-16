/* global _, GameConstants */

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
  this.config.font = this.config.font || {
    font: 'bold 20pt Courier New',
    fill: 'rgb(200, 200, 200)',
    tabs: 195
  };
  this.config.noCursor = this.options.length ? this.config.noCursor : true;
  this.config.canBeClosed = this.config.canBeClosed === undefined ? true : this.config.canBeClosed;
  this._margin = Math.max(this._margin, this.config.margin);
  var menuHeight = this.config.height || this.options.length * 40 + this._margin * 2;

  var backgroundSprite = this.phaserGame.add.sprite(
    this.config.x, this.config.y, this.spriteKeys.background
  );
  backgroundSprite.width = this.config.width;
  backgroundSprite.height = menuHeight;
  this._menuItems.background = backgroundSprite;

  var cursorBoxWidth = 0;
  if (!this.config.noCursor) {
    var cursorSprite = this.phaserGame.add.sprite(
      this.config.x + this._margin, this.config.y + this._margin, this.spriteKeys.cursor
    );
    cursorSprite.width = this.config.cursorWidth;
    this._menuItems.cursor = cursorSprite;
    cursorBoxWidth = cursorSprite.width + this.config.cursorDistanceFromText;
  }

  var optionsGroup = this.phaserGame.add.group();
  optionsGroup.x = backgroundSprite.x + this._margin + cursorBoxWidth;
  optionsGroup.y = backgroundSprite.y + this._margin;

  var maxTextWidth = this.config.width - 2 * this._margin - cursorBoxWidth;
  this.options.forEach(function(optionItem, index) {
    var optionText = optionItem;
    if (typeof optionItem === 'object') {
      optionText = Object.keys(optionItem)[0];
    }
    var phaserText = this.phaserGame.add.text(0, index * 50, optionText, this.config.font);
    phaserText.width = Math.min(phaserText.width, maxTextWidth);
    optionsGroup.add(phaserText);
  }, this);

  optionsGroup.height = Math.min(optionsGroup.height, (menuHeight - this._margin * 2));
  this._menuItems.options = optionsGroup;
  !this.config.noCursor && this._highlightOption(this._currentOptionIndex);
};

GameMenu.prototype._highlightOption = function(optionIndex) {
  var optionsGroup = this._menuItems.options;
  var backgroundSprite = this._menuItems.background;
  var phaserText = optionsGroup.getChildAt(optionIndex);
  var childrenCount = optionsGroup.length - 1 || 1; // Don't divide by 0.
  var childrenBoxHeight = backgroundSprite.height - 2 * this._margin - phaserText.height;
  var childY = optionsGroup.y + optionIndex * childrenBoxHeight / childrenCount;

  this._menuItems.cursor.y = childY;
  this.grayOutOptions();
  phaserText.alpha = 1;
};

GameMenu.prototype._moveCursor = function(direction) {
  var addend = { 'up': -1, 'down': 1 };
  var optionsArray = this._menuItems.options.children;

  this._currentOptionIndex += addend[direction];
  this._currentOptionIndex = Math.max(0, this._currentOptionIndex);
  this._currentOptionIndex = Math.min(optionsArray.length - 1, this._currentOptionIndex);

  this._highlightOption(this._currentOptionIndex);
};

GameMenu.prototype._resetCursor = function() {
  this._currentOptionIndex = 0;
  this._highlightOption(this._currentOptionIndex);
};

GameMenu.prototype._attachKeyPressEvents = function() {
  this.phaserGame.input.keyboard.onUpCallback = !this.config.noCursor && function(event) {
    if (!this.enabled) {
      return;
    }

    var pressedKey = GameConstants.KEY_CODES_MAPPING[event.keyCode];
    switch (pressedKey) {
      case 'up':
      case 'down':
        this._moveCursor(pressedKey);
        break;
      case 'enter':
        var optionText = this._menuItems.options.children[this._currentOptionIndex].text;
        var optionItem = _.find(this.options, function(item) {
          var submenuTextMatches = typeof item === 'object' && Object.keys(item)[0] === optionText;
          return item === optionText || submenuTextMatches;
        });
        if (typeof optionItem === 'string') {
          this.config.choiceCallback(this, (this.config._parent || '') + optionText);
        }
        else { // Open submenu
          this.enabled = false;
          this._menuItems.cursor.alpha /= 3;
          var subMenuConfig = _.extend(_.clone(this.config), {
            _parent: (this.config._parent || '') + optionText,
            x: this._menuItems.options.x + this._menuItems.options.width,
            y: this.config.y - 50,
            canBeClosed: true,
            onExit: function() {
              this.enabled = true;
              this._menuItems.cursor.alpha *= 3;
              this._attachKeyPressEvents();
            }.bind(this)
          });
          new GameMenu(
            this.spriteKeys, optionItem[Object.keys(optionItem)[0]], subMenuConfig, this.phaserGame
          );
        }
        break;
      case 'escape':
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
  this.enabled = this._menuItems.cursor.visible = action;
  action && this._attachKeyPressEvents();
};

GameMenu.prototype.hideCursor = function(action) {
  if (action) {
    this._menuItems.cursor.visible = false;
    this.grayOutOptions();
  }
  else {
    this._resetCursor();
  }
};

GameMenu.prototype.grayOutOptions = function() {
  this._menuItems.options.setAll('alpha', 0.35);
};

GameMenu.prototype.destroy = function() {
  Object.keys(this._menuItems).forEach(function(itemKey) {
    var phaserObject = this._menuItems[itemKey];
    phaserObject.destroy();
  }, this);
  this.phaserGame.input.keyboard.onUpCallback = null;
};
