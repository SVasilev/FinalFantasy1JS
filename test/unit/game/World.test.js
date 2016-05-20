/* global describe, it */

var should = require('should'); // eslint-disable-line no-unused-vars
var assert = require('assert');
var stubs = require('../../test-utils/stubs');

describe('World class', function() {
  describe('calculatePlayerCooordinates method', function() {
    it('should calculate player coordinates for normal case', function() {
      var world = stubs.getWorldStub(1, 2);
      var coordinates = world.calculatePlayerCooordinates();
      coordinates.x.should.equal(10);
      coordinates.y.should.equal(5);
    });

    it('should calculate player coordinates for higher x', function() {
      var world = stubs.getWorldStub(31, 180);
      var coordinates = world.calculatePlayerCooordinates();
      coordinates.x.should.equal(9);
      coordinates.y.should.equal(235);
    });

    it('should calculate player coordinates for higher y', function() {
      var world = stubs.getWorldStub(1, 152);
      var coordinates = world.calculatePlayerCooordinates();
      coordinates.x.should.equal(10);
      coordinates.y.should.equal(237);
    });

    it('should calculate player coordinates for negative values', function() {
      var world = stubs.getWorldStub(-21, -152);
      var coordinates = world.calculatePlayerCooordinates();
      coordinates.x.should.equal(12);
      coordinates.y.should.equal(16);
    });
  });

  describe('generateNextEncounterSteps method', function() {
    it('should assign nextEncounterSteps to a number between 50 and 255', function() {
      var world = stubs.getWorldStub(-21, -152);
      assert(world.nextEncounterSteps >= 50 && world.nextEncounterSteps <= 255);
      world.generateNextEncounterSteps();
      assert(world.nextEncounterSteps >= 50 && world.nextEncounterSteps <= 255);
    });
  });
});
