/* global Phaser, World, Party, GameMenu, BattleScene, DbData, _ */

var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

function GameController(game) {}

GameController.prototype = {
  createMainMenu: function() {
    var menuConfig = {
      x: this.game.width / 2 - 150,
      y: this.game.height / 2 - 100,
      width: 240,
      margin: 30,
      cursorWidth: 35,
      cursorDistanceFromText: 15,
      canBeClosed: true,
    };

    menuConfig.onExit = function() {
      this.party.enabled = true;
      this.processKey = false;
    }.bind(this);

    this.menu = new GameMenu({ background: 'menuBackground', cursor: 'menuCursor' }, {
      'Pause Game': function() {
        // game.paused = true;
      }.bind(this),
      'Save Game': function() {
        loginUtils.saveGame({ x: this.world.sprite.tilePosition.x, y: this.world.sprite.tilePosition.y });
      }.bind(this),
      'Load Game': function () {
        var worldPosition = JSON.parse(loginUtils.loadGame());
        this.world.sprite.tilePosition.x = worldPosition.x;
        this.world.sprite.tilePosition.y = worldPosition.y;
      }.bind(this),
      'Exit': function() {
        this.game.destroy();
      }.bind(this)
    }, menuConfig, game);
    this.menu.visible(false);
  },

  onBattleEncounter: function(party) {
    var phaserKeyboard = this.game.input.keyboard;
    phaserKeyboard.lastKey.isDown = false;
    phaserKeyboard.disabled = true;
    this.party.enabled = false;
    var onBattleEndCallback = function() {
      this.menu.destroy();
      this.createMainMenu();
      this.party.enabled = true;
      this.processKey = true;
    }.bind(this);

    this.battleScene = new BattleScene(this.party, this.dbData, onBattleEndCallback, this.game);
  },

  preload: function() {
    this.game.load.json('tileData', '../lib/game/config/world/tileData.json');
    this.game.load.json('worldMapPartySpritesData', '../lib/game/config/party/worldMapPartySpritesData.json');
    this.game.load.json('inBattlePartySpritesData', '../lib/game/config/party/inBattlePartySpritesData.json');
    this.game.load.image('menuBackground', './assets/img/game/common/menuBackground.png');
    this.game.load.image('menuCursor', './assets/img/game/common/menuCursor.png');
    this.game.load.image('battleBackgrounds', './assets/img/game/battle/backgrounds.png');
    this.game.load.image('warrior', './assets/img/game/battle/warrior.gif');
    this.game.load.image('thief', './assets/img/game/battle/thief.gif');
    this.game.load.image('whiteMage', './assets/img/game/battle/whiteMage.gif');
    this.game.load.image('blackMage', './assets/img/game/battle/blackMage.gif');
    this.game.load.spritesheet('spellSpriteSheet', './assets/img/game/battle/spell.png', 102, 128);
    this.game.load.image('monsters', './assets/img/game/battle/monsters.gif');
    this.game.load.image('worldmap', './assets/img/game/world/worldMap.png');

    var self = this;
    this.game.load.onFileComplete.add(function(progress, fileKey) {
      if (fileKey === 'worldmap') {
        var partySpriteData = _.extend(self.game.cache.getJSON('worldMapPartySpritesData'),
                                      self.game.cache.getJSON('inBattlePartySpritesData'));
        Object.keys(partySpriteData).forEach(function(key) {
          var spriteData = partySpriteData[key];
          self.game.load.spritesheet(key, spriteData.location, spriteData.frameWidth, spriteData.frameHeight);
        });
      }
    }, game);
  },

  create: function() {
    this.game.forceSingleUpdate = true;
    this.dbData = new DbData(); // Load data from tha database.
    this.world = new World('worldmap', 'tileData', this.game);

    var partySpritesConfig = this.game.cache.getJSON('worldMapPartySpritesData');
    this.party = new Party(partySpritesConfig, this.world, this.game);

    this.cursorKeys = this.game.input.keyboard.createCursorKeys();
    this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.scale.refresh();

    this.createMainMenu();
    this.processKey = true;
    this.party.enabled = true;
  },

  update: function() {
    var escapeKey = 'u+001b';
    var PARTY_MOVE_PIXELS = 1.5;

    // Move the party if a key is pressed.
    var lastKey = this.game.input.keyboard.lastKey;
    var acceptedDirections = { 'left': true, 'right': true, 'up': true, 'down': true };
    var direction = lastKey && lastKey.event && lastKey.event.keyIdentifier.toLowerCase();
    if (acceptedDirections[direction] && this.cursorKeys[direction].isDown && this.party.enabled) {
      this.processKey = true;
      this.party.move(direction, PARTY_MOVE_PIXELS, this.onBattleEncounter.bind(this));
    }
    else {
      this.party.sprites[this.party.currentVehicle].animations.stop();
    }

    // Open the game menu.
    if (direction === escapeKey && !this.menu.enabled && this.processKey) {
      this.menu.visible(true, true);
      this.party.enabled = false;
    }
  }
};

game.state.add('GameController', GameController);
game.state.start('GameController');
