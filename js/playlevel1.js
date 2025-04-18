class Playlevel1 extends Phaser.Scene {
  constructor() {
      super({ key: "Playlevel1" });
      this.hasSpokenToGreg = false;
  }

  preload() {
    this.isNearJacob = false;
    this.isNearLea = false;
    this.isNearGreg = false;
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
        //Buildings
        { x: 1550, y: 3330, key: "bluehouse" },
        { x: 4230, y: 3400, key: "orangehouse" },
        { x: 1350, y: 350, key: "greenhouse" },
        { x: 740, y: 3358, key: "purplehouse" },
        { x: 3200, y: 2000, key: "store" },
        { x: 1100, y: 1750, key: "cityhall" },

        //Right field
        { x: 3800, y: 1500, key: "tree2" },
        { x: 4000, y: 3000, key: "tree2" },
        { x: 4500, y: 1900, key: "tree3" },
        { x: 2550, y: 1900, key: "tree3" },
        { x: 4000, y: 1900, key: "bushblueflowers" },
        { x: 3900, y: 3850, key: "bushblueflowers" },
        { x: 4700, y: 3750, key: "bushpinkflowers" },
        { x: 4800, y: 2750, key: "bushpinkflowers" },
        { x: 3650, y: 2450, key: "bushpinkflowers" },
        { x: 4800, y: 2500, key: "redflower" },
        { x: 4600, y: 3200, key: "blueflower" },
        { x: 3900, y: 2200, key: "whiteflower" },
        { x: 4400, y: 2300, key: "mediumstone" },
        { x: 3800, y: 2500, key: "smallstone" },
        { x: 3900, y: 3600, key: "tinystone" },
        { x: 4650, y: 3850, key: "decorativefence" },
        { x: 3250, y: 2480, key: "decorativefence" },
        { x: 5000, y: 3800, key: "roadsignforest" },

        //Lake
        { x: 3050, y: 800, key: "decorativefence" },
        { x: 3850, y: 330, key: "lakeweeds" },
        { x: 4450, y: 430, key: "smalllakeweeds" },
        { x: 4450, y: 1200, key: "lakeweeds" },
        { x: 3420, y: 1070, key: "smalllakeweeds" },
        { x: 3950, y: 330, key: "mediumstone" },
        { x: 4550, y: 430, key: "smallstone" },
        { x: 4550, y: 1200, key: "tinystone" },
        { x: 3450, y: 1230, key: "mediumstone" },
        { x: 4750, y: 330, key: "bushpinkflowers" },
        { x: 4650, y: 1400, key: "bushblueflowers" },
        { x: 3050, y: 700, key: "bushpinkflowers" },
        { x: 4250, y: 330, key: "bench" },
        { x: 3050, y: 1200, key: "benchback" },
        { x: 3150, y: 1400, key: "redflower" },
        { x: 3550, y: 400, key: "blueflower" },
        { x: 4800, y: 700, key: "whiteflower" },

        //Gregs Field top
        { x: 2300, y: 500, key: "firepit" },
        { x: 2300, y: 300, key: "bench" },
        { x: 2300, y: 700, key: "benchback" },
        { x: 500, y: 300, key: "tree1" },
        { x: 1800, y: 100, key: "tree2" },
        { x: 1900, y: 500, key: "bushblueflowers" },
        { x: 2600, y: 300, key: "bushpinkflowers" },
        { x: 2800, y: 400, key: "smallstone" },
        { x: 2000, y: 400, key: "mediumstone" },

        //Gregs Field left
        { x: 1200, y: 1200, key: "bushblueflowers" },
        { x: 450, y: 1000, key: "bushpinkflowers" },
        { x: 500, y: 800, key: "smallstone" },
        { x: 1500, y: 1400, key: "mediumstone" },
        { x: 700, y: 1400, key: "tree3" },

        //Plaza
        { x: 700, y: 2250, key: "bench" },
        { x: 1500, y: 2250, key: "bench" },
        { x: 1100, y: 3050, key: "benchback" },
        { x: 1800, y: 2400, key: "bushpinkflowers" },
        { x: 400, y: 2500, key: "bushblueflowers" },
        { x: 1800, y: 3100, key: "bushblueflowers" },
        { x: 400, y: 3000, key: "tree2" },
        { x: 1000, y: 3250, key: "redflower" },
        { x: 1700, y: 2850, key: "blueflower" },
        { x: 400, y: 2300, key: "whiteflower" },

        //Firepit park
        { x: 3200, y: 2900, key: "bushpinkflowers" },
        { x: 2550, y: 3800, key: "bushblueflowers" },
        { x: 3100, y: 4000, key: "bushpinkflowers" },
        { x: 2650, y: 2850, key: "bushblueflowers" },
        { x: 3050, y: 2800, key: "decorativefence" },
        { x: 2600, y: 2800, key: "decorativefence" },
        { x: 2800, y: 3200, key: "firepit" },
        { x: 2800, y: 3000, key: "bench" },
        { x: 2800, y: 3400, key: "benchback" },
        { x: 3200, y: 3800, key: "tree1" },
        { x: 2700, y: 4000, key: "redflower" },
        { x: 3100, y: 3200, key: "blueflower" },
        { x: 2400, y: 3400, key: "whiteflower" },
        { x: 2400, y: 2900, key: "mediumstone" },
        { x: 3000, y: 2900, key: "smallstone" },
        { x: 2400, y: 3900, key: "tinystone" }
    ];

// Categorize and set depths for all objects, and automatically create hitboxes for each object type
objects.forEach(data => {
    let obj = this.add.image(data.x, data.y, data.key);
    obj.setDepth(obj.y);
    this.depthSortedObjects.push(obj);

    if (typeof data.key === 'string') {
        // Automatically create colliders based on object types
        if (data.key.includes("house") || data.key === "store" || data.key === "cityhall") {
            // Buildings
            let hitbox = this.buildingColliders.create(data.x, obj.getBottomCenter().y - 20, null);
            hitbox.setSize(obj.width * 0.87, 400);
            hitbox.setOffset(-obj.width * 0.4, -330);
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
        } else if (data.key.includes("fence")) {
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

        this.lilypads = this.add.sprite(4000, 800, "lilypads").setDepth(1501),
        this.lilypads.play("lilypads"),


      // **PLACERING AF VEJE OG PLADS**
      this.add.image(2664, 2271, "greenvalleyroads").setDepth(1);


      //MUSIC
      this.music = this.sound.add('musicCozy', { loop: true, volume: 0.1 });
      this.music.play();

      // **TILFØJ SPILLEREN (ALEX)**
      this.player = this.physics.add.sprite(2150, 4230, "alex", 3)
      this.depthSortedObjects.push(this.player);
      this.player.body.setSize(this.player.width * 0.5, 20);
      this.player.body.setOffset(this.player.width * 0.25, this.player.height - 20);
      this.physics.add.collider(this.player, this.buildingColliders);
      this.physics.add.collider(this.player, this.treeColliders);
      this.physics.add.collider(this.player, this.stoneColliders);
      this.physics.add.collider(this.player, this.fenceColliders);
      this.physics.add.collider(this.player, this.flowerColliders);
      this.physics.add.collider(this.player, this.benchColliders)

      this.ember = this.add.sprite(1250, 770, "ember").setVisible(false).setDepth(1501);
      this.depthSortedObjects.push(this.ember);
      this.ember.anims.play("ember_idle_front", true);
      this.emberFollowing = false;
      this.emberPickUp = false;
      this.emberCarried = false;

      this.emberFollowPlayer = this.time.addEvent({
        delay: 16,
        callback: this.followPlayer,
        callbackScope: this
        });

      // **KAMERAET FØLGER SPILLEREN**
      this.cameras.main.setBounds(0, 0, 5200, 4400);
      this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
      this.cameras.main.setZoom(0.4);
      this.player.setVisible(true);
      this.cameras.main.setDeadzone(100, 100); // Reduces small camera movements

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

      // **PLACERING AF NPC'ER**
      this.lea = this.physics.add.sprite(2845, 2300, "lea");
      this.jacob = this.physics.add.sprite(1550, 3600, "jacob").setDepth(1501);
      this.greg = this.add.sprite(1500, 700, "greg");
      this.greg.play("greg_swing");
      this.greg.setDepth(1501);
      this.depthSortedObjects.push(this.greg, this.jacob, this.lea);

      this.gregHitbox = this.physics.add.sprite(1500, 700, null);
      this.gregHitbox.setVisible(true);
      this.gregHitbox.setSize(400, 400);
      this.gregHitbox.setOrigin(0.5); 
      this.gregHitbox.body.setImmovable(true);

      // NPC Interaction System
        this.nearNPC = null; 
        this.interactionLock = false; 
        this.currentTalkingNPC = null;

        this.setupNPCInteraction(this.jacob, () => {
            // Find the full NPC data object from this.npcs array
            const npcData = this.npcs.find(n => n.sprite === this.jacob);
            this.showNPCDialog("Jacob:\nGreg is a bit odd. If you want an adventure go talk to him. But be cautious.", npcData);
        });
        
        this.setupNPCInteraction(this.lea, () => {
            const npcData = this.npcs.find(n => n.sprite === this.lea);
            this.showNPCDialog("Lea:\nThat old man Greg is weird. I wouldn't trust one word from him.", npcData);
        });
        
        this.setupNPCInteraction(this.gregHitbox, () => {
            this.showGregDialogue();
        });


      this.passageway = this.add.rectangle(5250, 4100, 100, 600, 0x00ff00);
      this.passageway.setInteractive(); 


        this.physics.world.enable(this.passageway);
        this.passageway.body.setAllowGravity(false);
        this.passageway.body.setImmovable(true);
        this.passageway.body.setSize(100, 600);

        this.physics.add.collider(this.player, this.passageway, this.onPassagewayCollide, null, this);

      this.gregHitbox.x = this.greg.x;
      this.gregHitbox.y = this.greg.y;

      // Dialog UI setup (skjult som standard)
      this.cameras.main.setRoundPixels(true);

      this.dialogBubble = this.add.image(this.cameras.main.centerX, this.cameras.main.height + 250, 'textbubble').setOrigin(0.5, 0.5).setDepth(1703).setVisible(false).setScrollFactor(0); // Start hidden

      // Create the text object
      this.dialogText = this.add.text(
          this.dialogBubble.x - this.dialogBubble.width/2 + 70, 
          this.dialogBubble.y - this.dialogBubble.height/2 - 50,
          '', 
          { 
              fontSize: "48px", 
              fontFamily: '"arial", sans-serif',
              color: "#000", 
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

      this.dialogOptions = [
          "Sure! I'll make sure that he gets home safe and sound!",
          "I guess I can do that!",
          "I hope to get something in return."
      ];
      this.selectedOption = 0;

      const screenCenterX = this.cameras.main.centerX;
      const screenBottomY = this.cameras.main.centerY + this.dialogBubble.height/2;
      
      this.optionTexts = this.dialogOptions.map((option, index) => {
          return this.add.text(
              screenCenterX, 
              screenBottomY + (index * 60), 
              option, 
              { 
                  fontFamily: 'Arial', 
                  fontSize: '42px',
                  color: '#000',
                  wordWrap: { width: 1500 }
              }
          ) // This is the key!
          .setScrollFactor(0)
          .setDepth(2001)
          .setVisible(false);
      });

      this.isInDialogue = false;


      // **BEVÆGELIGE NPCs' RUTER**
      this.npcs = [
        {
            sprite: this.jacob,
            speed: 200,
            stepIndex: 0,
            idleFrame: 3,
            route: [
            { x: 0, y: 180, anim: "jacob_walk_back", flip: false, stopTime: 0 },
            { x: 570, y: 0, anim: "jacob_walk", flip: false, stopTime: 0 },
            { x: 0, y: -1200, anim: "jacob_walk_front", flip: false, stopTime: 0 },
            { x: -700, y: 0, anim: "jacob_walk", flip: true, stopTime: 0 },
            { x: 0, y: -250, anim: "jacob_walk_front", flip: true, stopTime: 7000 },
            { x: 0, y: 250, anim: "jacob_walk_back", flip: true, stopTime: 0 },
            { x: 700, y: 0, anim: "jacob_walk", flip: false, stopTime: 0 },
            { x: 0, y: 1200, anim: "jacob_walk_back", flip: false, stopTime: 0 },
            { x: -570, y: 0, anim: "jacob_walk", flip: true, stopTime: 0 },
            { x: 0, y: -180, anim: "jacob_walk_front", flip: false, stopTime: 7000 },
            ]
        },
        {
            sprite: this.lea,
            speed: 200,
            stepIndex: 0,
            idleFrame: 3,
            route: [
            { x: 0, y: 280, anim: "lea_walk_back", flip: false, stopTime: 0 },
            { x: -700, y: 0, anim: "lea_walk", flip: true, stopTime: 0 },
            { x: 0, y: -1680, anim: "lea_walk_front", flip: false, stopTime: 0 },
            { x: 1000, y: 0, anim: "lea_walk", flip: false, stopTime: 9000 },
            { x: -1000, y: 0, anim: "lea_walk", flip: true, stopTime: 0 },
            { x: 0, y: 1680, anim: "lea_walk_back", flip: false, stopTime: 0 },
            { x: 700, y: 0, anim: "lea_walk", flip: false, stopTime: 0 },
            { x: 0, y: -280, anim: "lea_walk_front", flip: false, stopTime: 7000 },
            ]
        }
        ]
        this.npcs.forEach(npc => {
            npc.sprite.body.setEnable(true);
            npc.isMoving = false; // Add movement state tracking
            npc.currentStep = 0; // Track current route step
            npc.moveTimer = null; // Will store active timer
            npc.currentIdleAnim = null;
            npc.isPaused = false; // Make sure they start unpaused
            this.moveNPC(npc);
        });

        this.npcs.forEach(npc => {
            // Create chat bubble sprite instead of text
            npc.sprite.chatBubble = this.add.sprite(0, 0, 'chatbubble')
                .setOrigin(0.5, 1) // Anchor to bottom center
                .setDepth(1100)
                .setScale(0.5) // Adjust size as needed
                .setVisible(true);
            
            npc.sprite.hasBeenSpokenTo = false;
        });
        
        // For Greg (stationary NPC)
        this.greg.chatBubble = this.add.sprite(0, 0, 'chatbubble')
            .setOrigin(0.5, 1)
            .setDepth(1700)
            .setScale(0.5)
            .setVisible(true);
        this.greg.hasBeenSpokenTo = false;

      this.edges = this.physics.add.staticGroup();
      this.edges.create(2600, 0, "topedgefence").setOrigin(0.5, 0);
      this.edges.create(0, 2200, "leftedgeforest").setOrigin(0, 0.5).setDepth(5);
      this.edges.create(5200, 1930, "rightedgeforest").setOrigin(1, 0.5).setDepth(5);
      this.edges.create(4000, 900, "lake").setDepth(0);
      this.edges.create(5000, 4250, "bush").setOrigin(0.5, 0).setDepth(1502).setOffset(0 , 190);
      this.edges.create(-730, 4250, "bush").setOrigin(0.5, 0).setDepth(1502).setOffset(0 , 190);
      this.edges.create(2135, 4300, "gate").setDepth(1502).setOffset(0, 500);

      this.physics.add.collider(this.player, this.edges);

        this.dialogBubble.setVisible(true)
        this.dialogText.setVisible(true);

        this.writeTextNpc('Hello Adventurer! Welcome to Greenvalley! Go around and talk to some villagers. Someone might need some help!');

        this.time.delayedCall(9000, () => {
            this.dialogText.setVisible(false);
            this.dialogBubble.setVisible(false);
        });

        this.add.image(this.cameras.main.centerX-920, this.cameras.main.centerY-500, 'tips').setScrollFactor(0).setDepth(9999);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.e)) {
        if (this.nearNPC && !this.dialogBubble.visible) {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                this.nearNPC.npc.x, this.nearNPC.npc.y
            );
            
            if (distance < 350) {
                this.currentTalkingNPC = this.nearNPC;
                this.nearNPC.callback();
            }
        }
    }

    this.gregHitbox.x = this.greg.x;
    this.gregHitbox.y = this.greg.y;

    if (this.emberCarried) {
        handlePlayerMovementWithEmber(this.player, this.keys, this.depthSortedObjects);
    } else {
        handlePlayerMovement(this.player, this.keys, this.depthSortedObjects);
    }

    
    if (this.hasSpokenToGreg && !this.hintShown && !this.hintTimer) {
        this.showHint();
    }

    if (this.player.x > 5150 && !this.hasSpokenToGreg && !this.hintShown1) {  
        this.hintShown1 = true;
        
        // Clean up any existing elements first
        if (this.hintBubble1) {
            this.hintBubble1.destroy();
        }
        if (this.hintText1) {
            this.hintText1.destroy();
        }
        
        // Create hint bubble
        this.hintBubble1 = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.height + 450, 
            'textbubblesmall'
        )
        .setOrigin(0.5)
        .setDepth(1503)
        .setScrollFactor(0);
        
        // Add text
        this.hintText1 = this.add.text(
            this.hintBubble1.x,
            this.hintBubble1.y, 
            "You must talk to Greg first.",
            { 
                fontSize: '32px', 
                color: '#000', 
                fontFamily: 'Arial',
                wordWrap: { width: 400 } // Ensure text fits
            }
        )
        .setOrigin(0.5)
        .setDepth(1504)
        .setScrollFactor(0);
        
        // Clear any existing timer
        if (this.hintTimer1) {
            this.time.removeEvent(this.hintTimer1);
        }
        
        // Auto-hide after 4 seconds
        this.hintTimer1 = this.time.delayedCall(6000, () => {
            if (this.hintBubble1) {
                this.hintBubble1.destroy();
                this.hintBubble1 = null;
            }
            if (this.hintText1) {
                this.hintText1.destroy();
                this.hintText1 = null;
            }
            this.hintShown1 = false;
        }, [], this);
    }

    if (this.emberFollowing && !this.emberCarried) {
        if (this.ember.lastDirection === undefined) {
            this.ember.lastDirection = 'down';
            this.ember.isMoving = false;
        }

        const targetX = this.player.x - 120;
        const targetY = this.player.y + 80;
        
        this.ember.x = Phaser.Math.Linear(this.ember.x, targetX, 0.1);
        this.ember.y = Phaser.Math.Linear(this.ember.y, targetY, 0.1);
        
        const wasMoving = this.ember.isMoving;
        this.ember.isMoving = (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0);
        
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
        else if (wasMoving) {
            this.ember.anims.stop();
            
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

    if (Phaser.Input.Keyboard.JustDown(this.keys.f)) {
        if (this.emberFollowing || this.emberCarried) {
            this.pickUpEmber();
        }
    }

    if (!this.isInDialogue) {
        if (this.emberCarried) {
            handlePlayerMovementWithEmber(this.player, this.keys, this.depthSortedObjects);
        } else if (this.emberFollowing) {
            handlePlayerMovement(this.player, this.keys, this.depthSortedObjects);
        } else {
            handlePlayerMovement(this.player, this.keys, this.depthSortedObjects);
        }
    }

    this.npcs.forEach(npc => {
        if (npc.sprite.chatBubble && !npc.sprite.hasBeenSpokenTo) {
            // Smooth follow using lerp (linear interpolation)
            const bubble = npc.sprite.chatBubble;
            const targetX = npc.sprite.x + 40;
            const targetY = npc.sprite.y - 120;
            
            bubble.x = Phaser.Math.Linear(bubble.x, targetX, 0.2);
            bubble.y = Phaser.Math.Linear(bubble.y, targetY, 0.2);
        }
    });
    
    // Update Greg's bubble (no lerp needed since he doesn't move)
    if (this.greg.chatBubble && !this.greg.hasBeenSpokenTo) {
        this.greg.chatBubble.setPosition(
            this.greg.x + 40,
            this.greg.y - 130
        );
    }

    if (this.scene.isPaused()) return;
    if (!this.keys) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.p)) {
        if (!this.scene.isPaused()) { // Only pause if not already paused
          this.scene.pause();
          this.scene.launch('pause', { 
            from: 'Playlevel1' // <-- Make sure this matches EXACTLY your scene key
          });
        }
      }

    if (Phaser.Input.Keyboard.JustDown(this.keys.c)) {
        if (!this.scene.isPaused()) { // Only pause if not already paused
          this.scene.pause();
          this.scene.launch('help', { 
            from: 'Playlevel1' // <-- Make sure this matches EXACTLY your scene key
          });
        }
      }
  }

  showNPCDialog(message, npc) {
    this.isInDialogue = true;
    
    if (npc && npc.route) {
        this.pauseNPC(npc);
    }
    this.dialogBubble.setVisible(true);
    this.dialogText.setVisible(true);
    
    // Typewriter effect
    let currentText = "";
    let index = 0;
    this.typewriterInterval = setInterval(() => {
        if (index < message.length) {
            currentText += message[index];
            this.dialogText.setText(currentText);
            index++;
        }

        if (index === message.length) {
            clearInterval(this.typewriterInterval);
            this.time.delayedCall(5000, () => {
                this.hideNPCDialog(npc);
            });
        }
    }, 30);
}

hideNPCDialog(npc) {
    clearInterval(this.typewriterInterval);
    
    this.dialogBubble.setVisible(false);
    this.dialogText.setVisible(false).setText('');
    this.isInDialogue = false;
    
    this.currentTalkingNPC = null;
    this.nearNPC = null;
    
    if (npc && npc.route) {
        this.resumeNPC(npc);
    }
    
    this.time.delayedCall(100, () => {
        this.nearNPC = null;
    }, [], this);
}

  showGregDialogue() {
    this.isInDialogue = true;
    this.greg.chatBubble.setVisible(false);

    this.ember.setVisible(true);

    this.dialogBubble.setVisible(true);
    this.dialogText.setVisible(true);
    
    const screenCenterX = this.cameras.main.centerX;
    const screenBottomY = this.cameras.main.centerY + this.dialogBubble.height/2;

    this.optionTexts.forEach((text, index) => {
        text.setPosition(
            screenCenterX - 600, 
            screenBottomY + 390 + (index * 60)
        );
        text.setVisible(false);
    });

    this.writeText("Greg:\nI found this little guy alone in the woods. I am too old to take him home. Will you do it for me? Follow the path east of the village.");

    this.hideGregDialogue = () => {
        this.hasSpokenToGreg = true;
        this.isInDialogue = false;
        this.dialogBubble.setVisible(false);
        this.dialogText.setVisible(false);
        this.optionTexts.forEach(text => text.setVisible(false));
    };
    }

    writeText(text) {
        let currentText = "";
        let index = 0;
        let interval = setInterval(() => {
            currentText += text[index];
            this.dialogText.setText(currentText);
            index++;

            if (index === text.length) {
                clearInterval(interval);
                this.showOptions();
            }
        }, 30);
    }
    
    writeTextNpc(text) {
        let currentText = "";
        let index = 0;
        let interval = setInterval(() => {
            currentText += text[index];
            this.dialogText.setText(currentText);
            index++;

            if (index === text.length) {
                clearInterval(interval);
            }
        }, 30);
    }
      showOptions() {
        this.optionTexts.forEach((text, index) => {
            text.setVisible(true);
            text.setInteractive();
            text.on('pointerdown', () => {
                this.selectedOption = index;
                this.emberFollowing = true;
                this.emberCarried = false;
                this.hideGregDialogue();
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

    pickUpEmber() {
        if (this.emberCarried) {
            this.ember.setVisible(true); 
            this.ember.x = this.player.x - 120;
            this.ember.y = this.player.y + 80;
            this.emberFollowing = true; 
            this.emberCarried = false;
            this.player.setTexture("alex"); 
            handlePlayerMovementWithEmber(this.player, this.keys, this.depthSortedObjects);
        } else {
            this.ember.setVisible(false);
            this.emberFollowing = false; 
            this.emberCarried = true;
            this.player.setTexture("alexember"); 
            handlePlayerMovement(this.player, this.keys, this.depthSortedObjects);
        }
    }

      hideGregDialogue() {
        this.isInDialogue = false;
        this.dialogBubble.setVisible(false);
        this.dialogText.setVisible(false);
        this.optionTexts.forEach(text => {
            text.setVisible(false);
            text.removeAllListeners();
        });
        this.hasSpokenToGreg = true;
        this.emberFollowing = true;
    } 

    onPassagewayCollide(player, passageway) {
        if (!this.hasSpokenToGreg) {
            // Prevent passing if hasn't talked to Greg
            if (player.x > 5200) {
                player.x = 5200; // Force player back
            }
        }
        if (this.hasSpokenToGreg) {
            this.registry.set('playerState', {
                texture: this.emberCarried ? 'alexember' : 'alex',
                isCarryingEmber: this.emberCarried
            });

            console.log('Saved playerState:', this.registry.get('playerState'));

            this.destroy()            
            this.scene.start('Playlevel2', { currentLevel: this.scene.key });

        }
    }

    moveNPC(npc) {
        // Don't proceed if paused
        if (npc.isPaused) return;
        
        // Clear any existing timer
        if (npc.moveTimer) {
            npc.moveTimer.remove();
        }
        
        const step = npc.route[npc.currentStep];
        const dx = step.x;
        const dy = step.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const duration = (distance / npc.speed) * 1000;
        
        // Set movement
        npc.sprite.setVelocityX((dx / distance) * npc.speed);
        npc.sprite.setVelocityY((dy / distance) * npc.speed);
        npc.sprite.anims.play(step.anim, true);
        npc.sprite.setFlipX(step.flip);
        npc.isMoving = true;
        
        // Set up the movement timer
        npc.moveTimer = this.time.delayedCall(duration, () => {
            npc.sprite.setVelocity(0);
            npc.sprite.anims.stop();
            
            // Set to idle frame - IMPORTANT CHANGE
            npc.sprite.setFrame(npc.idleFrame);
            npc.isMoving = false;
            
            // Only proceed to next step after stopTime
            if (step.stopTime > 0) {
                // Play idle animation if available
                const idleAnim = step.anim.replace('_walk', '_idle');
                if (this.anims.exists(idleAnim)) {
                    npc.sprite.anims.play(idleAnim, true);
                } else {
                    npc.sprite.setFrame(npc.idleFrame);
                }
            }
            
            this.time.delayedCall(step.stopTime, () => {
                npc.currentStep = (npc.currentStep + 1) % npc.route.length;
                this.moveNPC(npc);
            });
        });

        if (npc.sprite.chatBubble) {
            npc.sprite.chatBubble.setPosition(
                npc.sprite.x,
                npc.sprite.y - 100
            );
        }
    }

    setupNPCInteraction(npcSprite, dialogCallback) {
        this.physics.add.overlap(this.player, npcSprite, () => {
                const npcData = this.npcs.find(npc => npc.sprite === npcSprite) || null;
                this.nearNPC = {
                    npc: npcSprite,
                    data: npcData,
                    callback: () => {
                        // Hide chat bubble on first interaction
                        if (npcSprite.chatBubble && !npcSprite.hasBeenSpokenTo) {
                            npcSprite.chatBubble.setVisible(false);
                            npcSprite.hasBeenSpokenTo = true;
                        }
                        dialogCallback();
                    }
                };
        }, null, this);
    }

    pauseNPC(npc) {
        // Check if npc exists and has required properties
        if (!npc || typeof npc.isPaused === 'undefined') {
            return;
        }
        
        if (npc.isPaused || !npc.isMoving) return;
        
        // Check if this NPC has movement properties
        if (!npc.route || !npc.moveTimer) {
            return;
        }
        
        // Store current movement state
        const currentStep = npc.route[npc.currentStep];
        const elapsed = npc.moveTimer.getElapsed();
        const remainingTime = npc.moveTimer.delay - elapsed;
        
        npc.pausedState = {
            currentStep: npc.currentStep,
            remainingTime: remainingTime,
            anim: currentStep.anim,
            flip: currentStep.flip,
            velocityX: npc.sprite.body.velocity.x,
            velocityY: npc.sprite.body.velocity.y
        };
        
        // Stop movement
        npc.moveTimer.remove();
        npc.sprite.setVelocity(0);
        npc.sprite.anims.stop();
        npc.sprite.setFrame(npc.idleFrame);
        npc.isMoving = false;
        npc.isPaused = true;
    }
    
    resumeNPC(npc) {
        if (!npc.isPaused || !npc.pausedState) return;
        
        const state = npc.pausedState;
        const step = npc.route[state.currentStep];
        
        // Restore movement
        npc.sprite.setVelocity(state.velocityX, state.velocityY);
        npc.sprite.anims.play(state.anim, true);
        npc.sprite.setFlipX(state.flip);
        
        // Set up timer for remaining movement
        npc.moveTimer = this.time.delayedCall(state.remainingTime, () => {
            npc.sprite.setVelocity(0);
            npc.sprite.anims.stop();
            npc.isMoving = false;
            
            // Pause at waypoint if needed
            this.time.delayedCall(step.stopTime, () => {
                npc.currentStep = (state.currentStep + 1) % npc.route.length;
                this.moveNPC(npc);
            });
        });
        
        npc.isPaused = false;
        npc.pausedState = null;
    }

    showHint() {
        this.hintShown = true;
        this.passageway.setAlpha(1);
        this.passageway.setInteractive(true);
        
        // Clean up any existing elements
        if (this.hintBubble) this.hintBubble.destroy();
        if (this.hintText) this.hintText.destroy();
        
        // Create new elements
        this.hintBubble = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.height + 450,
            'textbubblesmall'
        ).setOrigin(0.5).setDepth(1503).setScrollFactor(0);
        
        this.hintText = this.add.text(
            this.hintBubble.x,
            this.hintBubble.y,
            "Press 'F' to pick him up in your backpack and put him down again.",
            { 
                fontSize: '32px', 
                color: '#000', 
                fontFamily: 'Arial',
                wordWrap: { width: this.hintBubble.width - 40 }
            }
        ).setOrigin(0.5).setDepth(1504).setScrollFactor(0);
        
        // Set up one-time timer
        this.hintTimer = this.time.delayedCall(6000, () => {
            if (this.hintBubble) this.hintBubble.destroy();
            if (this.hintText) this.hintText.destroy();
            this.hintTimer = null; // Clear the timer reference
        }, null, this);
    }

    destroy() {
        // Clean up particles (if you add them later)
        if (this.rain) {
            this.rain.destroy();
        }
    
        // Clean up intervals
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
    
        // Clean up NPCs and their chat bubbles
        this.npcs?.forEach(npc => {
            if (npc.sprite?.chatBubble) {
                npc.sprite.chatBubble.destroy();
            }
            if (npc.moveTimer) {
                npc.moveTimer.destroy();
            }
        });
    
        // Clean up Greg's chat bubble
        if (this.greg?.chatBubble) {
            this.greg.chatBubble.destroy();
        }
    
        // Clean up dialog UI elements
        if (this.dialogBubble) {
            this.dialogBubble.destroy();
        }
        if (this.dialogText) {
            this.dialogText.destroy();
        }
        this.optionTexts?.forEach(text => text.destroy());
    
        // Clean up hint elements
        if (this.hintBubble) {
            this.hintBubble.destroy();
        }
        if (this.hintText) {
            this.hintText.destroy();
        }
        if (this.hintBubble1) {
            this.hintBubble1.destroy();
        }
        if (this.hintText1) {
            this.hintText1.destroy();
        }
    
        // Clean up timers
        if (this.hintTimer) {
            this.time.removeEvent(this.hintTimer);
        }
        if (this.hintTimer1) {
            this.time.removeEvent(this.hintTimer1);
        }
    
        // Clean up colliders (optional, Phaser usually handles this)
        this.buildingColliders?.destroy();
        this.treeColliders?.destroy();
        this.stoneColliders?.destroy();
        this.fenceColliders?.destroy();
        this.flowerColliders?.destroy();
        this.benchColliders?.destroy();
        this.edges?.destroy();
    
    }
}