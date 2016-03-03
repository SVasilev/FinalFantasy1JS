/* global describe, it, beforeEach, __dirname, World */

var _ = require('underscore');
var fs = require('fs');
var sinon = require('sinon');
var assert = require('assert');
var should = require('should');
// Require World.js and Party.js
eval(fs.readFileSync(__dirname + '/../../../lib/game/classes/CharacterData.js').toString());
eval(fs.readFileSync(__dirname + '/../../../lib/game/classes/World.js').toString());
eval(fs.readFileSync(__dirname + '/../../../lib/game/classes/Party.js').toString());
// Require the configuration for the sprites
var spritesConfiguration = require('../../../lib/game/config/party/worldMapPartySpritesData.json');

var world, party;
var tileData = JSON.parse(fs.readFileSync(__dirname + '/../../../lib/game/config/world/tileData.json', 'utf8'));

var Common = {
  createSpriteFromConfig: function() {
    return createSpritesStub();
  }
};

function createWorld(x, y) {
  var spriteStub = {
    scale: {
      setTo: function() {}
    },
    tilePosition: {
      x: x,
      y: y
    }
  };

  var phaserGameStub = {
    add: {
      tileSprite: function() {
        return spriteStub;
      }
    },
    cache: {
      getJSON: function(fileName) {
        return JSON.parse(fs.readFileSync(fileName, 'utf8'));
      }
    }
  };

  return new World('worldmap', __dirname + '/../../../lib/game/config/world/tileData.json', phaserGameStub);
}

