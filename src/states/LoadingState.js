/* global SYS_CONFIG, MainState, GameConstants */

function LoadingState() {}

LoadingState.prototype = {
  loadScripts: function() {
    var FF1_CLASSES = [
      'Common', 'DbData', 'GameMenu', 'UnitActions', 'Monster', 'BattleUnits',
      'BattleGround', 'BattleScene', 'World', 'CharacterData', 'Character', 'Party'
    ];

    FF1_CLASSES.forEach(function(className) {
      this.load.script(className, '../src/classes/' + className + '.js');
    }, this);
    this.load.script('MainState', '../src/states/MainState.js');
  },

  loadConfiguration: function() {
    this.load.json('worldmapData', '../src/config/world/worldmapData.json');
    this.load.json('partyData', '../src/config/party/partyData.json');
    this.load.json('worldMapPartySpritesData', '../src/config/party/worldMapPartySpritesData.json');
    this.load.json('inBattlePartySpritesData', '../src/config/party/inBattlePartySpritesData.json');
  },

  loadImages: function() {
    this.load.image('menuBackground', './assets/img/game/common/menuBackground.png');
    this.load.image('menuCursor', './assets/img/game/common/menuCursor.png');
    this.load.image('battleBackgrounds', './assets/img/game/battle/backgrounds.png');
    this.load.image('warrior', './assets/img/game/battle/warrior.gif');
    this.load.image('thief', './assets/img/game/battle/thief.gif');
    this.load.image('whiteMage', './assets/img/game/battle/whiteMage.gif');
    this.load.image('blackMage', './assets/img/game/battle/blackMage.gif');
    this.load.image('monsters', './assets/img/game/battle/monsters.gif');

    var worldMapImageName = SYS_CONFIG.DEBUG ? 'tiledCopyOfWorldMapWithLocations' : 'worldMap';
    this.load.image('worldmap', './assets/img/game/world/' + worldMapImageName + '.png');
  },

  preload: function() {
    var assetsKeys = GameConstants.ASSETS_KEYS;
    var centerX = this.game.world.centerX;

    this.logo = this.add.sprite(centerX, this.game.world.centerY, assetsKeys.FF1_LOGO);
    this.logo.anchor.setTo(0.5);
    this.progressBar = this.add.sprite(centerX, this.logo.y + this.logo.height / 2, assetsKeys.PROGRESS_BAR);
    this.progressBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.progressBar);

    this.loadScripts();
    this.loadConfiguration();
    this.loadImages();
    this.load.spritesheet('spellSpriteSheet', './assets/img/game/battle/spell.png', 102, 128);
  },

  create: function() {
    this.game.state.add('MainState', MainState);
    this.game.state.start('MainState');
  }
};
