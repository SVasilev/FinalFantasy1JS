/* global SYS_CONFIG, GameConstants, Phaser, World, Party, GameMenu, BattleScene, DbData, _, loginUtils */

function MainState() {}

MainState.prototype = {
  manageMenuOpenClose: function() {
    this.escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.escapeKey.menuIsOpen = false; // Attach custom property to Phaser.Key
    this.escapeKey.onUp.add(function(escapeKey) {
      if (escapeKey.menuIsOpen) {
        this.party.enabled = true;
        this.menu.visible(false);
        escapeKey.menuIsOpen = false;
      }
      else {
        this.party.enabled = false;
        this.menu.visible(true, true);
        escapeKey.menuIsOpen = true;
      }
    }, this);
  },

  createMainMenu: function() {
    var menuConfig = {
      x: this.game.width / 2 - 150,
      y: this.game.height / 2 - 100,
      width: 240,
      margin: 30,
      cursorWidth: 35,
      cursorDistanceFromText: 15,
      canBeClosed: true,
      onExit: function() {
        this.party.enabled = true;
      }.bind(this),
      choiceCallback: function(menu, optionText) {
        switch (optionText) {
          case 'Pause Game':
            // game.paused = true;
            break;
          case 'Save Game':
            loginUtils.saveGame({ x: this.world.sprite.tilePosition.x, y: this.world.sprite.tilePosition.y });
            break;
          case 'Load Game':
            var worldPosition = JSON.parse(loginUtils.loadGame());
            this.world.sprite.tilePosition.x = worldPosition.x;
            this.world.sprite.tilePosition.y = worldPosition.y;
            var escapeKey = 'u+001b';
            this.game.input.keyboard.onUpCallback({ keyIdentifier: escapeKey });
            break;
          case 'Exit':
            this.game.destroy();
            break;
        }
      }.bind(this)
    };

    var assetsKeys = GameConstants.ASSETS_KEYS;
    this.menu = new GameMenu(
      { background: assetsKeys.MENU_BACKGROUND, cursor: assetsKeys.MENU_CURSOR },
      ['Pause Game', 'Save Game', 'Load Game', 'Exit'], menuConfig, this.game
    );
    this.menu.visible(false);
    this.manageMenuOpenClose();
  },

  onBattleEncounter: function() {
    var phaserKeyboard = this.game.input.keyboard;
    phaserKeyboard.disabled = true;
    this.party.enabled = false;
    phaserKeyboard.removeKey(Phaser.Keyboard.ESC);
    var onBattleEndCallback = function() {
      this.menu.destroy();
      this.createMainMenu();
      this.party.enabled = true;
    }.bind(this);

    var FADE_TIME = 800;
    this.game.camera.fade(0xffffff, FADE_TIME);
    setTimeout(function() {
      this.game.camera.resetFX();
      new BattleScene(this.party, this.dbData, onBattleEndCallback, this.game);
    }.bind(this), FADE_TIME * 2); // To make the white screen stay longer.
  },

  preload: function() {
    var partySpriteData = _.extend(
      this.game.cache.getJSON(GameConstants.ASSETS_KEYS.WORLDMAP_PARTY_SPRITES_DATA),
      this.game.cache.getJSON(GameConstants.ASSETS_KEYS.IN_BATTLE_PARTY_SPRITES_DATA)
    );
    Object.keys(partySpriteData).forEach(function(key) {
      var spriteData = partySpriteData[key];
      this.game.load.spritesheet(
        key, spriteData.path, spriteData.frameWidth, spriteData.frameHeight
      );
    });
  },

  create: function() {
    this.dbData = new DbData(); // Load data from tha database.
    this.world = new World(this.game);
    this.party = new Party(this.world, this.game);

    this.cursorKeys = this.game.input.keyboard.createCursorKeys();
    this.createMainMenu();
  },

  update: function() {
    var PARTY_MOVE_PIXELS = 1.5;

    // Move the party if a key is pressed.
    var lastKey = this.game.input.keyboard.lastKey;
    var acceptedDirections = { 'left': true, 'right': true, 'up': true, 'down': true };
    var direction = lastKey && lastKey.event && lastKey.event.keyIdentifier.toLowerCase();
    if (acceptedDirections[direction] && this.cursorKeys[direction].isDown && this.party.enabled) {
      this.party.move(direction, PARTY_MOVE_PIXELS, this.onBattleEncounter.bind(this));
    }
    else {
      this.party.sprites[this.party.currentVehicle].animations.stop();
    }
  },

  render: function() {
    if (SYS_CONFIG.DEBUG) {
      this.position = this.position || this.game.add.text(300, 32, '', { fill: '#ffff00' });
      this.worldPosition = this.worldPosition || this.game.add.text(600, 32, '', { fill: '#ffff00' });
      this.nextBattleSteps = this.nextBattleSteps || this.game.add.text(900, 32, '', { fill: '#ffff00' });

      this.game.debug.inputInfo(32, 32);
      var coords = this.world.calculatePlayerCooordinates();
      this.position.text = 'PositionX: ' + coords.x +
            '\nPositionY: ' + coords.y +
            '\nTileType: ' + this.party.currentTile() +
            '\nRightType: ' + this.party.nextTile('right') +
            '\nLeftType: ' + this.party.nextTile('left') +
            '\nUpType: ' + this.party.nextTile('up') +
            '\nDownType: ' + this.party.nextTile('down');

      this.worldPosition.text = 'PositionX: ' + this.world.sprite.tilePosition.x +
            '\nPositionY: ' + this.world.sprite.tilePosition.y;
      this.nextBattleSteps.text = 'Next encounter steps: ' + this.world.nextEncounterSteps;
    }
  }
};
