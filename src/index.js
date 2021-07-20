import Phaser from 'phaser';
import wizard from './assets/sprites/wizard/idle_24.gif';
import guitar from './assets/sprites/music-ocal/32x32/guitar_electric.png';
import flute from './assets/sprites/music-ocal/32x32/flute.png';
import drums from './assets/sprites/music-ocal/32x32/drums.png';
import trumpet from './assets/sprites/music-ocal/32x32/trumpet.png';

import blip from './assets/audio/blip.mp3';
import * as Tone from 'tone';
import songtest from './songtest.js';
import * as song from './song.js';

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

        // load sfx
        this.load.audio('blip', blip);

    }

    create() {

        // Create guitar
        this.guitar = this.physics.add.image(100, 100, 'guitar');
        this.guitar.name = 'guitar';
        this.guitar.body.collideWorldBounds = true;

        // Create flute
        this.flute = this.physics.add.image(200, 150, 'flute');
        this.flute.name = 'flute';
        this.flute.body.collideWorldBounds = true;

        // Create drums
        this.drums = this.physics.add.image(220, 110, 'drums');
        this.drums.name = 'drums';
        this.drums.body.collideWorldBounds = true;

        // Create trumpet
        this.trumpet = this.physics.add.image(200, 20, 'trumpet');
        this.trumpet.name = 'trumpet';
        this.trumpet.body.collideWorldBounds = true;

        // Create player
        this.player = this.physics.add.image(150, 100, 'wizard');
        this.player.displayHeight = 32;
        this.player.displayWidth = 32;
        this.player.body.collideWorldBounds = true;

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

        // Define Movement Commands (WASD)
        if (this.key_W.isDown) {
            this.player.y--;
        }
        if (this.key_A.isDown) {
            this.player.x--;
        }
        if (this.key_S.isDown) {
            this.player.y++;
        }
        if (this.key_D.isDown) {
            this.player.x++;
        }

        this.obtained(this.guitar, this.player, this.soundFX);
        this.obtained(this.flute, this.player, this.soundFX);
        this.obtained(this.drums, this.player, this.soundFX);
        this.obtained(this.trumpet, this.player, this.soundFX);


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
        }
    }
}


const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
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