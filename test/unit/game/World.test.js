var fs = require('fs');
var should = require('should');
var assert = require('assert');
// Require World.js
eval(fs.readFileSync(__dirname + '/../../../lib/game/bin/World.js').toString());

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

describe('World class', function() {
  describe('calculatePlayerCooordinates method', function() {
    it('should calculate player coordinates for normal case', function() {
      var world = createWorld(1, 2);
      var coordinates = world.calculatePlayerCooordinates();
      coordinates.x.should.equal(10);
      coordinates.y.should.equal(5);
    });

    it('should calculate player coordinates for higher x', function() {
      var world = createWorld(31, 180);
      var coordinates = world.calculatePlayerCooordinates();
      coordinates.x.should.equal(9);
      coordinates.y.should.equal(235);
    });

    it('should calculate player coordinates for higher y', function() {
      var world = createWorld(1, 152);
      var coordinates = world.calculatePlayerCooordinates();
      coordinates.x.should.equal(10);
      coordinates.y.should.equal(237);
    });

    it('should calculate player coordinates for negative values', function() {
      var world = createWorld(-21, -152);
      var coordinates = world.calculatePlayerCooordinates();
      coordinates.x.should.equal(12);
      coordinates.y.should.equal(16);
    });
  });

  describe('generateNextEncounterSteps method', function() {
    it('should assign nextEncounterSteps to a number between 50 and 255', function() {
      var world = createWorld(-21, -152);
      assert(world.nextEncounterSteps >= 50 && world.nextEncounterSteps <= 255);
      world.generateNextEncounterSteps();
      assert(world.nextEncounterSteps >= 50 && world.nextEncounterSteps <= 255);
    });
  });
});

// var fs = require('fs');
// var should = require('should');
// var assert = require('assert');
// // Require World.js
// eval(fs.readFileSync(__dirname + '/../../../lib/game/classes/World.js').toString());

// var tileData = JSON.parse(fs.readFileSync(__dirname + '/../../../lib/game/config/world/tileData.json', 'utf8'));

// function createWorld(x, y) {
//   var spriteStub = {
//     tilePosition: {
//       x: x,
//       y: y
//     }
//   };
//   return new World(spriteStub, tileData.tiles);
// }

// describe('World class', function() {
//   describe('calculatePlayerCooordinates method', function() {
//     it('should calculate player coordinates for normal case', function() {
//       var world = createWorld(1, 2);
//       var coordinates = world.calculatePlayerCooordinates();
//       coordinates.x.should.equal(10);
//       coordinates.y.should.equal(5);
//     });

//     it('should calculate player coordinates for higher x', function() {
//       var world = createWorld(31, 180);
//       var coordinates = world.calculatePlayerCooordinates();
//       coordinates.x.should.equal(9);
//       coordinates.y.should.equal(235);
//     });

//     it('should calculate player coordinates for higher y', function() {
//       var world = createWorld(1, 152);
//       var coordinates = world.calculatePlayerCooordinates();
//       coordinates.x.should.equal(10);
//       coordinates.y.should.equal(237);
//     });

//     it('should calculate player coordinates for negative values', function() {
//       var world = createWorld(-21, -152);
//       var coordinates = world.calculatePlayerCooordinates();
//       coordinates.x.should.equal(12);
//       coordinates.y.should.equal(16);
//     });
//   });

//   describe('generateNextEncounterSteps method', function() {
//     it('should assign nextEncounterSteps to a number between 50 and 255', function() {
//       var world = createWorld(-21, -152);
//       assert(world.nextEncounterSteps >= 50 && world.nextEncounterSteps <= 255);
//       world.generateNextEncounterSteps();
//       assert(world.nextEncounterSteps >= 50 && world.nextEncounterSteps <= 255);
//     });
//   });
// });
