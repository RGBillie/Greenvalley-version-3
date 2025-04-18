class Playlevel2 extends Phaser.Scene {
  constructor() {
      super({ key: "Playlevel2" });
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

        //Top trees
        { x: 440, y: 150, key: "largefog" },
        { x: 840, y: 320, key: "smallfog" },
        { x: 1340, y: 120, key: "largefog" },
        { x: 1740, y: 70, key: "smallfog" },
        { x: 2030, y: 140, key: "largefog" },
        { x: 2566, y: 320, key: "smallfog" },
        { x: 2740, y: 90, key: "largefog" },
        { x: 2990, y: 120, key: "largefog" },
        { x: 3440, y: 80, key: "smallfog" },
        { x: 3740, y: 20, key: "smallfog" },
        { x: 4030, y: 120, key: "largefog" },
        { x: 4566, y: 320, key: "smallfog" },
        { x: 4740, y: 120, key: "largefog" },
        { x: 4990, y: 40, key: "largefog" },
        { x: 5440, y: 20, key: "smallfog" },
        { x: 440, y: 20, key: "deadtree2" },
        { x: 100, y: 40, key: "deadtree2" },
        { x: 800, y: 30, key: "deadtree3" },
        { x: 1150, y: 40, key: "deadtree1" },
        { x: 1450, y: 50, key: "deadtree2" },
        { x: 1750, y: 20, key: "deadtree3" },
        { x: 1980, y: 90, key: "deadtree1" },
        { x: 2280, y: 60, key: "deadtree2" },
        { x: 2560, y: 10, key: "deadtree1" },
        { x: 2850, y: 50, key: "deadtree2" },
        { x: 3050, y: 70, key: "deadtree3" },
        { x: 3250, y: 10, key: "deadtree2" },
        { x: 3550, y: 90, key: "deadtree3" },
        { x: 3870, y: 10, key: "deadtree1" },
        { x: 4150, y: 60, key: "deadtree2" },
        { x: 4400, y: 10, key: "deadtree1" },
        { x: 4700, y: 90, key: "deadtree3" },
        { x: 4960, y: 40, key: "deadtree2" },
        { x: 5270, y: 10, key: "deadtree1" },
        { x: 670, y: 310, key: "plainbush1" },
        { x: 1370, y: 450, key: "plainbush2" },
        { x: 2120, y: 390, key: "plainbush1" },
        { x: 3320, y: 440, key: "plainbush2" },
        { x: 4270, y: 390, key: "plainbush1" },

        //Right field
        { x: 3600, y: 1700, key: "deadtree1"},
        { x: 4200, y: 2300, key: "deadtree1"},
        { x: 4000, y: 2600, key: "deadtree2" },
        { x: 3700, y: 1970, key: "deadtree2" },
        { x: 4200, y: 1900, key: "deadtree3" },
        { x: 3550, y: 2300, key: "deadbush" },
        { x: 3500, y: 2440, key: "plainbush1" },
        { x: 3550, y: 2120, key: "plainbush2" },
        { x: 4000, y: 2000, key: "plainbush1" },
        { x: 4250, y: 2920, key: "plainbush2" },
        { x: 3900, y: 2700, key: "plainbush1" },
        { x: 3950, y: 2420, key: "plainbush2" },
        { x: 4200, y: 2300, key: "mediumstone" },
        { x: 3800, y: 2500, key: "smallstone" },
        { x: 3850, y: 2900, key: "leaves" },
        { x: 3490, y: 1900, key: "leaves" },
        { x: 3860, y: 2100, key: "largefog" },
        { x: 3960, y: 2600, key: "smallfog" },
        { x: 4950, y: 2700, key: "deadtree3" },
        { x: 4950, y: 2000, key: "deadtree1" },
        { x: 4850, y: 2790, key: "plainbush1" },
        { x: 4900, y: 2000, key: "plainbush2" },
        { x: 4850, y: 3600, key: "bushpinkflowers" },
        { x: 5050, y: 2290, key: "smallfog" },
        { x: 5050, y: 3090, key: "smallfog" },
        { x: 3850, y: 3500, key: "tree1" },
        { x: 4230, y: 3300, key: "plainbush1" },
        { x: 4310, y: 3390, key: "whiteflower" },
        { x: 3850, y: 3500, key: "plainbush2" },
        { x: 4150, y: 3720, key: "bushblueflowers" },
        { x: 4150, y: 3520, key: "leaves" },

        //Lake
        { x: 3850, y: 330, key: "lakeweeds" },
        { x: 4450, y: 430, key: "smalllakeweeds" },
        { x: 4450, y: 1200, key: "lakeweeds" },
        { x: 3420, y: 1070, key: "smalllakeweeds" },
        { x: 3950, y: 330, key: "mediumstone" },
        { x: 4550, y: 530, key: "smallstone" },
        { x: 4550, y: 1300, key: "tinystone" },
        { x: 3450, y: 1230, key: "mediumstone" },
        { x: 4450, y: 1530, key: "mediumstone" },
        { x: 4550, y: 1530, key: "smallstone" },
        { x: 3400, y: 1500, key: "tinystone" },
        { x: 3450, y: 1230, key: "mediumstone" },
        { x: 4750, y: 330, key: "plainbush1" },
        { x: 4650, y: 1400, key: "plainbush2" },
        { x: 3050, y: 700, key: "plainbush1" },
        { x: 4900, y: 700, key: "deadtree1"},
        { x: 4300, y: 1100, key: "deadtree2" },
        { x: 3000, y: 400, key: "deadtree3" },
        { x: 5000, y: 1200, key: "deadtree1"},
        { x: 4000, y: 1000, key: "deadtree1"},
        { x: 4000, y: 1300, key: "smallfog"},
        { x: 5000, y: 1200, key: "smallfog"},
        { x: 3000, y: 600, key: "smallfog"},
        { x: 5100, y: 500, key: "largefog"},
        { x: 3300, y: 500, key: "deadtree2" },
        { x: 3600, y: 1200, key: "deadtree3" },
        { x: 3950, y: 1400, key: "deadbush" },
        { x: 4050, y: 1500, key: "plainbush1" },
        { x: 2550, y: 1900, key: "plainbush2" },
        { x: 4650, y: 1200, key: "deadbush" },
        { x: 3500, y: 1300, key: "plainbush1" },
        { x: 4950, y: 700, key: "plainbush2" },
        { x: 4720, y: 1550, key: "leaves" },
        { x: 2720, y: 800, key: "leaves" },
        { x: 1220, y: 800, key: "leaves" },

        //Benches
        { x: 4200, y: 3900, key: "bench" },
        { x: 3900, y: 1900, key: "benchback" },
        { x: 1400, y: 3670, key: "bench" },
        { x: 1500, y: 1170, key: "benchback" },

        //Middle bottom right
        { x: 2800, y: 3200, key: "bench" },
        { x: 2800, y: 3400, key: "firepit" },
        { x: 2800, y: 3600, key: "benchback" },
        { x: 2500, y: 2700, key: "deadtree1" },
        { x: 3130, y: 3200, key: "deadtree2" },
        { x: 2470, y: 3600, key: "deadtree3" },
        { x: 2700, y: 2900, key: "deadbush" },
        { x: 3130, y: 2800, key: "bushblueflowers" },
        { x: 2950, y: 2980, key: "plainbush2" },
        { x: 2470, y: 3200, key: "plainbush2" },
        { x: 2700, y: 3900, key: "deadbush" },
        { x: 3130, y: 3800, key: "plainbush1" },
        { x: 2950, y: 3980, key: "plainbush2" },
        { x: 2470, y: 3900, key: "plainbush2" },
        { x: 2950, y: 3050, key: "smallfog" },
        { x: 2790, y: 3700, key: "smallfog" },
        { x: 2380, y: 2850, key: "mediumstone" },
        { x: 2880, y: 3800, key: "mediumstone" },
        { x: 3180, y: 3650, key: "leaves" },

        //Middle bottom left
        { x: 1100, y: 2700, key: "deadtree1" },
        { x: 1330, y: 3000, key: "deadtree2" },
        { x: 1730, y: 3350, key: "deadtree3" },
        { x: 1200, y: 3500, key: "deadbush" },
        { x: 1720, y: 2800, key: "redflower" },
        { x: 1530, y: 2800, key: "plainbush1" },
        { x: 1750, y: 2980, key: "plainbush2" },
        { x: 1100, y: 3400, key: "plainbush2" },
        { x: 1900, y: 2800, key: "deadbush" },
        { x: 1470, y: 3980, key: "plainbush2" },
        { x: 1250, y: 3150, key: "smallfog" },
        { x: 1590, y: 3350, key: "smallfog" },
        { x: 980, y: 2850, key: "mediumstone" },
        { x: 1380, y: 3500, key: "mediumstone" },
        { x: 1070, y: 3650, key: "leaves" },
        { x: 1470, y: 3050, key: "leaves" },

        //Middle top left
        { x: 1430, y: 1600, key: "deadtree1" },
        { x: 1730, y: 2000, key: "deadtree2" },
        { x: 1730, y: 1050, key: "deadtree3" },
        { x: 1400, y: 2100, key: "deadbush" },
        { x: 1530, y: 1500, key: "plainbush1" },
        { x: 1750, y: 1680, key: "plainbush2" },
        { x: 1400, y: 2300, key: "plainbush2" },
        { x: 1900, y: 1500, key: "deadbush" },

        { x: 1520, y: 1350, key: "smallfog" },
        { x: 1590, y: 2050, key: "smallfog" },
        { x: 1380, y: 1550, key: "mediumstone" },
        { x: 1380, y: 2500, key: "mediumstone" },
        { x: 1770, y: 2450, key: "leaves" },
        { x: 1470, y: 1750, key: "leaves" },

        //Middle top right
        { x: 2800, y: 1600, key: "deadtree3" },
        { x: 2500, y: 2000, key: "deadtree1" },
        { x: 2500, y: 1050, key: "deadtree2" },
        { x: 2800, y: 2300, key: "deadbush" },
        { x: 2600, y: 1500, key: "plainbush1" },
        { x: 2820, y: 1200, key: "plainbush2" },
        { x: 2850, y: 2100, key: "plainbush2" },
        { x: 2600, y: 1350, key: "smallfog" },
        { x: 2640, y: 2050, key: "smallfog" },
        { x: 2430, y: 1550, key: "mediumstone" },
        { x: 2830, y: 2500, key: "mediumstone" },
        { x: 2460, y: 2450, key: "leaves" },
        { x: 2520, y: 1750, key: "leaves" },


        //Field top and left
        { x: 500, y: 500, key: "bench" },
        { x: 500, y: 700, key: "firepit" },
        { x: 500, y: 900, key: "benchback" },
        { x: 1000, y: 400, key: "deadtree1" },
        { x: 1500, y: 500, key: "deadtree2" },
        { x: 2200, y: 400, key: "deadtree3" },
        { x: 700, y: 1200, key: "deadtree1" },
        { x: 400, y: 1500, key: "deadtree2" },
        { x: 600, y: 2000, key: "deadtree3" },
        { x: 400, y: 2500, key: "deadtree1" },
        { x: 350, y: 3300, key: "deadtree2" },
        { x: 780, y: 1300, key: "plainbush2" },
        { x: 700, y: 1600, key: "deadbush" },
        { x: 800, y: 2200, key: "deadbush" },
        { x: 500, y: 2600, key: "deadbush" },
        { x: 400, y: 3000, key: "deadbush" },
        { x: 750, y: 2000, key: "plainbush2" },
        { x: 800, y: 2400, key: "plainbush1" },
        { x: 450, y: 3300, key: "plainbush2" },
        { x: 550, y: 1700, key: "smallfog" },
        { x: 400, y: 2350, key: "largefog" },
        { x: 250, y: 3400, key: "smallfog" },
        { x: 750, y: 1700, key: "leaves" },
        { x: 420, y: 3450, key: "leaves" },
        { x: 1200, y: 600, key: "deadbush" },
        { x: 1700, y: 750, key: "plainbush1" },
        { x: 2200, y: 800, key: "plainbush2" },
        { x: 2600, y: 780, key: "deadbush" },
        { x: 2480, y: 680, key: "plainbush1" },
        { x: 1880, y: 700, key: "plainbush2" },
        { x: 780, y: 980, key: "plainbush1" },
        { x: 880, y: 800, key: "plainbush2" },
        { x: 2800, y: 400, key: "smallstone" },
        { x: 1280, y: 650, key: "smallfog" },
        { x: 2080, y: 500, key: "largefog" },

        { x: 4853, y: 3805, key: "roadsignpath1" },
        { x: 4853, y: 1430, key: "roadsignpath2" },
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

        this.lilypads = this.add.sprite(4000, 800, "lilypads").setDepth(1),
        this.lilypads.play("lilypads"),


      // **PLACERING AF VEJE OG PLADS**
      this.add.image(2684, 2151, "forestroads").setDepth(1);
      this.add.image(2684, 2301, "forestbottom").setDepth(1000);
      this.add.image(2534, 2371, "forestright").setDepth(1000);

      this.block = this.physics.add.staticGroup();
      this.block.create(5230, 820).setSize(50, 1500).setOrigin(0.5, 0.5);
      this.block.create(5230, 2930).setSize(50, 2050).setOrigin(0.5, 0.5);
      this.block.create(5230, 4380).setSize(50, 200).setOrigin(0.5, 0.5);

      //MUSIC
      this.music = this.sound.add('musicSpooky', { loop: true, volume: 0.1 });
      this.music.play()

      // **TILFØJ SPILLEREN (ALEX)**
      const playerState = this.registry.get('playerState') || { 
        texture: 'alex', 
        isCarryingEmber: false 
        };
        
        this.player = this.physics.add.sprite(200, 3800, playerState.texture);

        this.time.delayedCall(100, () => {
            this.player.setTexture(playerState.texture);
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

        if (playerState.isCarryingEmber) {
            // Case: Ember is being carried (hide follower)
            this.ember = this.add.sprite(0, 0, "ember")
                .setVisible(false) // Hidden!
                .setDepth(1501);
            this.emberCarried = true; // ← Critical: Sync with saved state
        } else {
            // Case: Ember is following (show beside player)
            this.ember = this.add.sprite(this.player.x - 120, this.player.y + 80, "ember")
                .setVisible(true)
                .setDepth(1501);
            this.ember.anims.play("ember_idle_front", true);
            this.emberCarried = false; // ← Sync with saved state
        }
    
        // 4. Shared setup
        this.depthSortedObjects.push(this.ember);
        this.emberFollowing = !playerState.isCarryingEmber; // ← Sync following state
        this.emberPickUp = false;

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
      this.edges.create(4000, 900, "lake").setDepth(0);
      this.edges.create(2630, 4250, "bush").setOrigin(0.5, 0).setDepth(1502).setOffset(0 , 190).setVisible(false);

      // **KOLLISION MELLEM SPILLER OG GRÆNSER**
      this.physics.add.collider(this.player, this.edges);

     // 1. First create all UI elements
        let camera = this.cameras.main;
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

        // 2. Now call the function with the text
        this.writeTextNpc('This place looks scary.. I might want to find a way out of this forest soon. Maybe something can lead me to a pleasent path, or if I am more daring a can find a more spooky path.');
        
        //this.add.image(this.cameras.main.centerX-920, this.cameras.main.centerY-500, 'tips').setScrollFactor(0).setDepth(9999);
    }

  update() {
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
                    this.ember.anims.play(prefix + 'idle_front', true);
                    break;
                case 'down':
                    this.ember.anims.play(prefix + 'idle_back', true);
                    break;
            }
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
            from: 'Playlevel2' // <-- Make sure this matches EXACTLY your scene key
          });
        }
      }

    if (Phaser.Input.Keyboard.JustDown(this.keys.c)) {
        if (!this.scene.isPaused()) { // Only pause if not already paused
          this.scene.pause();
          this.scene.launch('help', { 
            from: 'Playlevel2' // <-- Make sure this matches EXACTLY your scene key
          });
        }
      }

    if (this.player.x > 5300) {
        this.registry.set('playerState', {
            texture: this.emberCarried ? 'alexember' : 'alex',
            isCarryingEmber: this.emberCarried
        });
        this.destroy()
        this.scene.start('Playlevel3', { currentLevel: this.scene.key });
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
            this.time.delayedCall(9000, () => {
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

    destroy() {
        // Clean up particles
        if (this.rain) {
            this.rain.destroy();
        }
    
        // Clean up graphics objects
        if (this.darkness) {
            this.darkness.destroy();
        }
        if (this.gradient) {
            this.gradient.destroy();
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
    
        // Clean up collider groups
        this.buildingColliders?.destroy();
        this.treeColliders?.destroy();
        this.stoneColliders?.destroy();
        this.fenceColliders?.destroy();
        this.flowerColliders?.destroy();
        this.benchColliders?.destroy();
        this.edges?.destroy();
        this.block?.destroy();
    
        // Clean up special objects
        if (this.lilypads) {
            this.lilypads.destroy();
        }
        if (this.colorOverlay) {
            this.colorOverlay.destroy();
        }
    
        // Remove update listener for gradient
        this.events.off('update');
    
        // Call parent destroy
    }
}