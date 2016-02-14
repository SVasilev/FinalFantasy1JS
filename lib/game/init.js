/* global Phaser, World, Party, GameMenu, BattleScene, DbData, _ */

var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

function GameController(game) {}

GameController.prototype = {
  onBattleEncounter: function(party) {
    var phaserKeyboard = this.game.input.keyboard;
    phaserKeyboard.lastKey.isDown = false;
    phaserKeyboard.disabled = true;
    this.party.enabled = false;
    var onBattleEndCallback = function() {
      this.party.enabled = true;
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
    this.game.load.image('worldmap', './assets/img/game/world/tiledCopyOfWorldMapWithLocations.png');

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

    // this.text  = this.game.add.text(300, 32, '', { fill: '#ffff00' });
    // this.text1 = this.game.add.text(600, 32, '', { fill: '#ffff00' });
    // this.text2 = this.game.add.text(900, 32, '', { fill: '#ffff00' });

    // var menuConfig = {
    //   x: 200,
    //   y: 200,
    //   width: 220,
    //   // height: 260,
    //   margin: 30,
    //   cursorWidth: 35,
    //   cursorDistanceFromText: 15,
    //   canBeClosed: false,
    //   noCursor: true,
    // };

    // this.menu = new GameMenu({ background: 'menuBackground', cursor: 'menuCursor' }, {
    //   'New Game': function() {
    //     alert('I am creating anew game');
    //   }, 'Save Game': {}, 'Load Game': {}, 'Settings': {}, 'Exit': {}}, menuConfig, game);

    this.party.enabled = false;
    var onBattleEndCallback = function() {
      this.party.enabled = true;
    }.bind(this);
    this.battleScene = new BattleScene(this.party, this.dbData, onBattleEndCallback, this.game);
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
  //   this.game.debug.inputInfo(32, 32);
  //   var coords = this.world.calculatePlayerCooordinates();
  //   this.text.text = 'PositionX: ' + coords.x +
  //         '\nPositionY: ' + coords.y +
  //         '\nTileType: ' + this.party.currentTile() +
  //         '\nRightType: ' + this.party.nextTile('right') +
  //         '\nLeftType: ' + this.party.nextTile('left') +
  //         '\nUpType: ' + this.party.nextTile('up') +
  //         '\nDownType: ' + this.party.nextTile('down');

  //   this.text1.text = 'PositionX: ' + this.world.sprite.tilePosition.x +
  //         '\nPositionY: ' + this.world.sprite.tilePosition.y;
    // this.text2.text = 'Next encounter steps: ' + this.world.nextEncounterSteps;
  }
};

game.state.add('GameController', GameController);
game.state.start('GameController');
