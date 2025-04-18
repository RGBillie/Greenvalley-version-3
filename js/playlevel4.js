class Playlevel4 extends Phaser.Scene {
    interactableObjects = [];
    interactedObjects = [];
    emberIsSad = false;
    currentInteractable = null;
    EDGE_PADDING = 60; 
    
  constructor() {
      super({ key: "Playlevel4" });
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
        { x: 650, y: 430, key: "lakeweeds" },
        { x: 840, y: 1330, key: "smalllakeweeds" },
        { x: 1450, y: 1200, key: "lakeweeds" },
        { x: 1620, y: 370, key: "smalllakeweeds" },
        { x: 1820, y: 530, key: "mediumstone" },
        { x: 600, y: 550, key: "smallstone" },
        { x: 1350, y: 1300, key: "tinystone" },
        { x: 1050, y: 1330, key: "mediumstone" },

        { x: 2150, y: 830, key: "bushpinkflowers" },
        { x: 750, y: 1830, key: "bushpinkflowers" },
        { x: 3050, y: 2230, key: "bushpinkflowers" },
        { x: 1350, y: 3230, key: "bushpinkflowers" },

        { x: 1150, y: 300, key: "bushblueflowers" },
        { x: 2150, y: 1900, key: "bushblueflowers" },
        { x: 900, y: 2900, key: "bushblueflowers" },
        { x: 2500, y: 1200, key: "bushblueflowers" },

        { x: 1900, y: 2400, key: "blueflower" },
        { x: 900, y: 400, key: "blueflower" },
        { x: 3200, y: 1400, key: "redflower" },
        { x: 1200, y: 3600, key: "redflower" },
        { x: 3000, y: 200, key: "whiteflower" },
        { x: 400, y: 2400, key: "whiteflower" },

        { x: 1900, y: 2700, key: "plainbush1" },
        { x: 2000, y: 1400, key: "plainbush2" },
        { x: 3200, y: 1400, key: "plainbush1" },
        { x: 900, y: 3600, key: "plainbush2" },
        { x: 2500, y: 200, key: "plainbush1" },
        { x: 400, y: 2400, key: "plainbush2" },
        
        { x: 2600, y: 2000, key: "leaves" },
        { x: 600, y: 1400, key: "leaves" },
        { x: 1200, y: 3400, key: "leaves" },

        { x: 2050, y: 330, key: "tree1" },
        { x: 350, y: 830, key: "tree2" },
        { x: 850, y: 1330, key: "tree3" },

        { x: 1050, y: 2730, key: "tree1" },
        { x: 2250, y: 1830, key: "tree2" },
        { x: 2850, y: 730, key: "tree3" },
        { x: 550, y: 3230, key: "tree3" },

        //Right field
        { x: 4050, y: 330, key: "tree1" },
        { x: 4550, y: 1330, key: "tree2" },
        { x: 4250, y: 1730, key: "tree3" },
        { x: 4850, y: 530, key: "tree2" },
        { x: 4250, y: 730, key: "tree3" },

        { x: 3850, y: 430, key: "leaves" },
        { x: 4850, y: 1830, key: "leaves" },
        { x: 3950, y: 2030, key: "leaves" },
        { x: 3850, y: 1230, key: "leaves" },

        { x: 3850, y: 1730, key: "blueflower" },
        { x: 4850, y: 2130, key: "redflower" },
        { x: 4650, y: 760, key: "redflower" },
        { x: 3950, y: 1030, key: "whiteflower" },

        { x: 3900, y: 630, key: "bushblueflowers" },
        { x: 4550, y: 1730, key: "bushblueflowers" },
        { x: 3850, y: 1430, key: "bushpinkflowers" },
        { x: 4750, y: 530, key: "bushpinkflowers" },
        { x: 4750, y: 2430, key: "bushpinkflowers" },

        //Bottom field
        { x: 3050, y: 3630, key: "tree1" },
        { x: 4550, y: 3730, key: "tree2" },
        { x: 4050, y: 3930, key: "tree3" },
        { x: 2050, y: 3930, key: "tree3" },
        { x: -50, y: 4100, key: "tree2" },

        { x: 3350, y: 4030, key: "bushblueflowers" },
        { x: 2150, y: 3300, key: "bushblueflowers" },
        { x: 2450, y: 3130, key: "bushpinkflowers" },
        { x: 1050, y: 4030, key: "bushblueflowers" },

        { x: 1850, y: 4030, key: "plainbush2" },
        { x: 4350, y: 3900, key: "plainbush1" },
        { x: 3650, y: 3530, key: "plainbush2" },

        { x: 1450, y: 4130, key: "leaves" },
        { x: 3650, y: 3900, key: "leaves" },
        { x: 2350, y: 3530, key: "leaves" },

        { x: 2450, y: 4130, key: "blueflower" },
        { x: 3400, y: 3600, key: "redflower" },
        { x: 650, y: 4030, key: "whiteflower" },

        //Center firepit
        { x: 3470, y: 2920, key: "firepit" },
        { x: 3460, y: 2700, key: "leaves" },
        { x: 3760, y: 2800, key: "leaves" },
        { x: 3810, y: 3000, key: "leaves" },
        { x: 3610, y: 3150, key: "leaves" },
        { x: 3210, y: 3100, key: "leaves" },
        { x: 3160, y: 2850, key: "leaves" },

         //Left firepit
         { x: 1470, y: 1920, key: "firepit" },
         { x: 1460, y: 1700, key: "leaves" },
         { x: 1760, y: 1800, key: "leaves" },
         { x: 1810, y: 2000, key: "leaves" },
         { x: 1610, y: 2150, key: "leaves" },
         { x: 1210, y: 2100, key: "leaves" },
         { x: 1160, y: 1850, key: "leaves" },

        //Houses
        { x: 4450, y: 3200, key: "emberhouse" },
        { x: 4650, y: 3000, key: "emberhouse" },
        { x: 4650, y: 2700, key: "emberhouse" },
        { x: 4450, y: 2500, key: "emberhouse" },
        { x: 4200, y: 2200, key: "emberhouse" },
        { x: 3850, y: 2200, key: "emberhouse" },

    ];

    //EMBERS
    this.emberRed = this.add.sprite(4350, 2650, "redember", 1);
    this.emberYellow = this.add.sprite(4450, 2730, "yellowember", 1);
    this.emberTeal = this.add.sprite(4500, 2900, "tealember", 1);
    this.emberKing = this.add.sprite(4300, 2850, "purpleember", 1);
    this.emberGreen = this.add.sprite(4400, 3050, "greenember", 1);

    this.depthSortedObjects.push(this.emberGreen, this.emberKing, this.emberTeal, this.emberYellow, this.emberRed);

        // Main exclamation mark (always visible)
        this.emberKing.exclamationMark = this.add.sprite(0, 0, 'exclamationmark'
        )
        .setDepth(1800)
        .setScale(0.8)
        .setVisible(true);

        // Edge indicator (for when off-screen)
        this.emberKing.edgeIndicator = this.add.sprite(0, 0, 'exclamationmarkarrow')
            .setDepth(2000)
            .setVisible(false)
            .setScale(1); 


            this.emberKing.edgePulseTween = this.tweens.add({
                targets: this.emberKing.edgeIndicator,
                scale: 1.2,
                duration: 600,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                paused: true  // Start paused
            });


        // Interaction configuration
        this.emberKing.interactionConfig = {
            text: "You have returned! Thank you human for leading him back to us, we left in a hurry due to extreme weather and we couldn't find him before having to leave. I guess you are from the village? There is a shortcut to the village up North.",
            interactionRange: 120,
            hasInteracted: false
        };

        // Add to interactable objects
        this.interactableObjects.push(this.emberKing.interactionConfig);

        // Create interaction zone
        this.emberKing.interactionZone = this.physics.add.sprite(
            this.emberKing.x, 
            this.emberKing.y, 
            'invisible'
        )
        .setSize(150, 150)
        .setVisible(false);

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
    this.lilypads = this.add.sprite(1200, 850, "lilypads").setDepth(1).setFlipX(true),
    this.lilypads.play("lilypads"),

      // **PLACERING AF VEJE OG PLADS**
      this.add.image(2410, 2180, "glade2roads").setDepth(0);

      this.block = this.physics.add.staticGroup();
      this.block.create(5230, 820).setSize(50, 1500).setOrigin(0.5, 0.5);
      this.block.create(5230, 2930).setSize(50, 2050).setOrigin(0.5, 0.5);
      this.block.create(5230, 4380).setSize(50, 200).setOrigin(0.5, 0.5);

      //MUSIC
      this.music = this.sound.add('musicCelebration', { loop: true, volume: 0.1 });
      this.music.play()

      // **TILFØJ SPILLEREN (ALEX)**
      const playerState = this.registry.get('playerState') || { 
        texture: 'alex', 
        isCarryingEmber: false 
        };
        
        this.player = this.physics.add.sprite(300, 3770, playerState.texture, 2);

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
        this.emberShouldStay = false;
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
      this.edges.create(-100, 1590, "rightedgeforest").setOrigin(-0.3, 0.5).setDepth(1505).setFlipX(true);
      this.edges.create(5220, 2200, "leftedgeforest").setOrigin(1, 0.5).setDepth(1505).setFlipX(true);
      this.edges.create(1200, 900, "lake").setDepth(0);
      this.edges.create(2630, 4250, "bush").setOrigin(0.5, 0).setDepth(1502).setOffset(0 , 190);
      this.edges.create(630, 0, "bush").setOrigin(0.5, 0).setDepth(0).setOffset(0 , 90).setFlipY(true);
      this.edges.create(6360, 0, "bush").setOrigin(0.5, 0).setDepth(0).setOffset(0 , 90).setFlipY(true);

      // **KOLLISION MELLEM SPILLER OG GRÆNSER**
      this.physics.add.collider(this.player, this.edges);

     // 1. First create all UI elements
        let camera = this.cameras.main;

        this.dialogBubble = this.add.image(this.cameras.main.centerX, this.cameras.main.height + 250, 'textbubble').setOrigin(0.5, 0.5).setDepth(1703).setVisible(false).setScrollFactor(0); // Start hidden
        this.dialogText = this.add.text(
            this.dialogBubble.x - this.dialogBubble.width/2 + 70, 
            this.dialogBubble.y - this.dialogBubble.height/2 + 50,
            '', 
            { 
                fontSize: "48px", 
                fontFamily: "'Arial'",
                color: "#000", 
                wordWrap: { width: this.dialogBubble.width - 140 }
            }
        )
        .setScrollFactor(0)  // Also fixed to camera
        .setDepth(1804)
        .setVisible(false);

        this.dialogText.setPosition(
            this.dialogBubble.x - 720, 
            this.dialogBubble.y - this.dialogBubble.height / 2 + 50
        );
  
        this.dialogOptions = [
            "I am going to miss him.",
            "I expected a reward.",
            "You are welcome!"
        ];
        
        let bubbleCenterX = this.dialogBubble.x;
        let bubbleBottomY = this.dialogBubble.y + this.dialogBubble.height/2;
        this.optionTexts = this.dialogOptions.map((option, index) => {
            let text = this.add.text(bubbleCenterX + 280, bubbleBottomY + 340 + (index * 60), option, { fill: '#000', fontFamily: '"arial", sans-serif' })
            .setVisible(false)
            .setDepth(2001)
            .setScrollFactor(0); // Important for camera-fixed UI
            return text;
        });
  
        this.isInDialogue = false;

        this.add.image(this.cameras.main.centerX-920, this.cameras.main.centerY-500, 'tips').setScrollFactor(0).setDepth(9999);
  }

  update() {
    this.currentInteractable = null;

    if (this.emberCarried) {
        handlePlayerMovementWithEmber(this.player, this.keys, this.depthSortedObjects);
    } else {
        handlePlayerMovement(this.player, this.keys, this.depthSortedObjects);
    }

    if (this.emberFollowing && !this.emberCarried && !this.emberShouldStay) {
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

// Update the ember king's exclamation mark position

    const mark = this.emberKing.exclamationMark;
    const king = this.emberKing;

    // Manual animation - more reliable than tween
    mark.setPosition(king.x, king.y - 150 + Math.sin(this.time.now / 400) * 20);

    // Handle edge indicator when off-screen
    this.updateEdgeIndicator()

    if (Phaser.Input.Keyboard.JustDown(this.keys.e) && 
    !this.isInDialogue && 
    !this.emberKing.interactionConfig.hasInteracted) {
    const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        this.emberKing.x, this.emberKing.y
    );
    
    if (distance < 220) {
        this.showEmberKingDialog();
    }
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
            from: 'Playlevel4' // <-- Make sure this matches EXACTLY your scene key
          });
        }
      }

    if (Phaser.Input.Keyboard.JustDown(this.keys.c)) {
        if (!this.scene.isPaused()) { // Only pause if not already paused
          this.scene.pause();
          this.scene.launch('help', { 
            from: 'Playlevel4' // <-- Make sure this matches EXACTLY your scene key
          });
        }
      }

    if (this.player.y < 0 && this.emberKing.interactionConfig.hasInteracted) {
        this.registry.set('playerState', {
            texture: this.emberCarried ? 'alexember' : 'alex',
            isCarryingEmber: this.emberCarried
        });
        this.destroy()
        this.scene.start('Playlevel5', { currentLevel: this.scene.key });
    }
  }

    pickUpEmber() {
        if (this.emberKing.interactionConfig.hasInteracted) {
            return; 
        }
        if (this.emberShouldStay) return;
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

    showDialog(text) {
        // No need to reposition - elements are camera-fixed
        this.dialogBubble.setVisible(true);
        this.dialogText.setVisible(true);
        
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
                this.time.delayedCall(7000, () => {
                    this.dialogBubble.setVisible(false);
                    this.dialogText.setVisible(false);
                });
            }
        }, 30);
    } 

    isSpriteInCamera(sprite) {
        const camera = this.cameras.main;
        const bounds = new Phaser.Geom.Rectangle(
            camera.worldView.x,
            camera.worldView.y,
            camera.worldView.width,
            camera.worldView.height
        );
        return bounds.contains(sprite.x, sprite.y);
    }

    showEmberKingDialog() { 
        // Handle Ember state before showing dialog
        if (this.emberCarried || this.emberFollowing) {
            // Place Ember near the king facing the correct direction
            this.ember.setVisible(true);
            this.ember.x = this.emberKing.x - 150;
            this.ember.y = this.emberKing.y + 50;
            this.ember.setDepth(this.emberKing.y);
            this.ember.isMoving = false;
            this.ember.anims.stop();
            
            // Set Ember to happy texture and correct animation
            this.ember.setTexture('happyember');
            this.ember.flipX = false; // Ensure correct facing direction
            
            // Update state flags
            this.emberCarried = false;
            this.emberFollowing = false;
            
            // Reset player to normal
            this.player.setTexture("alex");
        }
        
        // Reset player movement handler (without Ember)
        handlePlayerMovement(this.player, this.keys, this.depthSortedObjects);
        
        // Hide indicators
        this.emberKing.exclamationMark.setVisible(false);
        this.emberKing.edgeIndicator.setVisible(false);
        this.isInDialogue = true;
        
        // Show dialog UI
        this.dialogBubble.setVisible(true);
        this.dialogText.setVisible(true);
        this.dialogText.setText("");
        
        this.typeTextWithCallback(
            "My Friend! Thank you human for bringing him back! We left in a hurry due to extreme weather and couldn't find him before having to leave. Are you from the village? There is a shortcut up North.", 
            () => {
                this.showEmberKingOptions();
            }
        );
        this.makeEmbersHappy();
    }
    
    typeTextWithCallback(text, onComplete) {
        // Clear any existing interval
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
        
        let currentText = "";
        let index = 0;
        
        this.typewriterInterval = setInterval(() => {
            if (index < text.length) {
                currentText += text[index];
                this.dialogText.setText(currentText);
                index++;
            } else {
                clearInterval(this.typewriterInterval);
                if (onComplete) onComplete();
            }
        }, 30);
    }
    
    showEmberKingOptions() {
        let bubbleCenterX = this.dialogBubble.x;
        let bubbleBottomY = this.dialogBubble.y + this.dialogBubble.height/2;

        // Show each option with clear styling
        this.optionTexts.forEach((text, index) => {
            text.setPosition(bubbleCenterX - 650, bubbleBottomY - 220 + (index * 60))
                 .setVisible(true)
                 .setInteractive()
                 .setDepth(2001);
            
            // Visual feedback
            text.setStyle({
                fontSize: '42px',
                fontFamily: 'Arial',
                color: '#000000',
                backgroundColor: '#ffffff',
                padding: { x: 20, y: 10 }
            });
            
            // Clear old listeners
            text.off('pointerdown');
            
            // Add new listener
            text.on('pointerdown', () => {
                console.log("Option selected:", index); // Debug log
                this.handleEmberKingOptionSelection(index);
            });

            text.on('pointerover', () => {
                text.setStyle({ fill: '#ff0000', fontWeight: 'bold' });
                this.tweens.add({
                    targets: text,
                    scale: 1.05,
                    duration: 100
                });
            });
            
            text.on('pointerout', () => {
                text.setStyle({ fill: "#000", fontWeight: 'normal' });
                this.tweens.add({
                    targets: text,
                    scale: 1,
                    duration: 100
                });
            });
        });
    }
    
    handleEmberKingOptionSelection(index) {
        this.emberShouldStay = true;
        this.emberFollowing = false;
        this.emberCarried = false;

        this.emberKing.interactionConfig.hasInteracted = true;
    
        this.emberKing.exclamationMark.setVisible(false);
        this.emberKing.edgeIndicator.setVisible(false);
    
        // Position Ember near the king (adjust coordinates as needed)
        this.ember.x = this.emberKing.x - 150;
        this.ember.y = this.emberKing.y + 50;
        this.ember.setDepth(this.emberKing.y); // Maintain proper depth
        
        if (this.ember) {
            // Store current state to restore later
            this.ember.previousTexture = this.ember.texture.key;
            this.ember.setTexture('happyember');
            this.addJumpAnimation(this.ember);
        }
        // Hide all dialog elements
        this.hideEmberKingDialog();
    }
    
    hideEmberKingDialog() {
        this.dialogBubble.setVisible(false);
        this.dialogText.setVisible(false);
        this.optionTexts.forEach(text => {
            text.setVisible(false);
            text.removeAllListeners();
        });
        this.isInDialogue = false;
        this.player.body.setEnable(true);
        
    }
    
    // Alternative makeEmbersHappy() with staggered jumps

    makeEmbersHappy() {
        const allEmbers = [
            { sprite: this.emberRed, offset: 0 },
            { sprite: this.emberYellow, offset: 200 },
            { sprite: this.emberTeal, offset: 400 },
            { sprite: this.emberKing, offset: 600 },
            { sprite: this.emberGreen, offset: 800 },
        ];
    
        allEmbers.forEach(emberData => {
            if (emberData.sprite) {
                emberData.sprite.setFrame(0); // Happy frame
                
                // Unique jump animation for each ember
                this.tweens.add({
                    targets: emberData.sprite,
                    y: emberData.sprite.y - Phaser.Math.Between(30, 50), // Random jump height
                    duration: 600 + emberData.offset, // Staggered timing
                    delay: emberData.offset, // Offset start time
                    yoyo: true,
                    repeat: -1,
                    ease: 'Bounce.easeOut',
                    hold: Phaser.Math.Between(0, 300) // Random pause at top
                });
            }
        });

        if (this.ember) {
            // Store current state to restore later
            this.ember.previousTexture = this.ember.texture.key;
            this.ember.setTexture('happyember');
            this.addJumpAnimation(this.ember);
        }
    }

    addJumpAnimation(sprite) {
        this.tweens.add({
            targets: sprite,
            y: sprite.y - 40,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Bounce.easeOut'
        });
    }

    shutdown() {
        if (this.emberKing?.optionTexts) {
            this.emberKing.optionTexts.forEach(text => {
                text.destroy();
            });
        }
    }
    
    hideAllDialogElements() {
        this.dialogBubble.setVisible(false);
        this.dialogText.setVisible(false);
        this.optionTexts.forEach(text => text.setVisible(false));
    }

    updateEdgeIndicator() {
        if (!this.emberKing.interactionConfig.hasInteracted && 
            !this.isInDialogue) {
            
            const camera = this.cameras.main;
            const king = this.emberKing;
            const padding = this.EDGE_PADDING;
            
            if (!camera.worldView.contains(king.x, king.y)) {
                // Calculate position with padding
                let x = Phaser.Math.Clamp(
                    king.x, 
                    camera.worldView.left + padding, 
                    camera.worldView.right - padding
                );
                
                let y = Phaser.Math.Clamp(
                    king.y, 
                    camera.worldView.top + padding, 
                    camera.worldView.bottom - padding
                );
                
                // Force to edges with padding
                if (king.x < camera.worldView.left) x = camera.worldView.left + padding;
                if (king.x > camera.worldView.right) x = camera.worldView.right - padding;
                if (king.y < camera.worldView.top) y = camera.worldView.top + padding;
                if (king.y > camera.worldView.bottom) y = camera.worldView.bottom - padding;
                
                let angle = Phaser.Math.Angle.Between(x, y, king.x, king.y);
                
                this.emberKing.edgeIndicator
                    .setPosition(x, y)
                    .setRotation(angle)
                    .setVisible(true);
                
                // Resume the pulse tween when visible
                this.emberKing.edgePulseTween.resume();
            } else {
                this.emberKing.edgeIndicator.setVisible(false);
                // Pause the pulse tween when hidden
                this.emberKing.edgePulseTween.pause();
            }
        } else {
            this.emberKing.edgeIndicator.setVisible(false);
            this.emberKing.edgePulseTween.pause();
        }
    }

    destroy() {
        // Clean up particles (if you add them later)
        if (this.rain) {
            this.rain.destroy();
        }
    
        // Clean up special ember sprites
        if (this.emberRed) this.emberRed.destroy();
        if (this.emberYellow) this.emberYellow.destroy();
        if (this.emberTeal) this.emberTeal.destroy();
        if (this.emberKing) {
            if (this.emberKing.exclamationMark) this.emberKing.exclamationMark.destroy();
            if (this.emberKing.edgeIndicator) this.emberKing.edgeIndicator.destroy();
            if (this.emberKing.edgePulseTween) this.emberKing.edgePulseTween.stop();
            if (this.emberKing.interactionZone) this.emberKing.interactionZone.destroy();
        }
        if (this.emberGreen) this.emberGreen.destroy();
    
        // Clean up animations
        if (this.lilypads) {
            this.lilypads.destroy();
        }
    
        // Clean up intervals and timers
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
        if (this.emberFollowPlayer) {
            this.emberFollowPlayer.destroy();
        }
    
        // Clean up sounds
        if (this.music) {
            this.music.stop();
            this.music.destroy();
        }
    
        // Clean up UI elements
        if (this.dialogBubble) {
            this.dialogBubble.destroy();
        }
        if (this.dialogText) {
            this.dialogText.destroy();
        }
        if (this.tips) {
            this.tips.destroy();
        }
    
        // Clean up option texts
        this.optionTexts?.forEach(text => {
            text.destroy();
        });
    
        // Clean up all active tweens
        this.tweens.getTweens().forEach(tween => {
            if (tween.isPlaying()) {
                tween.stop();
            }
        });
    
        // Clean up collider groups
        this.buildingColliders?.destroy();
        this.treeColliders?.destroy();
        this.stoneColliders?.destroy();
        this.fenceColliders?.destroy();
        this.flowerColliders?.destroy();
        this.benchColliders?.destroy();
        this.edges?.destroy();
        this.block?.destroy();
    
        // Remove event listeners
        this.events.off('update');
        this.input.keyboard.off('keydown');
        this.input.keyboard.off('keyup');

    }
}