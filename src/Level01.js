import Phaser from 'phaser';
import wizard from './assets/sprites/wizard/idle_24.gif';
import guitar from './assets/sprites/music-ocal/32x32/guitar_electric.png';
import flute from './assets/sprites/music-ocal/32x32/flute.png';
import drums from './assets/sprites/music-ocal/32x32/drums.png';
import tuba from './assets/sprites/tuba.png';
import turntable from './assets/sprites/MegaPixelArt32x32pxIcons_SpriteSheet/turntable.png';
import musicnote1 from './assets/sprites/MegaPixelArt32x32pxIcons_SpriteSheet/music-note-1.png';
import musicnote2 from './assets/sprites/MegaPixelArt32x32pxIcons_SpriteSheet/music-note-2.png';
import scratch from './assets/audio/record-scratch.mp3';
import blip from './assets/audio/blip.mp3';
import * as Tone from 'tone';
import * as song from './song.js';
import level from './assets/tiles/level-01.json';
import tiles from './assets/tiles/RPG\ Nature\ Tileset.png';
import shea from './assets/shea-3d-128.png';

export default class Level01 extends Phaser.Scene {
    constructor() {
        super({ key: "Level01" });
    }

    preload() {
        // Load player image
        this.load.image('wizard', wizard);

        // Load item images
        this.load.image('guitar', guitar);
        this.load.image('flute', flute);
        this.load.image('drums', drums);
        this.load.image('tuba', tuba);
        this.load.image('merch', turntable);

        // Load success images
        this.load.image('musicnote1', musicnote1);
        this.load.image('musicnote2', musicnote2);


        // Load sfx
        this.load.audio('blip', blip);
        this.load.audio('scratch', scratch);

        // Load map assets
        this.load.image('tiles', tiles);
        this.load.tilemapTiledJSON('level', level);

        this.load.image('shea', shea);

    }

    create() {

        this.count = 0;
        this.won = false;

        /* ***** MAP ***** */
        // create map
        const map = this.make.tilemap({ key: 'level' });
        const tileset = map.addTilesetImage('nature', 'tiles', 32, 32, 0, 0);

        // Add ground layer
        const groundLayer = map.createLayer("ground", tileset);
        groundLayer.setCollisionByProperty({ collides: true });

        // Add mushrooms
        const shroomLayer = map.createLayer('mushrooms', tileset);

        // Add obstacles layer
        const wallsLayer = map.createLayer('obstacles', tileset);
        wallsLayer.setCollisionByProperty({ collides: true });


        /* ***** DEBUG COLLISIONS ***** */
        // const debugGraphics = this.add.graphics().setAlpha(0.7);
        // wallsLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        // });
        // groundLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(255, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(100, 39, 37, 255)
        // });


        // Create guitar
        this.guitar = this.physics.add.image(530, 593, 'guitar');
        this.guitar.name = 'guitar';
        this.guitar.body.collideWorldBounds = true;

        // Create flute
        this.flute = this.physics.add.image(53, 593, 'flute');
        this.flute.name = 'flute';
        this.flute.body.collideWorldBounds = true;

        // Create drums
        this.drums = this.physics.add.image(330, 170, 'drums');
        this.drums.name = 'drums';
        this.drums.body.collideWorldBounds = true;

        // Create tuba
        this.tuba = this.physics.add.image(180, 300, 'tuba');
        this.tuba.displayWidth = 32;
        this.tuba.displayHeight = 32;
        this.tuba.flipX = true;
        this.tuba.name = 'tuba';
        this.tuba.body.collideWorldBounds = true;

        // Create merch
        this.merch = this.physics.add.image(440, 100, 'merch');
        this.merch.name = 'merch';
        this.merch.body.collideWorldBounds = true;
        this.merch.displayHeight = 40;
        this.merch.displayWidth = 40;
        this.merch.flipX = true;

        // Create Goal Walls
        this.goalWalls = this.physics.add.image(540, 320, 'shea');
        this.goalWalls.scale = 0.2;
        this.goalWalls.name = 'goalWalls';
        this.goalWalls.setImmovable();
        this.goalWalls.body.offset.y = -200;
        this.goalWalls.body.offset.x = 20;

        // Create Goal Entry
        this.goalEntry = this.physics.add.image(540, 320, 'shea');
        this.goalEntry.scale = 0.2;
        this.goalEntry.name = 'goalEntry';
        this.goalEntry.setImmovable();
        this.goalEntry.body.offset.y = -198;
        this.goalEntry.body.offset.x = 50;

        // Create player
        this.player = this.physics.add.image(50, 50, 'wizard');
        this.player.displayHeight = 32;
        this.player.displayWidth = 32;
        this.player.body.collideWorldBounds = true;
        this.physics.add.collider(this.player, wallsLayer);
        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.player, this.goalWalls);

        this.physics.add.collider(this.player, this.goalEntry, () => {
            if (this.count === 5 && this.won !== true) {
                song.finale(Tone.now());
                this.won = true;

                for (let i = 0; i < 10; i++) {
                    let note = this.physics.add.image(this.player.x, this.player.y, ((i % 2 != 0) ? 'musicnote1' : 'musicnote2'));
                    note.setVelocity(Math.floor(Math.random() * -300), Math.floor(Math.random() * -300));
                    note.setGravity(0, Math.floor(Math.random() * 400));
                }
            }
        });

        // Create sound
        this.blip = this.sound.add('blip');
        this.blip.volume = 0.3;

        this.scratch = this.sound.add('scratch');
        this.scratch.volume = 0.5;

        // Create keys for Movement Commands (WASD)
        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    }

    update(delta) {

        // Set speed for movement (faster when testing helps)
        const speed = 200;

        // Define Movement Commands (WASD)
        if (this.key_W.isDown) {
            this.player.setVelocity(0, -speed);
        } else if (this.key_A.isDown) {
            this.player.setVelocity(-speed, 0);
            this.player.flipX = true; // reflect left movement
        } else if (this.key_S.isDown) {
            this.player.setVelocity(0, speed);
        } else if (this.key_D.isDown) {
            this.player.setVelocity(speed, 0);
            this.player.flipX = false; // reflect right movement
        } else {
            this.player.setVelocity(0, 0);
        }


        // Check if player has obtained items, supply sound
        this.obtained(this.guitar, this.player, this.blip);
        this.obtained(this.flute, this.player, this.blip);
        this.obtained(this.drums, this.player, this.blip);
        this.obtained(this.tuba, this.player, this.blip);
        this.obtained(this.merch, this.player, this.scratch);

    }

    // Test if player has obtained items
    obtained(item, player, sfx) {
        if (this.physics.overlap(player, item) && !sfx.isPlaying) {

            // Remove the item from the game
            item.destroy();

            // Play the supplied sound
            sfx.play();

            // Add instrument part to song and increase count
            if (item.name === 'guitar') {
                song.createGuitar();
                this.count++;
            }
            if (item.name === 'flute') {
                song.createFlute();
                this.count++;
            }
            if (item.name === 'drums') {
                song.createKick();
                song.createSnare();
                this.count++;

            }
            if (item.name === 'tuba') {
                song.createBass();
                this.count++;

            }

            // No song part for merch, just increase count
            if (item.name === 'merch') {
                this.count++;
            }

        }
    }
}