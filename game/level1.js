
class StoryScene extends Phaser.Scene {
    constructor() { //constructor() is a special method for creating and initializing an object created with a class. In this case, it initializes the StoryScene class.
        super('StoryScene');
    }

    preload() {  //load assets (key, path)
        this.load.image('rajahH_idle', 'assets/rajahH/rajahH.png');   
        this.load.image('rajahH_walk', 'assets/rajahH/rajahH_walk.png');
        this.load.image('rajahH_jump', 'assets/rajahH/rajahH_jump.png');
        this.load.image('bg', 'assets/sky_bg.png');
        this.load.image('tree', 'assets/trees.png');
        this.load.image('grass', 'assets/grass.png');
    }

    create() {

        this.cameras.main.fadeIn(800, 0, 0, 0); //(duration, red, green, blue) 
        this.dialogues = [ // array of strings that will be displayed as dialogue in the story scene
            "Before the arrival of colonizers, Cebu was a thriving and peaceful island nation...",
            "Its people lived in organized communities led by local rulers called Datus.",            
            "The seas were their highways, and boats carried them across vast waters.",            
            "Cebu became a center of trade, connecting China, India, Arabia, and neighboring islands.",            
            "Gold, spices, silk, and pottery flowed through its busy ports.",            
            "Foreign traders were welcomed with respect and fairness.",            
            "But beyond the wealth of trade, the people of Cebu lived with strong culture and unity..."
        ];

        this.index = 0; // keeps track of the current dialogue index being displayed
        this.charIndex = 0; // keeps track of the current letter index being displayed in the current dialogue line
        this.typingSpeed = 30; // speed of typing effect in milliseconds (lower is faster)
        this.isTyping = false; 


        this.add.image(208, 132, 'bg').setScale(0.3); // (x, y, key) 
        this.add.image(255, 140, 'tree').setScale(0.253);


        this.text = this.add.text(10, 200, '', { // (x, y, text, style)
            fontSize: '18px',
            fill: '#000000',
            wordWrap: { width: 490 }
        });

        this.hint = this.add.text(10, 250, 'SPACE / CLICK', {
            fontSize: '14px',
            fill: '#000000'
        });


        this.input.keyboard.on('keydown-SPACE', () => this.next()); // (event, callback)
        this.input.keyboard.on('keydown-RIGHT', () => this.next());
        this.input.on('pointerdown', () => this.next());

        this.showLine(); // starts the process of showing the first line of dialogue with a typing effect
        this.input.keyboard.on('keydown-ESC', () => {
            window.location.href = '../adventure.html';
        });
    }

    showLine() {
        this.text.setText('');
        this.charIndex = 0;
        this.isTyping = true;
        this.current = this.dialogues[this.index];

        this.time.addEvent({
            delay: this.typingSpeed,
            loop: true,
            callback: () => {
                this.text.text += this.current[this.charIndex];
                this.charIndex++;

                if (this.charIndex >= this.current.length) {
                    this.isTyping = false;
                    this.time.removeAllEvents(); // stops the typing effect once the entire line has been displayed
                }
            }
        });
    }

    next() {
        if (this.isTyping) {
            this.text.setText(this.current); // immediately displays the full current line of dialogue if the player tries to advance while the typing effect is still in progress
            this.isTyping = false;
            this.time.removeAllEvents(); // stops the typing effect
            return;
        }

        this.index++;

        if (this.index >= this.dialogues.length) {
            this.cameras.main.fadeOut(800); 
            this.cameras.main.once('camerafadeoutcomplete', () => { // (event, callback)
                this.scene.start('MainScene');
            });
        } else {
            this.showLine();
        }
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('rajahH_idle', 'assets/rajahH/rajahH.png');
        this.load.image('rajahH_walk', 'assets/rajahH/rajahH_walk.png');
        this.load.image('rajahH_jump', 'assets/rajahH/rajahH_jump.png');
        this.load.image('bg', 'assets/sky_bg.png');
        this.load.image('tree', 'assets/trees.png');
        this.load.image('grass', 'assets/grass.png');
        this.load.image('xs_log', 'assets/xs_log.png');
        this.load.image('s_log', 'assets/s_log.png');
        this.load.image('med_log', 'assets/med_log.png');
        this.load.image('l_log', 'assets/l_log.png');
        this.load.image('stack_log', 'assets/stack_log.png');
        this.load.image('kubo', 'assets/bahaykubo.png');
        this.load.image('spice', 'assets/spice.png');
        this.load.image('gold', 'assets/gold.png');
        this.load.image('honey', 'assets/honey.png');
        this.load.image('pearl', 'assets/pearl.png');
        this.load.image('enemy_walk1', 'assets/soldier/left_enemy.png');
        this.load.image('enemy_walk2', 'assets/soldier/right_enemy.png');
    }

