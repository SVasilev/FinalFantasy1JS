/* global describe, it, beforeEach, __dirname, Party */

var fs = require('fs');
var sinon = require('sinon');
var assert = require('assert');
var should = require('should'); // eslint-disable-line no-unused-vars
var stubs = require('../../test-utils/stubs');
// Require client side classes
var GameConstants = require(__dirname + '/../../../src/config/GameConstants');
eval(fs.readFileSync(__dirname + '/../../../src/classes/Common.js').toString());
eval(fs.readFileSync(__dirname + '/../../../src/classes/Party.js').toString());
Party.prototype._createInBattleUnitsGroup = function() {};

var world, party;
var TILE_SIZE; // This is the worldmap unit.
function movePartyExplicitly(leftSteps, rightSteps, upSteps, downSteps) {
  party.world.sprite.tilePosition.x += leftSteps * TILE_SIZE - rightSteps * TILE_SIZE;
  party.world.sprite.tilePosition.y += upSteps * TILE_SIZE - downSteps * TILE_SIZE;
}

function movePartyImplicitly(direction, steps) {
  party.move(direction, TILE_SIZE * steps, function() {});
}

describe('Party class', function() {
  beforeEach(function() {
    // Restart the party position and world.
    world = stubs.getWorldStub(1888, 1408);
    party = new Party(world, stubs.getPhaserGameStub());
    TILE_SIZE = world.worldmapData.tileSize;
  });

  describe('_currentTileIsValid method', function() {
    it('should return true if the party is currently standing on valid tile', function() {
      party._currentTileIsValid().should.equal(true);

      // Go to the sea.
      party.vehicles.push('boat');
      party._changeVehicle('boat');
      movePartyExplicitly(0, 0, 0, 5);
      party._currentTileIsValid().should.equal(true);
    });

    it('should return false if the party is currently standing on invalid tile', function() {
      // Go to the sea.
      party.vehicles.push('boat');
      party._changeVehicle('boat');
      party._currentTileIsValid().should.equal(false);
      party._changeVehicle('walk');
      movePartyExplicitly(0, 0, 0, 5);
      party._currentTileIsValid().should.equal(false);
    });
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

  describe('_changeVehicle method', function() {
    it('should not do anything if the party hasn\'t got the vehicle passed as argument', function() {
      party.currentVehicle.should.equal('walk');
      party._changeVehicle('canue');
      party.currentVehicle.should.equal('walk');
    });

    it('should change the vehicle to the one passed as argument if the party has it', function() {
      party.currentVehicle.should.equal('walk');
      party.vehicles.push('boat');
      party._changeVehicle('boat');
      party.sprites['walk'].visible.should.equal(false);
      party.sprites['boat'].visible.should.equal(true);
      party.currentVehicle.should.equal('boat');
    });
  });

  describe('_moveWorld method', function() {
    it('moves the world correctly', function() {
      party._moveWorld('right', TILE_SIZE);
      party.world.sprite.tilePosition.x.should.equal(1872);
      party._moveWorld('right', TILE_SIZE);
      party._moveWorld('right', TILE_SIZE);
      party._moveWorld('down', TILE_SIZE);
      party.world.sprite.tilePosition.x.should.equal(1840);
      party.world.sprite.tilePosition.y.should.equal(1392);
      party.currentTile().should.equal('sea');
    });

    it('recalculates party.world.nextEncounterSteps', function() {
      var moveTimes = 20;
      var stepPixels = 1.5;
      var stepsToRemoveWhenWalking = 6;
      var currentStepsToNextEncounter = world.nextEncounterSteps;
      for (var i = 0; i < moveTimes; i++) {
        party._moveWorld('right', stepPixels);
      }
      var oneStepDecrease = stepsToRemoveWhenWalking / (TILE_SIZE / stepPixels);
      var expectedSteps = currentStepsToNextEncounter - (moveTimes * oneStepDecrease);
      party.world.nextEncounterSteps.should.equal(expectedSteps);
    });
  });

  describe('_adjustScene method', function() {
    it('should not do anything if the move was valid', function() {
      movePartyExplicitly(1, 0, 0, 0);
      party._adjustScene('left', 16);
      party.world.sprite.tilePosition.x.should.equal(1904);
    });

    it('should not undo if the last move was valid', function() {
      party.world.sprite.tilePosition.y.should.equal(1408);
      movePartyExplicitly(0, 1, 0, 0);
      party.world.sprite.tilePosition.x.should.equal(1872);
      movePartyExplicitly(0, 0, 2, 0);
      party.world.sprite.tilePosition.y.should.equal(1440);
      party._adjustScene('up', TILE_SIZE);
      party.world.sprite.tilePosition.y.should.equal(1440);
    });

    it('should undo move if it was invalid and we are not switching vehicles', function() {
      movePartyExplicitly(0, 0, 0, 2);
      party._adjustScene('down', 16);
      party.world.sprite.tilePosition.y.should.equal(1392);

      movePartyExplicitly(0, 1, 0, 2);
      party.currentVehicle = 'boat';
      party._adjustScene('right', 16);
      party.world.sprite.tilePosition.y.should.equal(1360);
    });

    it('should change from boat to walk correctly', function() {
      movePartyExplicitly(0, 0, 0, 5);
      party.currentVehicle = 'boat'; // WHAT IF WE DONT HAVE BOAT? THEREFORE THE VEHICLES SHOULD ALSO BE READ FROM SPRITES.JSON
      movePartyImplicitly('up', 2);
      movePartyImplicitly('left', 1);
      party.world.sprite.tilePosition.x.should.equal(1904);
      party.world.sprite.tilePosition.y.should.equal(1360);
      party._moveWorld('left', TILE_SIZE);
      party._adjustScene('left', TILE_SIZE);
      party.world.sprite.tilePosition.x.should.equal(1920);
      party.currentTile().should.equal('grass');
      party.currentVehicle.should.equal('walk');
    });
  });

  describe('_decreaseEncounterSteps method', function() {
    it('behaves correctly for different current vehicles', function() {
      var stepPixels = 1.5;
      var currentStepsToNextEncounter = party.world.nextEncounterSteps;
      var vehicleToStepsMapping = { 'walk': 6, 'boat': 2, 'canue': 2, 'ship': 0 };

      party.currentVehicle = 'walk';
      party._decreaseEncounterSteps(stepPixels);
      var expectedSteps = currentStepsToNextEncounter - vehicleToStepsMapping['walk'] / (TILE_SIZE / stepPixels);
      party.world.nextEncounterSteps.should.equal(expectedSteps);

      party.currentVehicle = 'boat';
      party._decreaseEncounterSteps(TILE_SIZE);
      expectedSteps -= vehicleToStepsMapping['boat'];
      party.world.nextEncounterSteps.should.equal(expectedSteps);

      // THIS SHOULD BE ENABLED WHEN YOU FINISH worldMapSpritesData.json
      // party.currentVehicle = 'canue';
      // party._decreaseEncounterSteps(TILE_SIZE / 2);
      // expectedSteps -= vehicleToStepsMapping['canue'] / 2;
      // party.world.nextEncounterSteps.should.equal(expectedSteps);

      // party.currentVehicle = 'ship';
      // party._decreaseEncounterSteps(stepPixels);
      // party._decreaseEncounterSteps(stepPixels);
      // party._decreaseEncounterSteps(stepPixels);
      // party._decreaseEncounterSteps(stepPixels);
      // party.world.nextEncounterSteps.should.equal(expectedSteps);
    });

    it('resets the encounter steps when entering a battle', function() {
      party.world.nextEncounterSteps = 1;
      party._decreaseEncounterSteps(TILE_SIZE, function() {});
      assert(party.world.nextEncounterSteps >= 50);
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

  describe('move method', function() {
    it('should change to boat if the party has boat and it steps on a shipyard', function() {
      party.vehicles.push('boat');
      party.currentVehicle.should.equal('walk');
      movePartyImplicitly('down', 1);
      party.currentVehicle.should.equal('boat');
    });

    it('should not change to boat if the party does not have boat and it steps on a shipyard', function() {
      party.currentVehicle.should.equal('walk');
      party.vehicles = ['walk'];
      movePartyImplicitly('down', 1);
      party.currentVehicle.should.equal('walk');
    });

    it('should change the anchor and scale of the sprite if we move sideways', function() {
      var sprite = party.sprites['walk'];
      var spy = sinon.spy(sprite.anchor, 'setTo');

      sprite.scale.x.should.equal(0);
      party.currentVehicle.should.equal('walk');
      movePartyImplicitly('left', 1);
      sprite.scale.x.should.equal(3);
      spy.calledWith(0, 0).should.equal(true);
      movePartyImplicitly('right', 1);
      spy.calledWith(1, 0).should.equal(true);
      sprite.scale.x.should.equal(-3);

      sprite.anchor.setTo.restore();
    });

    it('should not change the anchor and scale of the sprite if we move vertically', function() {
      var sprite = party.sprites['walk'];
      var spy = sinon.spy(sprite.anchor, 'setTo');

      sprite.scale.x.should.equal(0);
      party.currentVehicle.should.equal('walk');
      movePartyImplicitly('left', 1);
      sprite.scale.x.should.equal(3);
      spy.calledWith(0, 0).should.equal(true);
      movePartyImplicitly('up', 1);
      spy.calledOnce.should.equal(true);

      sprite.anchor.setTo.restore();
    });

    it('should decrease encounter steps if we are trying to move in invalid direction', function() {
      var encounterStepsAtStart = party.world.nextEncounterSteps;
      var movedSteps = 2, DECREASE_BY = 6;

      movePartyImplicitly('left', movedSteps);
      party.world.nextEncounterSteps.should.equal(encounterStepsAtStart - movedSteps * DECREASE_BY);
    });

    it('should not decrease encounter steps if we are trying to move in invalid direction', function() {
      var encounterStepsAtStart = party.world.nextEncounterSteps;
      var movedSteps = 7, DECREASE_BY = 6;
      movePartyImplicitly('left', movedSteps);
      party.world.nextEncounterSteps.should.equal(encounterStepsAtStart - movedSteps * DECREASE_BY);

      // Make one more correct step.
      movedSteps++;
      movePartyImplicitly('left', 1);
      var encounterStepsAtLastValidMove = encounterStepsAtStart - movedSteps * DECREASE_BY;
      party.world.nextEncounterSteps.should.equal(encounterStepsAtLastValidMove);

      // Make one invalid step.
      movePartyImplicitly('left', 1);
      party.world.nextEncounterSteps.should.equal(encounterStepsAtLastValidMove);
    });

    it('should not let encounters occur when stepping on invalid tiles', function() {
      var movedSteps = 8;

      party.world.nextEncounterSteps = 200; // Make sure no battle occurs within the next 8 steps.
      movePartyImplicitly('left', movedSteps);
      party.world.nextEncounterSteps = 1; // Make sure that the next VALID step, a battle will occur.

      var callback = sinon.spy();
      party.move('left', TILE_SIZE, callback);
      callback.called.should.equal(false);
    });

    it('should play the right animation', function() {
      var sprite = party.sprites['walk'];
      var spy = sinon.spy(sprite.animations, 'play');

      party.vehicles.push('boat');
      party.currentVehicle.should.equal('walk');
      movePartyImplicitly('up', 1);
      spy.calledWith('walkUp').should.equal(true);
      movePartyImplicitly('down', 1);
      spy.calledWith('walkDown').should.equal(true);
      movePartyImplicitly('left', 1);
      spy.calledWith('walkSideways').should.equal(true);
      movePartyImplicitly('down', 1);
      spy.calledWith('boatDown').should.equal(true);
      party._changeVehicle('boat');
      movePartyImplicitly('down', 1);
      spy.calledWith('boatDown').should.equal(true);

      sprite.animations.play.restore();
    });

    // This test cannot be fully completed right now because the following features are not implemented:
    // switching from boots to boat, from boat to canue, canue to boots, boots to canue, etc
    // entering locations (caves, towns)
    // maybe something else i forget
    it('should move correctly through the world map', function() {
      movePartyImplicitly('left', 2);
      movePartyImplicitly('up', 2);
      party.world.sprite.tilePosition.x.should.equal(1920);
      party.world.sprite.tilePosition.y.should.equal(1440);
      movePartyImplicitly('up', 1);
      party.world.sprite.tilePosition.y.should.equal(1440);
      movePartyImplicitly('left', 2);
      party.currentTile().should.equal('forest');
      movePartyImplicitly('left', 5);
      party.world.sprite.tilePosition.x.should.equal(2032);
      movePartyImplicitly('left', 1);
      party.world.sprite.tilePosition.x.should.equal(2032);
    });
  });
});
