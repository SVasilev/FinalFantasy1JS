var fs = require('fs');
var assert = require('assert');
var should = require('should');
// Require World.js and Party.js
eval(fs.readFileSync(__dirname + '/../../../lib/game/world/World.js').toString());
eval(fs.readFileSync(__dirname + '/../../../lib/game/Party.js').toString());

var tileData = JSON.parse(fs.readFileSync(__dirname + '/../../../lib/game/world/tileData.json', 'utf8'));

function createWorld(x, y) {
  var spriteStub = {
    tilePosition: {
      x: x,
      y: y
    }
  };
  return new World(spriteStub, tileData.tiles);
}

function createParty(world) {
  var spriteStub = {
    animations: {
      add: function() { /* dummy */ },
      play: function() { /* dummy */ }
    },
    anchor: {
      setTo: function() { /* dummy */ }
    },
    scale: {
      x: 0,
      y: 0
    }
  };
  var cursorsStub = {
    left: { isDown: false },
    right: { isDown: false },
    up: { isDown: false },
    down: { isDown: false }
  };

  return new Party(spriteStub, cursorsStub, world);
}

function movePartyExplicitly(party, leftSteps, rightSteps, upSteps, downSteps) {
  var TILE_SIZE = 16; // This is the unit.
  party.world.sprite.tilePosition.x += leftSteps * TILE_SIZE - rightSteps * TILE_SIZE;
  party.world.sprite.tilePosition.y += upSteps * TILE_SIZE - downSteps * TILE_SIZE;
}

describe('Party class', function() {
  describe('currentTile method', function() {
    it('should return the current tile type correctly', function() {
      var world = createWorld(1888, 1408);
      var party = createParty(world);
      party.currentTile().should.equal('grass');

      // One step to the right, three steps up
      movePartyExplicitly(party, 0, 1, 3, 0);
      party.currentTile().should.equal('mountain');

      movePartyExplicitly(party, 0, 2, 0, 0);
      party.currentTile().should.equal('forest');

      movePartyExplicitly(party, 0, 5, 0, 0);
      party.currentTile().should.equal('sea');

      movePartyExplicitly(party, 8, 0, 0, 4);
      party.currentTile().should.equal('shipyard');

      movePartyExplicitly(party, 0, 0, 9, 0);
      assert.equal(party.currentTile(), undefined);
    });
  });
});