    enterHouse(player, zone) {

        if (this.entering) return; // prevents multiple triggers if the player overlaps the zone multiple times
        this.entering = true;

        player.setVelocity(0, 0); // (x, y) stops the player's movement immediately when they enter the house zone
        player.anims?.stop?.(); // stops any ongoing animations for the player sprite, ensuring it remains static during the transition


        this.input.keyboard.enabled = false; // disables keyboard input to prevent the player from moving or performing actions during the transition into the house

        this.tweens.add({ // (properties) creates a tween animation that smoothly moves the camera to the center of the house zone over 800 milliseconds, creating a cinematic effect as the player enters the house
            targets: player,
            x: zone.x,
            duration: 800,
            ease: 'Power1', // easing function that controls the acceleration of the tween, creating a smooth transition effect
            onComplete: () => { // callback function that is executed once the tween animation is complete
                this.cameras.main.fadeOut(800, 0, 0, 0);
            }
        });

        this.cameras.main.once('camerafadeoutcomplete', () => { // (event, callback)
            this.scene.start('EndScene'); 
        });
    }

    collectSpice(player, spice) {
        spice.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    collectGold(player, gold) {
        gold.disableBody(true, true);

        this.score += 25;
        this.scoreText.setText('Score: ' + this.score);
    }

    collectHoney(player, honey) {
        honey.disableBody(true, true);

        this.score += 15;
        this.scoreText.setText('Score: ' + this.score);
    }

    collectPearl(player, pearl) {
        pearl.disableBody(true, true);

        this.score += 30;
        this.scoreText.setText('Score: ' + this.score);
    }

    hitEnemy(player, enemy) {
        this.cameras.main.shake(100, 0.01);

        // prevent rapid multiple hits (IMPORTANT)
        if (this.hitCooldown) return;
        this.hitCooldown = true;

        this.time.delayedCall(500, () => {
            this.hitCooldown = false;
        });

        // reduce life
        this.lives--;

        this.livesText.setText('Lives: ' + this.lives);

        // optional: also reduce score
        this.score = Math.max(0, this.score - 20);
        this.scoreText.setText('Score: ' + this.score);

        // knockback
        if (player.x < enemy.x) {
            player.setVelocityX(-200);
        } else {
            player.setVelocityX(200);
        }

        // 💀 GAME OVER
        if (this.lives <= 0) {
            this.scene.start('GameOverScene');
        }
    }

    create() {
        this.score = 0;
        this.lives = 3;
        this.hitCooldown = false;
        this.entering = false;
        
        const platformData = [ // array of objects that define the position, key, and size of each platform in the level

            // =====================
            // STARTING AREA (easy)
            // =====================
            { x: 300, y: 180, key: 'med_log', w: 53, h: 12 }, // (x, y, key, width, height) 
            { x: 360, y: 120, key: 's_log', w: 34, h: 12 },
            { x: 410, y: 180, key: 'med_log', w: 53, h: 12},

            // small jump intro
            { x: 770, y: 242, key: 'l_log', w: 63, h: 12 },
            { x: 775, y: 230, key: 'med_log', w: 53, h: 12 },
            { x: 780, y: 218, key: 's_log', w: 34, h: 12 },
            { x: 785, y: 206, key: 'xs_log', w: 24, h: 12 },

            // =====================
            // GAP SECTION
            // =====================
            { x: 880, y: 142, key: 'l_log', w: 63, h: 12 },

            // floating challenge
            { x: 980, y: 100, key: 'med_log', w: 53, h: 12 },

            // =====================
            // MID GAME (slightly harder)
            // =====================
            { x: 1100, y: 180, key: 'l_log', w: 63, h: 12 },
            { x: 1260, y: 140, key: 's_log', w: 34, h: 12 },

            // stacked climb section
            { x: 1370, y: 242, key: 'l_log', w: 63, h: 12 },
            { x: 1365, y: 230, key: 'med_log', w: 53, h: 12 },
            { x: 1360, y: 218, key: 's_log', w: 34, h: 12 },
            { x: 1355, y: 206, key: 'xs_log', w: 24, h: 12 },

            // =====================
            // LONG JUMP AREA
            // =====================
            { x: 1500, y: 200, key: 'l_log', w: 63, h: 12 },
            { x: 1580, y: 170, key: 'med_log', w: 53, h: 12 },
            { x: 1690, y: 100, key: 'xs_log', w: 24, h: 12 }
        ];
        for (let x = 0; x < 3000; x += 155) { // creates a repeating background by adding multiple instances of the 'bg' image across the level, spaced 155 pixels apart
            let bg = this.add.image(x, 155, 'bg'); // (x, y, key) 
            bg.setScale(.29); // (scale) scales the background image to fit the desired size for the level, ensuring it covers the entire area without distortion
        }

        for (let x = 0; x < 3000; x += 250) {
            let tree = this.add.image(x, 210, 'tree');
            tree.setScale(.13);
        }

        let ground = this.physics.add.staticGroup(); // creates a static physics group called 'ground' that will be used to create the ground tiles for the level, allowing the player to collide with them and walk on them
        for (let x = 0; x < 3000; x += 128) {
            let tile = ground.create(x, 270, 'grass'); // (x, y, key)
            tile.setScale(.15).refreshBody(); // .refreshbody() updates the physics body of the tile after scaling, ensuring that the collision detection works correctly with the new size of the tile.
            tile.refreshBody();
        }

        this.scoreText = this.add.text(30, 100, 'Use ->, <- to move', {
            fontSize: '16px',
            fill: '#000000'
        })

        this.livesText = this.add.text(10, 10, 'Lives: 3', {  
            fontSize: '16px',
            fill: '#000000'
        }).setScrollFactor(0);

        this.scoreText = this.add.text(10, 30, 'Score: 0', {
            fontSize: '16px',
            fill: '#000000'
        }).setScrollFactor(0);

        this.platforms = this.physics.add.staticGroup();

        platformData.forEach(p => { // iterates through each object in the platformData array
            let platform = this.platforms.create(p.x, p.y, p.key)
                .setScale(0.2)
                .refreshBody();

            platform.body.setSize(p.w, p.h);
            platform.body.setOffset(5, 0);
        });

        this.spice = this.physics.add.group({
            allowGravity: false
        });
        this.gold = this.physics.add.group({
            allowGravity: false
        });
        this.honey = this.physics.add.group({
            allowGravity: false
        });
        this.pearl = this.physics.add.group({
            allowGravity: false
        });

        this.spice.create(360, 100, 'spice').setScale(0.07);;
        this.spice.create(900, 123, 'spice').setScale(0.07);
        this.spice.create(990, 80, 'spice').setScale(0.07);
        this.gold.create(990, 230, 'gold').setScale(0.12);
        this.honey.create(1260, 120, 'honey').setScale(0.12);
        this.pearl.create(1690, 80, 'pearl').setScale(0.12);

        this.enemies = this.physics.add.group();

        let enemy = this.enemies.create(900, 200, 'enemy_walk1');
        enemy.setScale(0.1);
        enemy.setVelocityX(-90);
        enemy.minX = 950;
        enemy.maxX = 1030;

        this.player = this.physics.add.sprite(20, 80, 'rajahH_idle'); //(x, y, key)
        this.player.setScale(.09);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, ground); // (object1, object2)
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, ground); // (object1, object2)
        this.physics.add.collider(this.enemies, this.platforms); // (object1, object2)

