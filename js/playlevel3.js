class Playlevel3 extends Phaser.Scene {
    interactableObjects = [];
    interactedObjects = [];
    emberIsSad = false;
    currentInteractable = null;
  constructor() {
      super({ key: "Playlevel3" });
  }

  preload() {
    this.isInDialogue = false;
  }

  create() {
    this.isLowEndDevice = this.game.device.os.android || 
        this.game.device.os.iOS || 
        (this.game.device.browser.safari && !this.game.device.os.desktop) || 
        (this.textures.get('ground').getSourceImage().width < 4096);

    if (this.isLowEndDevice) {
        // Reduce particles if you have any
        if (this.rain && this.rain.setQuantity) {
            this.rain.setQuantity(5);
        }

        // Disable some effects if they exist
        if (this.colorOverlay) {
            this.colorOverlay.setVisible(false);
        }

        // Reduce physics checks
        this.physics.world.setFPS(30);
    }

    
    this.buildingColliders = this.physics.add.staticGroup();
    this.treeColliders = this.physics.add.staticGroup();
    this.stoneColliders = this.physics.add.staticGroup();
    this.fenceColliders = this.physics.add.staticGroup();
    this.flowerColliders = this.physics.add.staticGroup();
    this.benchColliders = this.physics.add.staticGroup();

    this.add.image(0, 0, "ground").setOrigin(0, 0);
    this.depthSortedObjects = [];
    const objects = [

        //Lake
        { x: 650, y: 1430, key: "lakeweeds" },
        { x: 840, y: 2330, key: "smalllakeweeds" },
        { x: 1450, y: 2200, key: "lakeweeds" },
        { x: 1620, y: 1370, key: "smalllakeweeds" },
        { x: 1820, y: 1530, key: "mediumstone" },
        { x: 600, y: 1550, key: "smallstone" },
        { x: 1350, y: 2300, key: "tinystone" },
        { x: 1050, y: 2330, key: "mediumstone" },
        { x: 450, y: 2050, key: "leaves" },

        //Right Border Trees
        { x: 5200, y: 4330, key: "tree1" },
        { x: 5200, y: 3930, key: "tree2" },
        { x: 5200, y: 3430, key: "tree3" },
        { x: 5200, y: 2930, key: "tree1" },
        { x: 5200, y: 2430, key: "tree2" },
        { x: 5200, y: 2030, key: "tree1" },
        { x: 5200, y: 1130, key: "tree2" },
        { x: 5200, y: 630, key: "tree1" },
        { x: 5200, y: 190, key: "tree3" },

        //Top Field
        { x: 1200, y: 730, key: "tree2" },
        { x: 2200, y: 180, key: "tree1" },
        { x: 3200, y: 290, key: "tree3" },
        { x: 4200, y: 630, key: "tree2" },
        { x: 700, y: 330, key: "tree1" },
        { x: 1900, y: 990, key: "tree3" },
        
        { x: 1500, y: 1130, key: "plainbush1" },
        { x: 2500, y: 540, key: "plainbush2" },
        { x: 3400, y: 1290, key: "bushblueflowers" },
        { x: 4400, y: 1130, key: "plainbush1" },
        { x: 600, y: 830, key: "bushpinkflowers" },
        { x: 2000, y: 1400, key: "plainbush2" },
        { x: 4700, y: 530, key: "bushpinkflowers" },
        { x: 3700, y: 400, key: "plainbush2" },
        { x: 3300, y: 700, key: "deadbush" },
        { x: 1600, y: 400, key: "deadbush" },
        { x: 400, y: 1300, key: "deadbush" },
        { x: 4800, y: 1400, key: "deadbush" },

        { x: 2660, y: 1020, key: "firepit" },
        { x: 2650, y: 800, key: "leaves" },
        { x: 2950, y: 900, key: "leaves" },
        { x: 3000, y: 1100, key: "leaves" },
        { x: 2800, y: 1250, key: "leaves" },
        { x: 2400, y: 1200, key: "leaves" },
        { x: 2350, y: 950, key: "leaves" },

        //Center
        { x: 2810, y: 3320, key: "firepit" },
        { x: 2800, y: 3100, key: "leaves" },
        { x: 3100, y: 3200, key: "leaves" },
        { x: 3150, y: 3400, key: "leaves" },
        { x: 2950, y: 3550, key: "leaves" },
        { x: 2550, y: 3500, key: "leaves" },
        { x: 2500, y: 3250, key: "leaves" },

        //Houses
        { x: 2450, y: 2800, key: "emberhouse", text: "All the houses are empty. I wonder where they went.", isHouse: true },
        { x: 2800, y: 2800, key: "emberhousenoroof" },
        { x: 3150, y: 2800, key: "emberhouseroofhalfoff" },
        { x: 3500, y: 2400, key: "emberhouse" },
        { x: 3800, y: 2800, key: "emberhousenoroof" },
        { x: 3800, y: 3100, key: "emberhouseroofhalfoff" },
        { x: 1830, y: 2800, key: "emberhouse" },
        { x: 1790, y: 3100, key: "emberhousenoroof" },
        { x: 1800, y: 3400, key: "emberhouseroofhalfoff" },

        //Bottom half
        { x: 600, y: 3030, key: "tree2" },
        { x: 1300, y: 2480, key: "tree1" },
        { x: 2300, y: 2000, key: "tree3" },
        { x: 4400, y: 3230, key: "tree2" },
        { x: 4700, y: 2330, key: "tree1" },
        { x: 4100, y: 1900, key: "tree3" },
        { x: 2400, y: 4230, key: "tree2" },
        { x: 3800, y: 3830, key: "tree1" },
        { x: 1100, y: 4300, key: "tree3" },

        { x: 2700, y: 2330, key: "plainbush1" },
        { x: 4000, y: 3540, key: "plainbush2" },
        { x: 3800, y: 2290, key: "bushpinkflowers" },
        { x: 1400, y: 2900, key: "plainbush2" },
        { x: 2600, y: 3630, key: "bushblueflowers" },
        { x: 1000, y: 3400, key: "plainbush1" },
        { x: 1700, y: 3600, key: "bushpinkflowers" },
        { x: 4400, y: 2700, key: "plainbush1" },
        { x: 4700, y: 3400, key: "deadbush" },
        { x: 400, y: 3400, key: "deadbush" },
        { x: 2700, y: 2000, key: "deadbush" },
        { x: 400, y: 4000, key: "plainbush2" },
        { x: 3200, y: 4100, key: "bushpinkflowers" },
        { x: 4400, y: 4000, key: "plainbush1" },
        { x: 2000, y: 4100, key: "deadbush" },

        { x: 2900, y: 2200, key: "redflower" },
        { x: 3900, y: 1400, key: "blueflower" },
        { x: 900, y: 3600, key: "whiteflower" },
        { x: 4200, y: 3700, key: "redflower" },
        { x: 400, y: 2400, key: "blueflower" },
        { x: 3900, y: 2600, key: "whiteflower" },

        { x: 3600, y: 2000, key: "leaves" },
        { x: 4300, y: 1400, key: "leaves" },
        { x: 500, y: 3600, key: "leaves" },

        { x: 900, y: 1200, key: "smallfog" },
        { x: 1400, y: 900, key: "smallfog" },
        { x: 3400, y: 500, key: "smallfog" },

        { x: 3400, y: 2200, key: "emberteddy", text: "They must have been in a hurry if they left behind  a childs teddy..." },
        { x: 4800, y: 1580, key: "emberfootprints", text: "These footprints... they lead into the forest."},
        { x: 2900, y: 2480, key: "emberfootprints" },
    ];

    // In your create() function:
this.interactableObjects = objects.filter(obj => obj.text); // Only objects with text
this.interactedObjects = []; // Tracks which objects have been interacted with

this.interactableObjects.forEach(obj => {
    // Create question mark
    obj.questionMark = this.add.sprite(obj.x, obj.y - 200, 'questionmark')
    .setDepth(1800)
    .setScale(0.8)
    .setVisible(false);

// Store the original position for interaction checks
obj.interactionPosition = { x: obj.x, y: obj.y }; // Use this for distance checks

// Hover properties
obj.questionMark.hoverHeight = 20;
obj.questionMark.baseY = obj.y - 200;

    // Create interaction zone (invisible physics body)
    obj.interactionZone = this.physics.add.sprite(obj.x, obj.y, 'invisible')
        .setSize(150, 150)
        .setVisible(false);
});
    

// Categorize and set depths for all objects, and automatically create hitboxes for each object type
objects.forEach(data => {
    let obj = this.add.image(data.x, data.y, data.key);
    obj.setDepth(obj.y);
    this.depthSortedObjects.push(obj);

    if (typeof data.key === 'string') {
        // Automatically create colliders based on object types
        if (data.key.includes("house")) {
            // Buildings
            let hitbox = this.buildingColliders.create(data.x, obj.getBottomCenter().y - 20, null);
            hitbox.setSize(obj.width * 0.87, 100);
            hitbox.setOffset(-obj.width * 0.4, -50);
            hitbox.setAlpha(0);
        } else if (data.key.includes("tree")) {
            // Trees
            let hitbox = this.treeColliders.create(data.x, obj.getBottomCenter().y - 80, null);
            hitbox.setSize(obj.width * 0.4, 70);
            hitbox.setOffset(-obj.width * 0.2, +25);
            hitbox.setAlpha(0);
        } else if (data.key.includes("stone")) {
            // Stones
            let hitbox = this.stoneColliders.create(data.x, obj.getBottomCenter().y - 40, null);
            hitbox.setSize(obj.width * 0.7, 50);
            hitbox.setOffset(-obj.width * 0.15, +25);
            hitbox.setAlpha(0);
        } else if (data.key.includes("fence") || data.key.includes("roadsign")) {
            // Fences
            let hitbox = this.fenceColliders.create(data.x, obj.getBottomCenter().y - 40, null);
            let hitboxWidth = obj.width - 70; // New wider width
            hitbox.setSize(hitboxWidth, 50); // Set the new width for the hitbox
            hitbox.setOffset(-hitboxWidth / 2, +25);
            hitbox.setAlpha(0);
        } else if (data.key.includes("bush")) {
            // Flowers & Bushes
            let hitbox = this.flowerColliders.create(data.x, obj.getBottomCenter().y - 10 -20, null);
            hitbox.setSize(obj.width * 0.5, 50);
            hitbox.setOffset(-obj.width * 0.25, +25);
            hitbox.setAlpha(0);
        } else if (data.key.includes("bench") || data.key === "firepit") {
            // Benches & Firepits
            let hitbox = this.benchColliders.create(data.x, obj.getBottomCenter().y - 40, null);
            hitbox.setSize(obj.width * 0.8, 50);
            hitbox.setOffset(-obj.width * 0.1, +20);
            hitbox.setAlpha(0);
        }
    }
});
    this.lilypads = this.add.sprite(1200, 1850, "lilypads").setDepth(1).setFlipX(true),
    this.lilypads.play("lilypads"),

      // **PLACERING AF VEJE OG PLADS**
      this.add.image(2322, 2510, "glade1roads").setDepth(1);

      this.block = this.physics.add.staticGroup();
      this.block.create(5230, 820).setSize(50, 1500).setOrigin(0.5, 0.5);
      this.block.create(5230, 2930).setSize(50, 2050).setOrigin(0.5, 0.5);
      this.block.create(5230, 4380).setSize(50, 200).setOrigin(0.5, 0.5);

      //MUSIC
      this.music = this.sound.add('musicSad', { loop: true, volume: 0.1 });
      this.music.play()

      // **TILFØJ SPILLEREN (ALEX)**
      const playerState = this.registry.get('playerState') || { 
        texture: 'alex', 
        isCarryingEmber: false 
        };
        
        this.player = this.physics.add.sprite(200, 3770, playerState.texture, 2);

        this.time.delayedCall(100, () => {
            this.player.setTexture(playerState.texture, 2);
        });


      this.depthSortedObjects.push(this.player);
      this.player.body.setSize(this.player.width * 0.5, 20);
      this.player.body.setOffset(this.player.width * 0.25, this.player.height - 20);
      this.physics.add.collider(this.player, this.buildingColliders);
      this.physics.add.collider(this.player, this.treeColliders);
      this.physics.add.collider(this.player, this.stoneColliders);
      this.physics.add.collider(this.player, this.fenceColliders);
      this.physics.add.collider(this.player, this.flowerColliders);
      this.physics.add.collider(this.player, this.benchColliders);
      this.physics.add.collider(this.player, this.block);


      if (this.emberFollowing && !this.emberCarried) {
        if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
            
            // Only change animation if Ember isn't sad
            if (!this.emberIsSad) {
                if (this.player.body.velocity.x > 0) {
                    this.ember.flipX = false;
                    this.ember.anims.play('ember_walk', true);
                } else if (this.player.body.velocity.x < 0) {
                    this.ember.flipX = true;
                    this.ember.anims.play('ember_walk', true);
                } else if (this.player.body.velocity.y > 0) {
                    this.ember.flipX = false;
                    this.ember.anims.play('ember_walk_back', true);
                } else if (this.player.body.velocity.y < 0) {
                    this.ember.flipX = false;
                    this.ember.anims.play('ember_walk_front', true);
                }
            }
        }
    }

    if (playerState.isCarryingEmber) {
        this.ember = this.add.sprite(0, 0, this.emberIsSad ? "embersad" : "ember")
            .setVisible(false)
            .setDepth(1501);
        this.emberCarried = true;
    } else {
        const texture = this.emberIsSad ? "embersad" : "ember";
        this.ember = this.add.sprite(this.player.x - 120, this.player.y + 80, texture)
            .setVisible(true)
            .setDepth(1501);
        
        if (!this.emberIsSad) {
            this.ember.anims.play("ember_idle_front", true);
        }
        this.emberCarried = false;
    }
    
        // 4. Shared setup
        this.depthSortedObjects.push(this.ember);
        this.emberFollowing = !playerState.isCarryingEmber; // ← Sync following state
        this.emberPickUp = false;

      // **KAMERAET FØLGER SPILLEREN**
      this.cameras.main.setBounds(0, 0, 5200, 4400);
      this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
      this.cameras.main.setZoom(0.4);
      this.player.setVisible(true);

      // **TILFØJ TASTATURSTYRING**
      this.keys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        e: Phaser.Input.Keyboard.KeyCodes.E,
        f: Phaser.Input.Keyboard.KeyCodes.F,
        p: Phaser.Input.Keyboard.KeyCodes.P,
        c: Phaser.Input.Keyboard.KeyCodes.C,
        arrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
        arrowDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
        arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
        arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT
    });

      // **GRÆNSER (EDGE COLLISIONS)**
      this.edges = this.physics.add.staticGroup();
      this.edges.create(2600, 0, "topedgefence").setOrigin(0.5, 0).setVisible(false);
      this.edges.create(-100, 1590, "rightedgeforest").setOrigin(-0.3, 0.5).setDepth(1505).setFlipX(true);
      this.edges.create(1200, 1900, "lake").setDepth(0);
      this.edges.create(2630, 4250, "plainbushedge").setOrigin(0.5, 0).setDepth(1502).setOffset(0 , 190);
      this.edges.create(2630, 0, "plainbushedge").setOrigin(0.5, 0).setDepth(0).setOffset(0 , 90).setFlipY(true);

      // **KOLLISION MELLEM SPILLER OG GRÆNSER**
      this.physics.add.collider(this.player, this.edges);

     // 1. First create all UI elements
        let camera = this.cameras.main;

        this.dialogBubble = this.add.image(this.cameras.main.centerX, this.cameras.main.height + 250, 'textbubble').setOrigin(0.5, 0.5).setDepth(1703).setVisible(false).setScrollFactor(0); // Start hidden

        // Create the text object
        this.dialogText = this.add.text(
            this.dialogBubble.x - this.dialogBubble.width/2 + 70, 
            this.dialogBubble.y - this.dialogBubble.height/2 + 50,
            '', 
            { 
                fontSize: "48px", 
                color: "#000", 
                align: "left", 
                fontFamily: '"arial", sans-serif',
                wordWrap: { width: this.dialogBubble.width - 140 }
            }
        )
        .setScrollFactor(0)  // Also fixed to camera
        .setDepth(1804)
        .setVisible(false);

        // Position text relative to bubble
        this.dialogText.setPosition(
            this.dialogBubble.x - 720, 
            this.dialogBubble.y - this.dialogBubble.height / 2 + 50
        );

        // 2. Now call the function with the text
        this.writeTextNpc('What have happened here? Maybe I can find some clues to what happened to the settlement, and where they have gone to.');
       
        this.add.image(this.cameras.main.centerX-920, this.cameras.main.centerY-500, 'tips').setScrollFactor(0).setDepth(9999);
  }

  update() {
    this.currentInteractable = null;

    if (this.emberCarried) {
        handlePlayerMovementWithEmber(this.player, this.keys, this.depthSortedObjects);
    } else {
        handlePlayerMovement(this.player, this.keys, this.depthSortedObjects);
    }

    if (this.emberFollowing && !this.emberCarried) {
        // Initialize movement tracking if needed
        if (this.ember.lastDirection === undefined) {
            this.ember.lastDirection = 'down';
            this.ember.isMoving = false;
        }
    
        // Calculate target position
        const targetX = this.player.x - 120;
        const targetY = this.player.y + 80;
        
        // Smooth movement
        this.ember.x = Phaser.Math.Linear(this.ember.x, targetX, 0.1);
        this.ember.y = Phaser.Math.Linear(this.ember.y, targetY, 0.1);
        
        // Store previous movement state
        const wasMoving = this.ember.isMoving;
        this.ember.isMoving = (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0);
        
        // Handle animations based on movement
        const prefix = this.emberIsSad ? "embersad_" : "ember_";
        
        if (this.ember.isMoving) {
            if (this.player.body.velocity.x > 0) {
                this.ember.flipX = false;
                this.ember.anims.play(prefix + 'walk', true);
                this.ember.lastDirection = 'right';
            } else if (this.player.body.velocity.x < 0) {
                this.ember.flipX = true;
                this.ember.anims.play(prefix + 'walk', true);
                this.ember.lastDirection = 'left';
            } else if (this.player.body.velocity.y > 0) {
                this.ember.flipX = false;
                this.ember.anims.play(prefix + 'walk_back', true);
                this.ember.lastDirection = 'down';
            } else if (this.player.body.velocity.y < 0) {
                this.ember.flipX = false;
                this.ember.anims.play(prefix + 'walk_front', true);
                this.ember.lastDirection = 'up';
            }
        } 
        // Handle transition to idle
        else if (wasMoving) {
            this.ember.anims.stop(); // Stop current animation first
            
            switch (this.ember.lastDirection) {
                case 'left':
                    this.ember.anims.play(prefix + 'idle_side', true);
                    this.ember.flipX = true;
                    break;
                case 'right':
                    this.ember.anims.play(prefix + 'idle_side', true);
                    this.ember.flipX = false;
                    break;
                case 'up':
                    this.ember.anims.play(prefix + 'idle_back', true);
                    break;
                case 'down':
                    this.ember.anims.play(prefix + 'idle_front', true);
                    break;
            }
        }
    }
    

// In update():
this.interactableObjects.forEach(obj => {
    if (!this.interactedObjects.includes(obj.key)) {
        // Use interactionPosition instead of questionMark's position
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            obj.interactionPosition.x, obj.interactionPosition.y
        );
        
        // Toggle visibility
        obj.questionMark.setVisible(distance < 400);
        
        // Set as current interactable if close enough
        if (distance < 250) {
            this.currentInteractable = obj;
        }
    }
    
    // Hover animation (keep your existing code)
    if (obj.questionMark.visible) {
        obj.questionMark.hoverOffset = Math.sin(this.time.now / 300) * obj.questionMark.hoverHeight;
        obj.questionMark.y = obj.questionMark.baseY + obj.questionMark.hoverOffset;
    }
});

