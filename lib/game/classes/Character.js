/* global Phaser, Common, UnitActions, GameConstants, CharacterData, _ */

// Extends Phaser.Sprite, Mixin UnitActions.
Character.prototype = _.extend(Object.create(Phaser.Sprite.prototype), UnitActions.prototype);
Character.prototype.constructor = Character;
function Character(phaserGame, x, y, spriteKey) {
  Phaser.Sprite.call(this, phaserGame, x, y, spriteKey);
  this.characterData = new CharacterData(spriteKey);
  this.stats = this.characterData.stats;
  this.health = this.stats.hitPoints;
  this.maxHealth = this.stats.maxHitPoints;

  this._attachAnimations(phaserGame, spriteKey);
  phaserGame.add.existing(this);
}

Character.prototype._attachAnimations = function(phaserGame, spriteKey) {
  var spritesJsonKey = GameConstants.ASSETS_KEYS.IN_BATTLE_PARTY_SPRITES_DATA;
  var charactersConfig = phaserGame.cache.getJSON(spritesJsonKey);
  Common.createSpriteFromConfig(charactersConfig[spriteKey], this, true);
};

Character.prototype.kill = function() {
  Phaser.Sprite.prototype.kill.call(this);
  this.exists = true;
  this.health = 0;
};
