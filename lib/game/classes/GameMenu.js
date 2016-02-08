// This is an Utility which I can design for reuse and upload to github.

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

  var cursorSprite = this.phaserGame.add.sprite(
    this.config.x + this._margin, this.config.y + this._margin, this.spriteKeys.cursor
  );
  cursorSprite.width = this.config.cursorWidth;
  this._menuItems['cursor'] = cursorSprite;
  var cursorBoxWidth = cursorSprite.width + this.config.cursorDistanceFromText;

  var optionsGroup = this.phaserGame.add.group();
  optionsGroup.x = backgroundSprite.x + this._margin + cursorBoxWidth;
  optionsGroup.y = backgroundSprite.y + this._margin;

  var maxTextWidth = this.config.width - 2 * this._margin - cursorBoxWidth;
  Object.keys(this.options).forEach(function(optionText, index, options) {
    var child = this.phaserGame.add.text(0, index * 50, optionText, {
      font: 'bold 20pt Times New Roman',
      fill: 'rgb(150, 150, 100)'
    });
    child.width = Math.min(child.width, maxTextWidth);
    optionsGroup.add(child);
  }, this);

  optionsGroup.height = (menuHeight - this._margin * 2);
  this._menuItems['options'] = optionsGroup;
  this._highlightOption(this._currentOptionIndex);
};

GameMenu.prototype._highlightOption = function(childIndex) {
  var child = this._menuItems['options'].children[childIndex];
  var childrenCount = this._menuItems['options'].children.length - 1 || 1; // Don't divide by 0.
  var childrenBoxHeight = this._menuItems['background'].height - 2 * this._margin - child.height;
  var childY = this._menuItems['options'].y + childIndex * childrenBoxHeight / childrenCount;
  this._menuItems['cursor'].y = childY;

  this._menuItems['options'].children.forEach(function (child) {
    child.clearColors();
    child.addColor('rgb(150, 150, 100)');
  });
  child.addColor('rgb(255, 255, 255)', 0);
};

GameMenu.prototype._moveCursor = function(direction) {
  var addend = { 'up': -1, 'down': 1 };
  this._currentOptionIndex += addend[direction];
  this._currentOptionIndex = Math.max(0, this._currentOptionIndex);
  this._currentOptionIndex = Math.min(this._menuItems['options'].children.length - 1, this._currentOptionIndex);

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
        var choiceCallback = this.options[this._menuItems['options'].children[this._currentOptionIndex].text];
        if (typeof choiceCallback === 'object') { // Open submenu
          this.enabled = false;
          var subMenuConfig = _.clone(this.config);
          subMenuConfig.x += this.config.width;
          subMenuConfig.y -= 50;
          subMenuConfig.canBeClosed = true;
          subMenuConfig.onExit = function() {
            this.enabled = true;
            this._attachKeyPressEvents();
          }.bind(this);
          new GameMenu(this.spriteKeys, choiceCallback, subMenuConfig, this.phaserGame);
        }
        else {
          choiceCallback();
        }
        break;
      case escapeKey:
        if (this.config.canBeClosed) {
          this.config.onExit && this.config.onExit();
          this.visible(false);
        }
        break;
    }
  }.bind(this);
};

GameMenu.prototype.visible = function(action) {
  this.enabled = action;
  for (var menuItemKey in this._menuItems) {
    this._menuItems[menuItemKey].visible = action;
  }
};
