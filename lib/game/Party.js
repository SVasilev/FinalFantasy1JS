var Party = function(sprite, cursors) {
    this.sprite  = sprite;
    this.cursors = cursors;

    this.move = function(pixels, sprite) {
        if (cursors.left.isDown) sprite.tilePosition.x += pixels;
        else if (cursors.right.isDown) sprite.tilePosition.x -= pixels;
        if (cursors.up.isDown) sprite.tilePosition.y += pixels;
        else if (cursors.down.isDown) sprite.tilePosition.y -= pixels;
    }
}