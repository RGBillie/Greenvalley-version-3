let game = new Phaser.Game({
  width: 1050,
  height: 740, 
  backgroundColor: '#95c180', 
  type: Phaser.AUTO, // Auto-switch to Canvas if WebGL fails
  render: {
    roundPixels: true,
    transparent: false
  },
  physics: {
    default: 'arcade',
    arcade: {
        debug: false,
        gravity: { y: 0 },
        fixedStep: true // Helps with physics stability
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,  // Your game's base width
    height: 720   // Your game's base height
  },
  parent: 'game',
  fps: {
    forceSetTimeOut: true  // Helps on slow CPUs
  }
});

game.scene.add('load', Load);
game.scene.add('menu', Menu);
game.scene.add('playlevel1', Playlevel1);
game.scene.add('playlevel2', Playlevel2);
game.scene.add('playlevel3', Playlevel3);
game.scene.add('playlevel4', Playlevel4);
game.scene.add('playlevel5', Playlevel5);
game.scene.add('ending', Ending);
game.scene.add('pause', Pause);
game.scene.add('help', Help);

game.scene.start('load');