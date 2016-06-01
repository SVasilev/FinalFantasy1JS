/* global Phaser, Common, UnitActions, GameConstants, _ */

// Extends Phaser.Sprite, Mixin UnitActions.
Character.prototype = _.extend(Object.create(Phaser.Sprite.prototype), UnitActions.prototype);
Character.prototype.constructor = Character;
function Character(phaserGame, x, y, spriteKey) {
  Phaser.Sprite.call(this, phaserGame, x, y, spriteKey);

  var charactersData = phaserGame.cache.getJSON(GameConstants.ASSETS_KEYS.CHARACTERS_DATA);
  _.extendOwn(this, _.findWhere(charactersData, { role: spriteKey }));
  this.health = this.stats.HP;
  this.maxHealth = this.stats.maxHP;
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