function createSpritesStub() {
  var phaserSpriteStub = {
    visible: false,
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

  var worldMapSpritesStub = {
    walk: _.extend({}, phaserSpriteStub),
    boat: _.extend({}, phaserSpriteStub)
  };

  for (var spriteName in spritesConfiguration) {
    worldMapSpritesStub[spriteName].config = spritesConfiguration[spriteName];
  }
  worldMapSpritesStub.walk.visible = true;
  return worldMapSpritesStub;
}

function createParty(world) {

  var cursorsStub = {
    left: { isDown: false },
    right: { isDown: false },
    up: { isDown: false },
    down: { isDown: false }
  };

  var inBattlePartySprites = { 'warior': {}, 'thief': {}, 'whiteMage': {}, 'blackMage': {} };
  return new Party(worldMapSpritesStub, cursorsStub, world);
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

  describe('_previousTile method', function() {
    it('should return the previous tile tile type correctly', function() {
      party._previousTile('up', TILE_SIZE).should.equal('shipyard');

      // One step to the right, three steps up
      movePartyExplicitly(0, 0, 0, 1);
      party._previousTile('up', TILE_SIZE).should.equal('sea');
      party._previousTile('down', TILE_SIZE).should.equal('grass');
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

  describe('_changeVehicle method', function() {
    it('should not do anything if the party hasn\'t got the vehicle passed as argument', function() {
      party.currentVehicle.should.equal('walk');
      party._changeVehicle('canue');
      party.currentVehicle.should.equal('walk');
    });

    it('should change the vehicle to the one passed as argument if the party has it', function() {
      party.currentVehicle.should.equal('walk');
      party._changeVehicle('boat');
      party.worldMapSprites['walk'].visible.should.equal(false);
      party.worldMapSprites['boat'].visible.should.equal(true);
      party.currentVehicle.should.equal('boat');
    });
  });

  describe('_moveWorld method', function() {
    it('moves the world correctly', function() {
      party._moveWorld('right', TILE_SIZE);
      world.sprite.tilePosition.x.should.equal(1872);
      party._moveWorld('right', TILE_SIZE);
      party._moveWorld('right', TILE_SIZE);
      party._moveWorld('down', TILE_SIZE);
      world.sprite.tilePosition.x.should.equal(1840);
      world.sprite.tilePosition.y.should.equal(1392);
      party.currentTile().should.equal('sea');
    });

    it('recalculates world.nextEncounterSteps', function() {
      var moveTimes = 20;
      var stepPixels = 1.5;
      var stepsToRemoveWhenWalking = 6;
      var currentStepsToNextEncounter = world.nextEncounterSteps;
      for (var i = 0; i < moveTimes; i++) {
        party._moveWorld('right', stepPixels);
      }
      var oneStepDecrease = stepsToRemoveWhenWalking / (TILE_SIZE / stepPixels);
      var expectedSteps = currentStepsToNextEncounter - (moveTimes * oneStepDecrease);
      world.nextEncounterSteps.should.equal(expectedSteps);
    });
  });

  describe('_decreaseEncounterSteps method', function() {
    it('behaves correctly for different current vehicles', function() {
      var stepPixels = 1.5;
      var currentStepsToNextEncounter = world.nextEncounterSteps;
      var vehicleToStepsMapping = { 'walk': 6, 'boat': 2, 'canue': 2, 'ship': 0 };

      party.currentVehicle = 'walk';
      party._decreaseEncounterSteps(stepPixels);
      var expectedSteps = currentStepsToNextEncounter - vehicleToStepsMapping['walk'] / (TILE_SIZE / stepPixels);
      world.nextEncounterSteps.should.equal(expectedSteps);

      party.currentVehicle = 'boat';
      party._decreaseEncounterSteps(TILE_SIZE);
      expectedSteps -= vehicleToStepsMapping['boat'];
      world.nextEncounterSteps.should.equal(expectedSteps);

      party.currentVehicle = 'canue';
      party._decreaseEncounterSteps(TILE_SIZE / 2);
      expectedSteps -= vehicleToStepsMapping['canue'] / 2;
      world.nextEncounterSteps.should.equal(expectedSteps);

      party.currentVehicle = 'ship';
      party._decreaseEncounterSteps(stepPixels);
      party._decreaseEncounterSteps(stepPixels);
      party._decreaseEncounterSteps(stepPixels);
      party._decreaseEncounterSteps(stepPixels);
      world.nextEncounterSteps.should.equal(expectedSteps);
    });

    it('resets the encounter steps when entering a battle', function() {
      world.nextEncounterSteps = 1;
      party._decreaseEncounterSteps(TILE_SIZE);
      assert(world.nextEncounterSteps >= 50);
    });
  });

  describe('_adjustScene method', function() {
    it('should not do anything if the move was valid', function() {
      movePartyExplicitly(1, 0, 0, 0);
      party._adjustScene('left', 16);
      world.sprite.tilePosition.x.should.equal(1904);
    });

    it('should undo move if it was invalid and we are not switching vehicles', function() {
      movePartyExplicitly(0, 0, 0, 2);
      party._adjustScene('down', 16);
      world.sprite.tilePosition.y.should.equal(1392);

      movePartyExplicitly(0, 1, 0, 2);
      party.currentVehicle = 'boat';
      party._adjustScene('right', 16);
      world.sprite.tilePosition.y.should.equal(1360);
    });

    it('should change from boat to walk correctly', function() {
      movePartyExplicitly(0, 0, 0, 5);
      party.currentVehicle = 'boat'; // WHAT IF WE DONT HAVE BOAT? THEREFORE THE VEHICLES SHOULD ALSO BE READ FROM SPRITES.JSON
      movePartyImplicitly('up', 2);
      movePartyImplicitly('left', 1);
      world.sprite.tilePosition.x.should.equal(1904);
      world.sprite.tilePosition.y.should.equal(1360);
      party._moveWorld('left', TILE_SIZE);
      party._adjustScene('left', TILE_SIZE);
      world.sprite.tilePosition.x.should.equal(1920);
      party.currentTile().should.equal('grass');
      party.currentVehicle.should.equal('walk');
    });
  });

  describe('moveScene method', function() {
    it('should move the party if the move is valid', function() {
      world.sprite.tilePosition.x.should.equal(1888);
      party.moveScene('right', TILE_SIZE);
      world.sprite.tilePosition.x.should.equal(1872);
    });

    it('should do nothing if the move is invalid', function() {
      world.sprite.tilePosition.y.should.equal(1408);
      movePartyImplicitly('right', 1);
      world.sprite.tilePosition.x.should.equal(1872);
      movePartyImplicitly('up', 2);
      world.sprite.tilePosition.y.should.equal(1440);
      party.moveScene('up', TILE_SIZE);
      world.sprite.tilePosition.y.should.equal(1440);
    });

    it('should change to boat if the party has boat and it steps on a shipyard', function() {
      party.currentVehicle.should.equal('walk');
      party.moveScene('down', TILE_SIZE);
      party.currentVehicle.should.equal('boat');
    });

    it('should not change to boat if the party does not have boat and it steps on a shipyard', function() {
      party.currentVehicle.should.equal('walk');
      party.vehicles = ['walk'];
      party.moveScene('down', TILE_SIZE);
      party.currentVehicle.should.equal('walk');
    });

    it('should change the anchor and scale of the sprite if we move sideways', function() {
      var sprite = party.worldMapSprites['walk'];
      var spy = sinon.spy(sprite.anchor, 'setTo');

      sprite.scale.x.should.equal(0);
      party.currentVehicle.should.equal('walk');
      party.moveScene('left', TILE_SIZE);
      sprite.scale.x.should.equal(3);
      spy.calledWith(0, 0).should.equal(true);
      party.moveScene('right', TILE_SIZE);
      spy.calledWith(1, 0).should.equal(true);
      sprite.scale.x.should.equal(-3);

      sprite.anchor.setTo.restore();
    });

    it('should not change the anchor and scale of the sprite if we move vertically', function() {
      var sprite = party.worldMapSprites['walk'];
      var spy = sinon.spy(sprite.anchor, 'setTo');

      sprite.scale.x.should.equal(0);
      party.currentVehicle.should.equal('walk');
      party.moveScene('left', TILE_SIZE);
      sprite.scale.x.should.equal(3);
      spy.calledWith(0, 0).should.equal(true);
      party.moveScene('up', TILE_SIZE);
      spy.calledOnce.should.equal(true);

      sprite.anchor.setTo.restore();
    });

    it('should play the right animation', function() {
      var sprite = party.worldMapSprites['walk'];
      var spy = sinon.spy(sprite.animations, 'play');

      party.currentVehicle.should.equal('walk');
      party.moveScene('left', TILE_SIZE);
      spy.calledWith('walkSideways').should.equal(true);
      party.moveScene('up', TILE_SIZE);
      spy.calledWith('walkUp').should.equal(true);
      party._changeVehicle('boat');
      party.moveScene('down', TILE_SIZE);
      spy.calledWith('boatDown').should.equal(true);

      sprite.animations.play.restore();
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
