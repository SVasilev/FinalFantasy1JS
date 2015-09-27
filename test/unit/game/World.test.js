var fs = require('fs');
// Require World.js
eval(fs.readFileSync(__dirname + '/../../../lib/game/world/World.js').toString());

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
});
