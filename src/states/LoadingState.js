/* global SYS_CONFIG, MainState, GameConstants */

function LoadingState() {}

LoadingState.prototype = {
  loadResources: function(resourceList, path, resourceType, extension) {
    resourceList.forEach(function(resourceName) {
      this.load[resourceType](resourceName, path + resourceName + '.' + extension);
    }, this);
  },

  loadScripts: function() {
    var FF1_CLASSES = [
      'Common', 'GameMenu', 'Unit', 'UnitStats', 'Monster', 'BattleUnits',
      'BattleGround', 'BattleScene', 'World', 'Character', 'Party'
    ];

    this.loadResources(FF1_CLASSES, '../src/classes/', 'script', 'js');
    this.load.script('MainState', '../src/states/MainState.js');
  },

  loadConfiguration: function() {
    var FF1_ARTEFACTS = [
      'armor', 'characters', 'items',
      'monsters', 'questitems', 'spells', 'weapons'
    ];

    this.loadResources(FF1_ARTEFACTS, '../src/config/artefacts/', 'json', 'json');
    this.load.json('worldmapData', '../src/config/world/worldmapData.json');

    this.loadResources(['partyData', 'worldMapPartySpritesData', 'inBattlePartySpritesData'], '../src/config/party/', 'json', 'json');
  },

  loadImages: function() {
    this.load.image('menuBackground', './assets/img/game/common/menuBackground.png');
    this.load.image('menuCursor', './assets/img/game/common/menuCursor.png');
    this.loadResources(['warrior', 'thief', 'whiteMage', 'blackMage'], './assets/img/game/battle/characters/', 'image', 'gif');
    this.load.spritesheet('statuseffects', './assets/img/game/battle/statuseffects/statuseffects.gif', 32, 20, 10);

    var backgroundsAtlasDir = './assets/img/game/battle/backgrounds/';
    this.load.atlas('battleBackgrounds', backgroundsAtlasDir + 'atlas.png', backgroundsAtlasDir + 'atlasData.json');
    var monstersAtlasDir = './assets/img/game/battle/monsters/';
    this.load.atlas('monstersAtlas', monstersAtlasDir + 'atlas.png', monstersAtlasDir + 'atlasData.json');

    var worldMapImageName = SYS_CONFIG.DEBUG ? 'tiledCopyOfWorldMapWithLocations' : 'worldMap';
    this.load.image('worldmap', './assets/img/game/world/' + worldMapImageName + '.png');
  },

  preload: function() {
    var assetsKeys = GameConstants.ASSETS_KEYS;
    var centerX = this.game.world.centerX;

    this.logo = this.add.sprite(centerX, this.game.world.centerY, assetsKeys.FF1_LOGO_IMG);
    this.logo.anchor.setTo(0.5);
    this.progressBar = this.add.sprite(centerX, this.logo.y + this.logo.height / 2, assetsKeys.PROGRESS_BAR_IMG);
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
