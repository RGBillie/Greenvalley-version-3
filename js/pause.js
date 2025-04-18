class Pause {
  create(data) {
    // Hent hvilket level man er på
    this.callingSceneKey = data.from || 'menu';

    this.paused = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'paused').setOrigin(0.5, 0.5);

    // KEYS 
    this.keys = this.input.keyboard.addKeys({
      c: Phaser.Input.Keyboard.KeyCodes.C,
      p: Phaser.Input.Keyboard.KeyCodes.P,
  });
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.p)) {
      if (this.scene.isPaused(this.callingSceneKey)) {
        this.scene.resume(this.callingSceneKey);
        this.paused.setVisible(false)
      } else {
        this.scene.wake(this.callingSceneKey);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.c)) {
      if (this.scene.isPaused(this.callingSceneKey)) {
        this.scene.resume(this.callingSceneKey);
      } else {
        this.scene.wake(this.callingSceneKey);
      }
    }
  }
}