        this.kubo = this.physics.add.staticImage(1950, 198, 'kubo');
        this.kubo.setScale(0.2);
        this.kubo.refreshBody();

        this.houseZone = this.add.zone(1850, 240, 40, 80); // (x, y, width, height) 
        this.physics.world.enable(this.houseZone); // enables physics for the houseZone, allowing it to detect overlaps
        this.houseZone.body.setAllowGravity(false); // prevents the houseZone from being affected by gravity, ensuring it remains stationary
        this.houseZone.body.moves = false;

        this.physics.add.overlap( //overlap(object1, object2, callback, processCallback, context)
            this.player,
            this.houseZone,
            this.enterHouse,
            null,
            this
        );

        this.cursors = this.input.keyboard.createCursorKeys();

        this.walkFrames = ['rajahH_idle', 'rajahH_walk'];
        this.walkIndex = 0;
        this.walkTimer = 0;

        this.enemyFrames = ['enemy_walk1', 'enemy_walk2'];

        this.physics.add.overlap(this.player, this.spice, this.collectSpice, null, this); // allows the player to collect spice items by overlapping with them, triggering the collectSpice callback function when the overlap occurs
        this.physics.add.overlap(this.player, this.gold, this.collectGold, null, this);
        this.physics.add.overlap(this.player, this.honey, this.collectHoney, null, this);
        this.physics.add.overlap(this.player, this.pearl, this.collectPearl, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        this.physics.world.setBounds(0, 0, 2000, 288, true, true, true, true); // (x, y, width, height, checkLeft, checkRight, checkUp, checkDown) 
        this.cameras.main.setBounds(0, 0, 2000, 288); // (x, y, width, height)
        this.cameras.main.setDeadzone(256, 288); // (width, height)
        this.maxReachedX = this.player.x; // keeps track of the furthest horizontal position the player has reached, used to prevent the camera from moving back to areas the player has already passed
        this.prevCamX = 0;
        this.input.keyboard.on('keydown-ESC', () => {
            window.location.href = '../adventure.html';
        });
    }

