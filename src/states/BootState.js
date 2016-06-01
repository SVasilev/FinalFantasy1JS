/* global Phaser, LoadingState */

var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

function BootState() {}

BootState.prototype = {
  preload: function() {
    this.game.forceSingleUpdate = true;
    this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.scale.refresh();

    this.load.image('ff1logo', './assets/img/game/loading/ff-logo.png');
    this.load.image('progressbar', './assets/img/game/loading/progress-bar.gif');
    this.load.script('GameConstants', '../src/classes/GameConstants.js');
    this.load.script('loadingstate', '../src/states/LoadingState.js');
  },

  create: function() {
    this.game.state.add('LoadingState', LoadingState);
    this.game.state.start('LoadingState');
  }
};

game.state.add('BootState', BootState);
game.state.start('BootState');
