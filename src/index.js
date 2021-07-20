import Phaser from 'phaser';
import wizard from './assets/sprites/wizard/idle_24.gif';
import guitar from './assets/sprites/music-ocal/32x32/guitar_electric.png';
import piano from './assets/sprites/music-ocal/32x32/piano.png';
import blip from './assets/audio/blip.mp3';
import * as Tone from 'tone';

class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('wizard', wizard);
        this.load.image('guitar', guitar);
        this.load.image('piano', piano);
        this.load.audio('blip', blip);

    }

    create() {

        // Create guitar
        this.guitar = this.physics.add.image(100, 100, 'guitar');
        this.guitar.name = 'guitar';
        this.guitar.body.collideWorldBounds = true;
        this.guitar.body.setGravityY(-200);

        // Create piano
        this.piano = this.physics.add.image(200, 150, 'piano');
        this.piano.name = 'piano';
        this.piano.body.collideWorldBounds = true;
        this.piano.body.setGravityY(-200);

        // Create player
        this.player = this.physics.add.image(150, 100, 'wizard');
        this.player.displayHeight = 32;
        this.player.displayWidth = 32;
        this.player.body.collideWorldBounds = true;
        this.player.body.allowGravity = false;

        // Create sound
        this.soundFX = this.sound.add('blip');
        this.soundFX.volume = 0.3;

        // Create keys for Movement Commands (WASD)
        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.createKick();

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
        this.obtained(this.piano, this.player, this.soundFX);
    }

    obtained(item, player, sfx) {
        if (this.physics.overlap(player, item) && !sfx.isPlaying) {
            console.log(item);
            sfx.play();
            item.destroy();
            if (item.name === 'piano') {
                this.createPiano();
            }
            if (item.name === 'guitar') {
                this.createGuitar();
            }
        }
    }

    createKick() {
        // KICK
        const kick = new Tone.MembraneSynth({
            envelope: {
                sustain: 0,
                attack: 0.02,
                decay: 0.8
            },
            octaves: 10,
            pitchDecay: 0.01,
        }).toDestination();

        const kickPart = new Tone.Loop(((time) => {
            kick.triggerAttackRelease("C2", "8n", time);
        }), "2n").start(0);
    }

    createPiano() {
        // Piano
        const keys = new Tone.PolySynth(Tone.Synth, {
            volume: -8,
            oscillator: {
                partials: [1, 2, 1],
            },
        }).toDestination();

        const cChord = ["C4", "E4", "G4", "B4"];
        const dChord = ["D4", "F4", "A4", "C5"];
        const gChord = ["B3", "D4", "E4", "A4"];
        const pianoPart = new Tone.Part(((time, chord) => {
            keys.triggerAttackRelease(chord, "8n", time);
        }), [["0:0:2", cChord], ["0:1", cChord], ["0:1:3", dChord], ["0:2:2", cChord], ["0:3", cChord], ["0:3:2", gChord]]).start(0);

        pianoPart.loop = true;
        pianoPart.loopEnd = "1m";
        pianoPart.humanize = true;
    }

    createGuitar() {
        // Guitar

        const reverb = new Tone.Reverb().toDestination();

        const guitar = new Tone.MonoSynth({
            volume: -5,
            envelope: {
                attack: 0.1,
                decay: 0.3,
                release: 2,
            },
            filterEnvelope: {
                attack: 0.001,
                decay: 0.01,
                sustain: 0.5,
                baseFrequency: 200,
                octaves: 2.6
            }
        }).connect(reverb);

        const guitarPart = new Tone.Sequence(((time, note) => {
            guitar.triggerAttackRelease(note, "16n", time);
        }), ["C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6"], "4n").start(0);

        guitarPart.probability = 0.9;

    }

}


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);

// Start Transport on button click
document.getElementById('start').addEventListener("click", e => Tone.Transport.start());

// Set the transport BPM
Tone.Transport.bpm.value = 100;