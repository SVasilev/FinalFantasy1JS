/* global Common, Unit, GameConstants, _ */

// Extends Unit.
Character.prototype = Object.create(Unit.prototype);
Character.prototype.constructor = Character;
function Character(phaserGame, x, y, spriteKey) {
  var jsonData = phaserGame.cache.getJSON(GameConstants.ASSETS_KEYS.CHARACTERS_DATA_JSON);
  var characterData = _.findWhere(jsonData, { role: spriteKey });
  Unit.call(this, phaserGame, x, y, spriteKey, characterData);

  this.role = spriteKey;
  this._attachAnimations(phaserGame, spriteKey);
}

Character.prototype._attachAnimations = function(phaserGame, spriteKey) {
  var spritesJsonKey = GameConstants.ASSETS_KEYS.IN_BATTLE_PARTY_SPRITES_DATA_JSON;
  var charactersConfig = phaserGame.cache.getJSON(spritesJsonKey);
  Common.createSpriteFromConfig(charactersConfig[spriteKey], this, true);
};

Character.prototype.kill = function() {
  Unit.prototype.kill.call(this);
  this.exists = true;
  this.health = 0;
};