    update() {
        this.enemies.children.iterate((enemy) => {
            if (!enemy) return;

            if (enemy.x <= enemy.minX) {
                enemy.setVelocityX(90);
            } else if (enemy.x >= enemy.maxX) {
                enemy.setVelocityX(-90);
            }

            // initialize if not existing
            if (enemy.animTimer === undefined) {
                enemy.animTimer = 0;
                enemy.animIndex = 0;
            }

            enemy.animTimer++;

            if (enemy.animTimer > 5) { // speed of animation
                enemy.animTimer = 0;

                enemy.animIndex++;
                if (enemy.animIndex >= this.enemyFrames.length) {
                    enemy.animIndex = 0;
                }

                enemy.setTexture(this.enemyFrames[enemy.animIndex]);
            }

            // flip depending on direction
            enemy.flipX = enemy.body.velocity.x < 0;
        });
        let isMoving = false;
        let cam = this.cameras.main;
        let centerX = cam.scrollX + 256; 

        
        if (this.player.x > centerX) { // if the player's horizontal position exceeds the center of the camera's current view, the camera will scroll to follow the player, keeping them centered on the screen as they move to the right
            cam.scrollX = this.player.x - 256;
        }

        
        if (cam.scrollX < this.prevCamX) { // if the camera's current horizontal scroll position is less than the previous scroll position, it means the camera is trying to move back to the left. In this case, the camera's scroll position is reset to the previous value, preventing it from moving back and ensuring that the player cannot see areas they have already passed
            cam.scrollX = this.prevCamX;
        }

        // save latest position
        this.prevCamX = cam.scrollX;

        if (this.player.x > this.maxReachedX) { // if the player's horizontal position exceeds the maximum reached X position, it means they have moved further to the right than they have before. In this case, the maxReachedX variable is updated to the player's current X position, allowing the camera to scroll further to the right as the player progresses through the level
            this.maxReachedX = this.player.x;
        }
        if (this.cursors.left.isDown) {
            const screenLeft = cam.scrollX + 20; 

            if (this.player.x > screenLeft) {
                this.player.setVelocityX(-150);
                this.player.flipX = true;
                isMoving = true;
            } else {
                this.player.setVelocityX(0);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(150);
            this.player.flipX = false;
            isMoving = true;
        } else {
            this.player.setVelocityX(0);
        }

        if (isMoving && this.player.body.blocked.down) { // if the player is moving left or right and is standing on the ground, the walk animation will play by cycling through the walkFrames array based on a timer. If the player is not moving or is in the air, the idle or jump texture will be displayed instead
            this.walkTimer++; // increments the walkTimer variable on each update cycle while the player is moving and on the ground, creating a timer that controls the animation speed of the walk cycle

            if (this.walkTimer > 8) {
                this.walkTimer = 0;

                this.walkIndex++; // increments the walkIndex variable to move to the next frame in the walkFrames array, creating the animation effect of walking. If the walkIndex exceeds the length of the walkFrames array, it resets back to 0 to loop the animation
                if (this.walkIndex >= this.walkFrames.length) {
                    this.walkIndex = 0;
                }

                this.player.setTexture(this.walkFrames[this.walkIndex]); // sets the player's texture to the current frame in the walkFrames array based on the walkIndex, creating the visual effect of walking as the player moves left or right on the ground
            }
        } else if (!isMoving && this.player.body.blocked.down) {
            this.player.setTexture('rajahH_idle');
        }

        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-290);
            this.player.setTexture('rajahH_jump');
        }
    }
}
class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);

        this.add.text(256, 120, "Game Over", {
            fontSize: '32px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        this.add.text(256, 160, "History Changed...", {
            fontSize: '16px',
            fill: '#ffff'
        }).setOrigin(0.5);

        this.add.text(256, 220, "Press SPACE to Restart", {
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(256, 250, "Press ESC to exit", {
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.stop('MainScene');  
            this.scene.start('StoryScene');
        });
        this.input.keyboard.on('keydown-ESC', () => {
            window.location.href = '../adventure.html';
        });
    }
}

class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    create() {
        this.cameras.main.fadeIn(800, 0, 0, 0);

        this.add.text(256, 120, "Level 1 Complete", {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(256, 160, "History Fulfilled", {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(256, 220, "Press SPACE to restart", {
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(256, 250, "Press ESC to exit", {
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.stop('MainScene');  
            this.scene.start('StoryScene');
        });
        this.input.keyboard.on('keydown-ESC', () => {
            window.location.href = '../adventure.html';
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 512,
    height: 288,
    pixelArt: true,
    parent: 'game-container',
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 500 }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [StoryScene, MainScene, EndScene, GameOverScene]
};

const game = new Phaser.Game(config);