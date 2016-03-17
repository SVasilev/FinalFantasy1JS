var Common = { // eslint-disable-line no-unused-vars
  createSpriteFromConfig: function(spriteConfig, spriteKey, visible, phaserGame) {
    var sprite = typeof spriteKey !== 'string' ? spriteKey :
                 phaserGame.add.sprite(phaserGame.width / 2, phaserGame.height / 2 - 35, spriteKey);
    sprite.scale.setTo(spriteConfig.scale.x, spriteConfig.scale.y);
    sprite.visible = visible;

    var animationData = spriteConfig.animation;
    for (var animation in animationData) {
      sprite.animations.add(animation, animationData[animation], 10, true);
    }
    return sprite;
  }
};
