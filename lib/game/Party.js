var Party = function(sprite, cursors, world) {
    this.sprite   = sprite;
    this.cursors  = cursors;
    this.world    = world;
    this.vehicles = ["boots"] // List of vehicles that the party has.
    this.currentVehicle = "boots";

    this.loadForbiddenTiles = function() {
        if(this.currentVehicle == "boots") return ["sea", "mountain"];
        


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
        var forbiddenTiles = this.loadForbiddenTiles();
        if(forbiddenTiles.indexOf(world.next(direction)) != -1) return false;
        return true;
    }

    this.move = function(pixels) {
        var sprite = world.sprite;
        if(cursors.left.isDown) {
            if(!this.moveIsValid("left")) return;
            sprite.tilePosition.x += pixels;
        }
        else if(cursors.right.isDown) {
            if(!this.moveIsValid("right")) return;
            sprite.tilePosition.x -= pixels;
        }
        if(cursors.up.isDown) {
            if(!this.moveIsValid("top")) return;
            sprite.tilePosition.y += pixels;
        }
        else if (cursors.down.isDown) {
            if(!this.moveIsValid("down")) return;
            sprite.tilePosition.y -= pixels;
        }
    }
}