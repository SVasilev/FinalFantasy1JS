var fs = require('fs');
var assert = require('assert');
var should = require('should');
// Require World.js and Party.js
eval(fs.readFileSync(__dirname + '/../../../lib/game/classes/World.js').toString());
eval(fs.readFileSync(__dirname + '/../../../lib/game/classes/Party.js').toString());

var tileData = JSON.parse(fs.readFileSync(__dirname + '/../../../lib/game/config/world/tileData.json', 'utf8'));

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
  var spritesStub = {
    walk: {
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
      },
      config: {
        scale: {
          x: 0,
          y: 0
        },
        animation: {
          walkUp: [4, 5],
          walkDown: [0, 1],
          walkSideways: [2, 3]
        }
      }
    }
  };
  var cursorsStub = {
    left: { isDown: false },
    right: { isDown: false },
    up: { isDown: false },
    down: { isDown: false }
  };

  return new Party(spritesStub, cursorsStub, world);
}

var TILE_SIZE = 16; // This is the unit.
function movePartyExplicitly(party, leftSteps, rightSteps, upSteps, downSteps) {
  party.world.sprite.tilePosition.x += leftSteps * TILE_SIZE - rightSteps * TILE_SIZE;
  party.world.sprite.tilePosition.y += upSteps * TILE_SIZE - downSteps * TILE_SIZE;
}

function movePartyImplicitly(party, direction, steps) {
  party.cursors[direction].isDown = true;
  party.move(TILE_SIZE * steps);
  party.cursors[direction].isDown = false;
}

describe('Party class', function() {
  var world, party;

  beforeEach(function() {
    // Restart the party position and world.
    world = createWorld(1888, 1408);
    party = createParty(world);
  });

  describe('currentTile method', function() {
    it('should return the current tile type correctly', function() {
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

  describe('undoMoveIfItWasInvalid', function() {
    it('should not do anything if the move was valid', function() {
      movePartyExplicitly(party, 1, 0, 0, 0);
      party.undoMoveIfItWasInvalid('left', 16);
      assert.equal(world.sprite.tilePosition.x, 1904);
    });

    it('should undo move if it was invalid', function() {
      movePartyExplicitly(party, 0, 0, 0, 2);
      party.undoMoveIfItWasInvalid('down', 16);
      assert.equal(world.sprite.tilePosition.y, 1392);

      movePartyExplicitly(party, 0, 1, 0, 2);
      party.currentVehicle = 'boat';
      party.undoMoveIfItWasInvalid('right', 16);
      assert.equal(world.sprite.tilePosition.y, 1360);
    });

    // This test cannot be fully completed right now because the following features are not implemented:
    // switching from boots to boat, from boat to canue, canue to boots, boots to canue, etc
    // entering locations (caves, towns)
    // maybe something else i forget
    it('should move correctly through the world map', function() {
      movePartyImplicitly(party, 'left', 2);
      movePartyImplicitly(party, 'up', 2);
      assert.equal(world.sprite.tilePosition.x, 1920);
      assert.equal(world.sprite.tilePosition.y, 1440);
      movePartyImplicitly(party, 'up', 1);
      assert.equal(world.sprite.tilePosition.y, 1440);
      movePartyImplicitly(party, 'left', 2);
      assert.equal(party.currentTile(), 'forest');
      movePartyImplicitly(party, 'left', 5);
      assert.equal(world.sprite.tilePosition.x, 2032);
      movePartyImplicitly(party, 'left', 1);
      assert.equal(world.sprite.tilePosition.x, 2032);
    });
  });
});
