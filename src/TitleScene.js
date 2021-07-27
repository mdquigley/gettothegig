import Phaser from 'phaser';
import * as Tone from 'tone';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: "TitleScene" });
    }

    preload() {
        // Load image assets
        this.load.image('titleBg', './src/assets/title-bg.png');
        this.load.image('titleImage', './src/assets/title-512.png');
        this.load.audio('blip', './src/assets/audio/blip.mp3');
    }

    create() {

        // Set variables for game window dimensions
        let wWidth = this.cameras.main.width;
        let wHeight = this.cameras.main.height;

        // Set background for title scene
        this.cameras.main.setBackgroundColor('#c8f7f1');

        // Add title graphic
        this.title = this.add.sprite(wWidth / 2, wHeight * 0.3, 'titleImage');
        this.title.setScale(1);

        // Add summary text
        let titleText = `Load-in was 30 minutes ago and your bandmates are nowhere to be found. Find all your gear and get to the gig!`
        this.summary = this.add.text(wWidth / 2, wHeight * 0.55, titleText, { color: '#4aaf56', align: 'center', wordWrap: { width: wWidth * 0.6, useAdvancedWrap: true } }).setOrigin(0.5);

        // Add ENTER text to advance play
        this.enter = this.add.text(wWidth / 2, wHeight * 0.7, "Press Enter to Play", { color: '#4aaf56', fontSize: '24px' }).setOrigin(0.5);

        /// Add navigation directions
        this.directions = this.add.text(wWidth / 2, wHeight * 0.8, "Use W A S D keys to navigate", { color: '#4aaf56' }).setOrigin(0.5);

        // Load sfx and set volume
        this.sfx = this.sound.add('blip');
        this.sfx.volume = 0.3;

        // Event listener for Enter key
        this.input.keyboard.on('keyup', (e) => {
            if (e.key === 'Enter') {

                // Start Tone (requires user action)
                Tone.start();

                // Play sfx
                this.sfx.play();

                // Advance to next scene
                this.scene.start('Level01');

                // Set tempo and start Tone.Transport
                Tone.Transport.bpm.value = 180;
                Tone.Transport.start();
            }
        });
    }
}