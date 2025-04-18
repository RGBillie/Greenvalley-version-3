class Load {
  preload() {
    //Load Music
    this.load.audio('musicCozy', 'assets/music/cozy.mp3');
    this.load.audio('musicSad', 'assets/music/sad.mp3');
    this.load.audio('musicSpooky', 'assets/music/spooky.mp3');
    this.load.audio('musicCelebration', 'assets/music/celebration.mp3');
    this.load.audio('musicHappy', 'assets/music/happy.mp3');


    // Load spritesheets
    this.load.spritesheet('alex', 'assets/AlexSpriteSheet.png', { frameWidth: 172, frameHeight: 266 });
    this.load.spritesheet('lea', 'assets/LeaSpriteSheet.png', { frameWidth: 172, frameHeight: 266 });
    this.load.spritesheet('jacob', 'assets/JacobSpriteSheet.png', { frameWidth: 172, frameHeight: 266 });
    this.load.spritesheet('ember', 'assets/EmberSpriteSheet.png', { frameWidth: 106, frameHeight: 106 });
    this.load.spritesheet('embersad', 'assets/EmberSadSpriteSheet.png', { frameWidth: 106, frameHeight: 106 });
    this.load.spritesheet('greg', 'assets/GregSpriteSheet.png', { frameWidth: 258, frameHeight: 292 });
    this.load.spritesheet('alexember', 'assets/AlexWithEmberSpriteSheet.png', { frameWidth: 172, frameHeight: 266 });
    this.load.spritesheet('lilypads', 'assets/LilyPads.png', { frameWidth: 706, frameHeight: 363 });
    this.load.spritesheet('yellowember', 'assets/YellowEmber.png', { frameWidth: 120, frameHeight: 109 });
    this.load.spritesheet('purpleember', 'assets/PurpleEmber.png', { frameWidth: 144, frameHeight: 125 });
    this.load.spritesheet('redember', 'assets/RedEmber.png', { frameWidth: 124, frameHeight: 107 });
    this.load.spritesheet('greenember', 'assets/GreenEmber.png', { frameWidth: 126, frameHeight: 110 });
    this.load.spritesheet('tealember', 'assets/TealEmber.png', { frameWidth: 140, frameHeight: 101 });
    
    // Load images
    const assets = [
        'Bench', 'BlueFlower', 'WhiteFlower', 'RedFlower', 'BlueHouse', 'OrangeHouse',
        'BushBlueFlowers', 'BushPinkFlowers', 'CityHall', 'DecorativeFence', 'GreenHouse',
        'PurpleHouse', 'Ground', 'Lake', 'LakeWeeds', 'SmallLakeWeeds', 'LeftEdgeForest',
        'RightEdgeForest', 'MediumStone', 'SmallStone', 'TinyStone', 'Glade1Roads', 'Glade2Roads',
        'RoadSignForest', 'Store', 'TopEdgeFence', 'Tree1', 'Tree2', 'Tree3', 'TextBubble',
        'BenchBack', 'Firepit', 'Gate', 'Bush', 'LongFence', 'LargeFog', 'SmallFog',
        'DeadTree1', 'DeadTree2', 'DeadTree3', 'DeadBush', 'PlainBush1', 'PlainBush2', 'Leaves', 'Gradient',
        'RoadSignPath1', 'RoadSignPath2', 'EmberHouse', 'EmberHouseNoRoof', 'EmberHouseRoofHalfOff',
        'EmberFootprints', 'EmberTeddy', 'PlainBushEdge', 'Invisible', 'Questionmark', 'HappyEmber', 'Exclamationmark',
        'ExclamationmarkArrow','ChatBubble', 'TextBubbleSmall', 'Welcome', 'Thanks', 'Controls', 'Background',
        'Spacebar', 'ControlsTip', 'Paused', 'Tips', 'GreenvalleyRoads', 'ForestRoads', 'ForestBottom', 'ForestRight'
    ]
        
    assets.forEach(asset => {
        this.load.image(asset.toLowerCase(), `assets/${asset}.png`);
    });

    // Loading screen
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Loading...', { font: '38px Arial', fill: '#fff' }).setOrigin(0.5, 0.5);
  }

  create() {
    // Definer animationer for Alex, Lea og Jacob
    const characters = ["alex", "lea", "jacob", "alexember"];
    characters.forEach(character => {
        this.anims.create({
            key: `${character}_walk`,
            frames: [{ key: character, frame: 0 }, { key: character, frame: 2 }, { key: character, frame: 1 }, { key: character, frame: 2 }],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: `${character}_walk_front`,
            frames: [{ key: character, frame: 7 }, { key: character, frame: 4 }, { key: character, frame: 8 }, { key: character, frame: 4 }],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: `${character}_walk_back`,
            frames: [{ key: character, frame: 5 }, { key: character, frame: 3 }, { key: character, frame: 6 }, { key: character, frame: 3 }],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: `${character}_idle_side`,
            frames: [{ key: character, frame: 2 }],
            frameRate: 1
        });

        this.anims.create({
            key: `${character}_idle_front`,
            frames: [{ key: character, frame: 3 }],
            frameRate: 1
        });

        this.anims.create({
            key: `${character}_idle_back`,
            frames: [{ key: character, frame: 4 }],
            frameRate: 1
        });
    })

    // Animationer for Greg (gyngestolen)
    this.anims.create({
      key: "greg_swing",
      frames: [{ key: "greg", frame: 0 }, { key: "greg", frame: 1 }],
      frameRate: 1,
      repeat: -1
    });

    this.anims.create({
        key: "greg_idle",
        frames: [{ key: "greg", frame: 1 }],
        frameRate: 1
    });

    this.anims.create({
        key: "lilypads",
        frames: [{ key: "lilypads", frame: 0 }, { key: "lilypads", frame: 1 }],
        frameRate: 1,
        repeat: -1
    });

    //EMBERS
    this.anims.create({
        key: "redember",
        frames: [{ key: "redember", frame: 0 }, { key: "redember", frame: 1 }],
        frameRate: 1,
    });

    this.anims.create({
        key: "yellowember",
        frames: [{ key: "yellowember", frame: 0 }, { key: "yellowember", frame: 1 }],
        frameRate: 1,
    });

    this.anims.create({
        key: "tealember",
        frames: [{ key: "tealember", frame: 0 }, { key: "tealember", frame: 1 }],
        frameRate: 1,
    });

    this.anims.create({
        key: "purpleember",
        frames: [{ key: "purpleember", frame: 0 }, { key: "purpleember", frame: 1 }],
        frameRate: 1,
    });

    this.anims.create({
        key: "greenember",
        frames: [{ key: "greenember", frame: 0 }, { key: "greenember", frame: 1 }],
        frameRate: 1,
    });



    const emberAnimations = ["ember", "embersad"];
    emberAnimations.forEach(character => {
        // Walk animations
        this.anims.create({
            key: `${character}_walk`,
            frames: [{ key: character, frame: 0 }, { key: character, frame: 2 }, { key: character, frame: 1 }, { key: character, frame: 2 }],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: `${character}_walk_front`,
            frames: [{ key: character, frame: 7 }, { key: character, frame: 4 }, { key: character, frame: 8 }, { key: character, frame: 4 }],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: `${character}_walk_back`,
            frames: [{ key: character, frame: 5 }, { key: character, frame: 3 }, { key: character, frame: 6 }, { key: character, frame: 3 }],
            frameRate: 10,
            repeat: -1
        });

        // Idle animations
        this.anims.create({
            key: `${character}_idle_side`,
            frames: [{ key: character, frame: 2 }],
            frameRate: 1
        });

        this.anims.create({
            key: `${character}_idle_front`,
            frames: [{ key: character, frame: 3 }],
            frameRate: 1
        });

        this.anims.create({
            key: `${character}_idle_back`,
            frames: [{ key: character, frame: 4 }],
            frameRate: 1
        });

        // Look around animations (specific for sad ember)
        if (character === "embersad") {
            this.anims.create({
                key: "embersad_look_around",
                frames: [
                    { key: character, frame: 3 }, // front
                    { key: character, frame: 4 }, // back
                    { key: character, frame: 2 }, // right
                    { key: character, frame: 2}, // left (we'll handle flip manually)
                    { key: character, frame: 3 }  // front again
                ],
                frameRate: 1,
                repeat: 0
            });
        }
    });



    this.scene.start('Playlevel2');  
  }
}
