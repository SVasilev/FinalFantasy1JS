/* global World, GameConstants */
var fs = require('fs');

// Require World.js and GameConstants.js
eval(fs.readFileSync(__dirname + '/../../lib/game/classes/World.js').toString());
eval(fs.readFileSync(__dirname + '/../../lib/game/classes/GameConstants.js').toString());
var SYS_CONFIG = {}; // eslint-disable-line no-unused-vars

module.exports = {
  getPhaserSpriteStub: function() {
    return {
      texture: { // Dimensions for the worldmap image
        width: 4240,
        height: 3840
      },
      animations: {
        add: function() { /* dummy */ },
        play: function() { /* dummy */ }
      },
      anchor: {
        setTo: function() { /* dummy */ }
      },
      scale: {
        x: 0, y: 3,
        setTo: function() {}
      },
      tilePosition: { x: 0, y: 0 }
    };
  },

  getPhaserGameStub: function() {
    return {
      add: {
        sprite: function() {
          return module.exports.getPhaserSpriteStub();
        },
        tileSprite: function() {
          return module.exports.getPhaserSpriteStub();
        }
      },
      cache: {
        getJSON: function(fileName) {
          switch (fileName) {
            case GameConstants.ASSETS_KEYS.WORLDMAP_TILE_DATA:
              return require('../../lib/game/config/world/worldmapData.json');
            case GameConstants.ASSETS_KEYS.WORLDMAP_PARTY_SPRITES_DATA:
              return require('../../lib/game/config/party/worldMapPartySpritesData.json');
            case GameConstants.ASSETS_KEYS.PARTY_DATA:
              return require('../../lib/game/config/party/partyData.json');
          }
        }
      }
    };
  },

  getWorldStub: function(x, y) {
    var world = new World(module.exports.getPhaserGameStub());
    world.sprite.tilePosition = { x: x, y: y };
    return world;
  }
};
