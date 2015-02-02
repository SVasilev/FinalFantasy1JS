var Party = function(sprite, cursors, world) {
    this.sprite   = sprite;
    this.cursors  = cursors;
    this.world    = world;
    this.vehicles = ["boots"] // List of vehicles that the party has.
    this.currentVehicle = "boots";

    this.sprite.animations.add('walkDown', [0, 1], 10, true);
    this.sprite.animations.add('walkSide', [2, 3], 10, true);
    this.sprite.animations.add('walkTop', [4, 5], 10, true);

    this.loadForbiddenTiles = function() {
        if(this.currentVehicle === "boots") return ["sea", "mountain"];
        if(this.currentVehicle === "boat" || this.currentVehicle === "canue")  return ["grass", "forest", "mountain", "desert", "cold"];
        if(this.currentVehicle === "ship") return [];

        // 01: "sea",
        // 02: "grass",
        // 03: "forest",
        // 04: "mountain",
        // 05: "river",
        // 06: "shipyard",
        // 07: "desert",
        // 08: "cold"
    }

    this.moveIsValid = function(direction) {
        return this.loadForbiddenTiles().indexOf(world.next(direction)) == -1;
    }

    this.move = function(pixels) {
        if(cursors.left.isDown && this.moveIsValid("left")) {
            world.sprite.tilePosition.x += pixels;
            sprite.anchor.setTo(0, 0);
            sprite.scale.x = 3;
            this.sprite.animations.play('walkSide');
        }
        else if(cursors.right.isDown && this.moveIsValid("right")) {
            world.sprite.tilePosition.x -= pixels;
            sprite.anchor.setTo(1, 0);
            sprite.scale.x = -3;
            this.sprite.animations.play('walkSide');
        }
        else if(cursors.up.isDown && this.moveIsValid("top")) {
            world.sprite.tilePosition.y += pixels;
            this.sprite.animations.play('walkTop');
        }
        else if (cursors.down.isDown && this.moveIsValid("down")) {
            world.sprite.tilePosition.y -= pixels;
            this.sprite.animations.play('walkDown');
        }
        else {
            this.sprite.animations.stop();   
        }
        //this.sprite.animations.stop();
    }
}