// Handle interaction input (keep your existing code)
if (this.currentInteractable && Phaser.Input.Keyboard.JustDown(this.keys.e) && !this.isInDialogue) {
    this.handleObjectInteraction(this.currentInteractable);
}

    if (Phaser.Input.Keyboard.JustDown(this.keys.f)) {
        if (this.emberFollowing || this.emberCarried) {
            this.pickUpEmber(); // Saml Ember op eller sæt Ember ned
        }
    }

    if (this.scene.isPaused()) return;
    if (!this.keys) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.p)) {
        if (!this.scene.isPaused()) { // Only pause if not already paused
          this.scene.pause();
          this.scene.launch('pause', { 
            from: 'Playlevel3' // <-- Make sure this matches EXACTLY your scene key
          });
        }
      }

    if (Phaser.Input.Keyboard.JustDown(this.keys.c)) {
        if (!this.scene.isPaused()) { // Only pause if not already paused
          this.scene.pause();
          this.scene.launch('help', { 
            from: 'Playlevel3' // <-- Make sure this matches EXACTLY your scene key
          });
        }
      }

    if (this.player.x > 5300) {
        this.registry.set('playerState', {
            texture: this.emberCarried ? 'alexember' : 'alex',
            isCarryingEmber: this.emberCarried
        });
        this.destroy()
        this.scene.start('Playlevel4', { currentLevel: this.scene.key });
    }
  }


  writeTextNpc(text) {
    this.dialogBubble.setVisible(true);
    this.dialogText.setVisible(true);
    
    // Typewriter effect
    let currentText = "";
    let index = 0;
    this.typewriterInterval = setInterval(() => {
        currentText += text[index];
        this.dialogText.setText(currentText);
        index++;

        if (index === text.length) {
            clearInterval(this.typewriterInterval);
            
            // Hide after delay
            this.time.delayedCall(3000, () => {
                this.dialogText.setVisible(false);
                this.dialogBubble.setVisible(false);
            });
        }
    }, 30);
}

    pickUpEmber() {
        if (this.emberCarried) {
            // Set Ember down (follow beside player)
            this.ember.setVisible(true); // Make Ember visible again
            this.ember.x = this.player.x - 120;
            this.ember.y = this.player.y + 80;
            this.emberFollowing = true; // Ember follows the player
            this.emberCarried = false; // Ember is no longer carried
            this.player.setTexture("alex"); // Change back to Alex's normal texture
            handlePlayerMovementWithEmber(this.player, this.keys, this.depthSortedObjects);
        } else {
            // Pick up Ember (carry Ember)
            this.ember.setVisible(false); // Hide Ember
            this.emberFollowing = false; // Ember no longer follows the player
            this.emberCarried = true; // Ember is now carried
            this.player.setTexture("alexember"); // Change to Alex with Ember texture
            handlePlayerMovement(this.player, this.keys, this.depthSortedObjects);
        }
    }

    handleObjectInteraction(obj) {
        // Mark as interacted
        this.interactedObjects.push(obj.key);
        obj.questionMark.setVisible(false);
        
        // Show dialog
        this.showDialog(obj.text);
        
        // Special case for house
        if (obj.isHouse && !this.emberIsSad) {
            this.makeEmberSad();
        }
    }

    showDialog(text) {
        // No need to reposition - elements are camera-fixed
        this.dialogBubble.setVisible(true);
        this.dialogText.setVisible(true);
        this.isInDialogue = true;
        // Typewriter effect
        let currentText = "";
        let index = 0;
        
        // Clear any existing interval
        if (this.typewriterInterval) clearInterval(this.typewriterInterval);
        
        this.typewriterInterval = setInterval(() => {
            if (index < text.length) {
                currentText += text[index];
                this.dialogText.setText(currentText);
                index++;
            } else {
                clearInterval(this.typewriterInterval);
                this.time.delayedCall(4000, () => {
                    this.dialogBubble.setVisible(false);
                    this.dialogText.setVisible(false);
                    this.isInDialogue = false;
                });
            }
        }, 30);
    }

    makeEmberSad() {
        this.emberIsSad = true;
        
        // Immediately change to sad texture
        this.ember.setTexture("embersad");
        this.ember.anims.stop();
        
        // Store original position
        const originalX = this.ember.x;
        const originalY = this.ember.y;
        
        // Disable following during animation
        const wasFollowing = this.emberFollowing;
        this.emberFollowing = false;
    
        // Create a custom sequence with manual flipping
        const lookSequence = [
            { frame: 3, flipX: false }, // front
            { frame: 4, flipX: false }, // back
            { frame: 2, flipX: false }, // right
            { frame: 2, flipX: true },  // left
            { frame: 3, flipX: false }  // front again
        ];
        
        let currentStep = 0;
        const playNextStep = () => {
            if (currentStep < lookSequence.length) {
                const step = lookSequence[currentStep];
                this.ember.setFrame(step.frame);
                this.ember.flipX = step.flipX;
                currentStep++;
                this.time.delayedCall(1000, playNextStep);
            } else {
                // After animation completes
                this.emberFollowing = wasFollowing;
                this.ember.setTexture("embersad");
                this.ember.x = originalX;
                this.ember.y = originalY;
                this.ember.anims.play("embersad_idle_front");
            }
        };
        
        // Start the sequence
        playNextStep(); 
    }
    destroy() {
        // Clean up particles
        if (this.rain) {
            this.rain.destroy();
        }
        
        // Clean up intervals
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
        
        // Clean up sounds
        if (this.music) {
            this.music.stop();
            this.music.destroy();
        }
        
        // Clean up any other custom objects
        if (this.interactableObjects) {
            this.interactableObjects.forEach(obj => {
                if (obj.questionMark) obj.questionMark.destroy();
                if (obj.interactionZone) obj.interactionZone.destroy();
            });
        }
        
    }
    
}