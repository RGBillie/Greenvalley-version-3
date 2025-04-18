class Help extends Phaser.Scene {
  constructor() {
    super({ key: 'help' });
  }

  create(data) { 
    this.callingSceneKey = data.from || 'menu';

    this.controls = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'controls').setOrigin(0.5);

    this.keys = {
      c: this.input.keyboard.addKey('C'),
      space: this.input.keyboard.addKey('SPACE')
    };

    this.spaceJustPressed = false;
    if (data.from === 'menu') {
      this.spaceJustPressed = false;
    }
  }

  update() {
    // Return to calling scene with C key
    if (Phaser.Input.Keyboard.JustDown(this.keys.c)) {
      this.closeHelp();
    }
    
    // Alternative close with Space if coming from menu
    if (this.callingSceneKey === 'menu' && Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      this.closeHelp();
    }
  }

  closeHelp() {
    this.scene.stop(); // Stop help scene
    
    // Wake the scene that launched us
    if (this.scene.isPaused(this.callingSceneKey)) {
      this.scene.resume(this.callingSceneKey);
    } else {
      this.scene.wake(this.callingSceneKey);
    }
  }
  
}
