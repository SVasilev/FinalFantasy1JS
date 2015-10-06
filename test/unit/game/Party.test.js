var fs = require('fs');
var assert = require('assert');
var should = require('should');
// Require World.js and Party.js
eval(fs.readFileSync(__dirname + '/../../../lib/game/classes/World.js').toString());
eval(fs.readFileSync(__dirname + '/../../../lib/game/classes/Party.js').toString());

var world, party;
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
      visible: true,
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
    },
    boat: {
      visible: false,
      animations: {
        add: function() { /* dummy */ },
        play: function() { /* dummy */ }
      },
      anchor: {
        setTo: function() { /* dummy */ }
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

var TILE_SIZE = 16; // This is the worldmap unit.
function movePartyExplicitly(leftSteps, rightSteps, upSteps, downSteps) {
  party.world.sprite.tilePosition.x += leftSteps * TILE_SIZE - rightSteps * TILE_SIZE;
  party.world.sprite.tilePosition.y += upSteps * TILE_SIZE - downSteps * TILE_SIZE;
}

function movePartyImplicitly(direction, steps) {
  party.cursors[direction].isDown = true;
  party.move(TILE_SIZE * steps);
  party.cursors[direction].isDown = false;
}

describe('Party class', function() {
  beforeEach(function() {
    // Restart the party position and world.
    world = createWorld(1888, 1408);
    party = createParty(world);
  });

  describe('previousTile method', function() {
    it('should return the previous tile tile type correctly', function() {
      party.previousTile('up', TILE_SIZE).should.equal('shipyard');

      // One step to the right, three steps up
      movePartyExplicitly(0, 0, 0, 1);
      party.previousTile('up', TILE_SIZE).should.equal('sea');
      party.previousTile('down', TILE_SIZE).should.equal('grass');
    });
  });

  // Finish this test after the current tile returns locations !!!
  describe('currentTile method', function() {
    it('should return the current tile type correctly', function() {
      party.currentTile().should.equal('grass');

      // One step to the right, three steps up
      movePartyExplicitly(0, 1, 3, 0);
      party.currentTile().should.equal('mountain');

      movePartyExplicitly(0, 2, 0, 0);
      party.currentTile().should.equal('forest');

      movePartyExplicitly(0, 5, 0, 0);
      party.currentTile().should.equal('sea');

      movePartyExplicitly(8, 0, 0, 4);
      party.currentTile().should.equal('shipyard');

      movePartyExplicitly(0, 0, 9, 0);
      assert.equal(party.currentTile(), undefined);
    });
  });

  describe('changeVehicle method', function() {
    it('should not do anything if the party hasn\'t got the vehicle passed as argument', function() {
      party.currentVehicle.should.equal('walk');
      party.changeVehicle('canue');
      party.currentVehicle.should.equal('walk');
    });

    it('should change the vehicle to the one passed as argument if the party has it', function() {
      party.currentVehicle.should.equal('walk');
      party.changeVehicle('boat');
      party.sprites['walk'].visible.should.equal(false);
      party.sprites['boat'].visible.should.equal(true);
      party.currentVehicle.should.equal('boat');
    });
  });

  describe('moveWorld', function() {
    it('moves the world correctly', function() {
      party.moveWorld('right', TILE_SIZE);
      world.sprite.tilePosition.x.should.equal(1872);
      party.moveWorld('right', TILE_SIZE);
      party.moveWorld('right', TILE_SIZE);
      party.moveWorld('down', TILE_SIZE);
      world.sprite.tilePosition.x.should.equal(1840);
      world.sprite.tilePosition.y.should.equal(1392);
      party.currentTile().should.equal('sea');
    });
  });

  describe('adjustScene method', function() {
    it('should not do anything if the move was valid', function() {
      movePartyExplicitly(1, 0, 0, 0);
      party.adjustScene('left', 16);
      world.sprite.tilePosition.x.should.equal(1904);
    });

    it('should undo move if it was invalid and we are not switching vehicles', function() {
      movePartyExplicitly(0, 0, 0, 2);
      party.adjustScene('down', 16);
      world.sprite.tilePosition.y.should.equal(1392);

      movePartyExplicitly(0, 1, 0, 2);
      party.currentVehicle = 'boat';
      party.adjustScene('right', 16);
      world.sprite.tilePosition.y.should.equal(1360);
    });

    it('should change from boat to walk correctly', function() {
      // Tired
    });
  });


  describe('move method', function() {
    // This test cannot be fully completed right now because the following features are not implemented:
    // switching from boots to boat, from boat to canue, canue to boots, boots to canue, etc
    // entering locations (caves, towns)
    // maybe something else i forget
    it('should move correctly through the world map', function() {
      movePartyImplicitly('left', 2);
      movePartyImplicitly('up', 2);
      world.sprite.tilePosition.x.should.equal(1920);
      world.sprite.tilePosition.y.should.equal(1440);
      movePartyImplicitly('up', 1);
      world.sprite.tilePosition.y.should.equal(1440);
      movePartyImplicitly('left', 2);
      party.currentTile().should.equal('forest');
      movePartyImplicitly('left', 5);
      world.sprite.tilePosition.x.should.equal(2032);
      movePartyImplicitly('left', 1);
      world.sprite.tilePosition.x.should.equal(2032);
    });
  });
});
