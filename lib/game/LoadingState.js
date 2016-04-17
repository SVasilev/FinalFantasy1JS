/* global MainState */

function LoadingState() {}

LoadingState.prototype = {
  loadScripts: function() {
    this.load.script('Common', '../lib/game/classes/Common.js');
    this.load.script('GameConstants', '../lib/game/classes/GameConstants.js');
    this.load.script('DbData', '../lib/game/classes/DbData.js');
    this.load.script('GameMenu', '../lib/game/classes/GameMenu.js');
    this.load.script('UnitActions', '../lib/game/classes/UnitActions.js');
    this.load.script('Monster', '../lib/game/classes/Monster.js');
    this.load.script('BattleUnits', '../lib/game/classes/BattleUnits.js');
    this.load.script('BattleGround', '../lib/game/classes/BattleGround.js');
    this.load.script('BattleScene', '../lib/game/classes/BattleScene.js');
    this.load.script('World', '../lib/game/classes/World.js');
    this.load.script('CharacterData', '../lib/game/classes/CharacterData.js');
    this.load.script('Character', '../lib/game/classes/Character.js');
    this.load.script('Party', '../lib/game/classes/Party.js');
    this.load.script('MainState', '../lib/game/MainState.js');
  },

  loadConfiguration: function() {
    this.load.json('tileData', '../lib/game/config/world/tileData.json');
    this.load.json('worldMapPartySpritesData', '../lib/game/config/party/worldMapPartySpritesData.json');
    this.load.json('inBattlePartySpritesData', '../lib/game/config/party/inBattlePartySpritesData.json');
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
    this.load.image('worldmap', './assets/img/game/world/worldMap.png');
  },

  preload: function() {
    this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.logo.anchor.setTo(0.5);
    this.progressBar = this.add.sprite(this.game.world.centerX, this.logo.y + this.logo.height / 2, 'progressbar');
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
