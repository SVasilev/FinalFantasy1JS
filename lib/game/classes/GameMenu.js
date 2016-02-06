// This is an Utility which I can design for reuse and upload to github.

function GameMenu(spriteKeys, options, config, phaserGame) {
  this.enabled = false;
  this.spriteKeys = spriteKeys;
  this.options = options;
  this.config = config;
  this.phaserGame = phaserGame;

  this._cursorSprite = null;
  this._optionsGroup = null;
  this._currentOption = 0;
  this._margin = 0;
  this._init();
}

GameMenu.prototype._init = function() {
  this._margin = Math.max(this._margin, this.config.margin);

  var backgroundSprite = this.phaserGame.add.sprite(
    this.config.x, this.config.y, this.spriteKeys.background
  );
  backgroundSprite.width = this.config.width;
  backgroundSprite.height = this.config.height;

  this._cursorSprite = this.phaserGame.add.sprite(
    this.config.x + this._margin, this.config.y + this._margin, this.spriteKeys.cursor
  );
  this._cursorSprite.width = this.config.cursorWidth;
  var cursorBoxWidth = this._cursorSprite.width + this.config.cursorDistanceFromText;

  this._optionsGroup = this.phaserGame.add.group();
  this._optionsGroup.x = backgroundSprite.x + this._margin + cursorBoxWidth;
  this._optionsGroup.y = backgroundSprite.y + this._margin;

  var maxTextWidth = this.config.width - 2 * this._margin - cursorBoxWidth;
  Object.keys(this.options).forEach(function(optionText, index) {
    var child = this.phaserGame.add.text(0, index * 50, optionText, { font: 'bold 20pt Times New Roman', fill: 'rgb(150, 150, 100)' });
    child.width = Math.min(child.width, maxTextWidth);
    this._optionsGroup.add(child);
  }, this);

  this._optionsGroup.height = (this.config.height - this._margin * 2);
  this._highlightOption(this._currentOption);
};

GameMenu.prototype._highlightOption = function(childIndex) {
  var child = this._optionsGroup.children[childIndex];
  var childrenCount = this._optionsGroup.children.length - 1;
  var childrenBoxHeight = this.config.height - 2 * this._margin - child.height;
  var childY = this._optionsGroup.y + childIndex * childrenBoxHeight / childrenCount;

  this._cursorSprite.y = childY;
  child.addColor('rgb(255, 255, 255)', 0);
};
