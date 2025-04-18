class Ending extends Phaser.Scene {
  constructor() {
    super({ key: 'ending' });
  }

  create() {
        // 1. Create LARGE background (bigger than screen)
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.background = this.add.image(0, 0, 'background')
        .setOrigin(0, 0)
        .setDisplaySize(2800, 1700); // 2x screen size (adjust as needed)
  
      // 2. Set up camera controls
      this.cameras.main.setBounds(0, 0, 2800, 1700); // Match background size
      this.cameraSpeed = { x: 0.2, y: 0.2 };
      
      // Start camera at random position
      this.cameras.main.scrollX = Phaser.Math.Between(0, 1400);
      this.cameras.main.scrollY = Phaser.Math.Between(0, 700);
  
      // 3. Add your menu elements (fixed to camera)
      this.addMenuElements();

      //MUSIC
      this.music = this.sound.add('musicHappy', { loop: true, volume: 0.1 });
      this.music.play();

    // HJELPE TEKST OG BILLEDER    
    // Viser hjælpe teksten i menuen igen når man lukker help menuen
    this.events.on('resume', () => {
      this.startLabel.setVisible(true);
      this.spacebar.setVisible(true);
      this.controlstip.setVisible(true);
    });
    
    // KEYS
    this.cKey = this.input.keyboard.addKey('c');
  }

  update() {
    this.cameras.main.scrollX += this.cameraSpeed.x;
    this.cameras.main.scrollY += this.cameraSpeed.y;

    // Get camera position and screen bounds
    const cam = this.cameras.main;
    const screenWidth = cam.width;
    const screenHeight = cam.height;

    // Horizontal bounce
    if (cam.scrollX <= 0 || cam.scrollX >= 2800 - screenWidth) {
      this.cameraSpeed.x *= -1;
    }

    // Vertical bounce
    if (cam.scrollY <= 0 || cam.scrollY >= 1400 - screenHeight) {
      this.cameraSpeed.y *= -1;
    }
  }

  addMenuElements() {
    // Add all your menu items as camera-ignored elements
    const container = this.add.container(0, 0).setScrollFactor(0);
    
    // Title (centered on screen)
    const title = this.add.sprite(
      this.cameras.main.centerX, this.cameras.main.centerY, 
      'thanks'
    ).setOrigin(0.5);
    container.add(title);
  }
}
