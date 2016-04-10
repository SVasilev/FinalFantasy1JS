/* global World */
var fs = require('fs');

// Require World.js
eval(fs.readFileSync(__dirname + '/../../lib/game/classes/World.js').toString());

module.exports = {
  getPhaserSpriteStub: function() {
    return {
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
          return JSON.parse(fs.readFileSync(fileName, 'utf8'));
        }
      }
    };
  },

  getWorldStub: function(x, y) {
    var world = new World('worldmap', __dirname + '/../../lib/game/config/world/tileData.json', module.exports.getPhaserGameStub());
    world.sprite.tilePosition = { x: x, y: y };
    return world;
  }
};
