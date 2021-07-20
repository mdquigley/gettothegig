import Phaser from 'phaser';
import wizard from './assets/sprites/wizard/idle_24.gif';
import guitar from './assets/sprites/music-ocal/32x32/guitar_electric.png';
import flute from './assets/sprites/music-ocal/32x32/flute.png';
import drums from './assets/sprites/music-ocal/32x32/drums.png';
import trumpet from './assets/sprites/music-ocal/32x32/trumpet.png';
import turntable from './assets/sprites/MegaPixelArt32x32pxIcons_SpriteSheet/turntable.png';

import blip from './assets/audio/blip.mp3';
import * as Tone from 'tone';
import songtest from './songtest.js';
import * as song from './song.js';
import forest from './assets/tiles/forest-03.json';
import tiles from './assets/tiles/RPG\ Nature\ Tileset.png';

class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        // load player image
        this.load.image('wizard', wizard);

        // load instrument images
        this.load.image('guitar', guitar);
        this.load.image('flute', flute);
        this.load.image('drums', drums);
        this.load.image('trumpet', trumpet);
        this.load.image('turntable', turntable)

        // load sfx
        this.load.audio('blip', blip);

        // load map
        this.load.image('tiles', tiles);
        this.load.tilemapTiledJSON('forest', forest);

    }

    create() {

        // Create Map
        const map = this.make.tilemap({ key: 'forest' });
        const tileset = map.addTilesetImage('forest', 'tiles', 32, 32, 0, 0);

        const groundLayer = map.createStaticLayer('ground', tileset);
        groundLayer.setCollisionByProperty({ collides: true });

        const wallsLayer = map.createStaticLayer('trees', tileset);
        wallsLayer.setCollisionByProperty({ collides: true });


        // // DEBUG COLLISIONS
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
        this.guitar = this.physics.add.image(570, 290, 'guitar');
        this.guitar.name = 'guitar';
        this.guitar.body.collideWorldBounds = true;

        // Create flute
        this.flute = this.physics.add.image(53, 410, 'flute');
        this.flute.name = 'flute';
        this.flute.body.collideWorldBounds = true;

        // Create drums
        this.drums = this.physics.add.image(60, 160, 'drums');
        this.drums.name = 'drums';
        this.drums.body.collideWorldBounds = true;

        // Create trumpet
        this.trumpet = this.physics.add.image(570, 60, 'trumpet');
        this.trumpet.name = 'trumpet';
        this.trumpet.body.collideWorldBounds = true;

        // Create turntable
        this.turntable = this.physics.add.image(600, 530, 'turntable');
        this.turntable.name = 'turntable';
        this.turntable.body.collideWorldBounds = true;
        this.turntable.displayHeight = 40;
        this.turntable.displayWidth = 40;
        this.turntable.flipX = true;

        // Create player
        this.player = this.physics.add.image(50, 50, 'wizard');
        this.player.displayHeight = 32;
        this.player.displayWidth = 32;
        this.player.body.collideWorldBounds = true;
        this.physics.add.collider(this.player, wallsLayer);
        this.physics.add.collider(this.player, groundLayer);


        // Create sound
        this.soundFX = this.sound.add('blip');
        this.soundFX.volume = 0.3;

        // Create keys for Movement Commands (WASD)
        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    }

    update(delta) {

        const speed = 100;

        // Define Movement Commands (WASD)
        if (this.key_W.isDown) {
            // this.player.y--;
            this.player.setVelocity(0, -speed);
        } else if (this.key_A.isDown) {
            // this.player.x--;
            this.player.setVelocity(-speed, 0);
            this.player.flipX = true;
        } else if (this.key_S.isDown) {
            // this.player.y++;
            this.player.setVelocity(0, speed);

        } else if (this.key_D.isDown) {
            // this.player.x++;
            this.player.setVelocity(speed, 0);
            this.player.flipX = false;
        } else {
            this.player.setVelocity(0, 0);
        }


        this.obtained(this.guitar, this.player, this.soundFX);
        this.obtained(this.flute, this.player, this.soundFX);
        this.obtained(this.drums, this.player, this.soundFX);
        this.obtained(this.trumpet, this.player, this.soundFX);
        this.obtained(this.turntable, this.player, this.soundFX);

    }

    obtained(item, player, sfx) {
        if (this.physics.overlap(player, item) && !sfx.isPlaying) {
            console.log(item);
            sfx.play();
            item.destroy();
            if (item.name === 'guitar') {
                song.createGuitar();
            }
            if (item.name === 'flute') {
                song.createFlute();
            }
            if (item.name === 'drums') {
                song.createKick();
                song.createSnare();
            }
            if (item.name === 'trumpet') {
                song.createBass();
            }
            if (item.name === 'turntable') {
                song.finale();
            }
        }
    }
}


const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    scale: {
        zoom: 1
    },
    physics: {
        default: 'arcade',
    },
    scene: MyGame
};

const game = new Phaser.Game(config);

// Start Transport on button click
const button = document.getElementById('play');
button.addEventListener("click", e => {
    if (button.playing === 'false') {
        // Change play status
        button.playing = 'true';
        button.innerText = "Stop";
        Tone.Transport.bpm.value = 180;
        Tone.Transport.start();
    } else {
        // Change play status
        button.playing = 'false';
        // Stop the transport
        Tone.Transport.stop();
        // Update button text
        button.innerText = "Start";
    }
});