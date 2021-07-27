import Phaser from 'phaser';
import * as Tone from 'tone';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: "TitleScene" });
    }

    preload() {
        this.load.image('titleBg', './src/assets/title-bg.png');
        this.load.image('titleImage', './src/assets/title-512.png');
        this.load.audio('blip', './src/assets/audio/blip.mp3');
    }

    create() {
        let windowWidth = this.cameras.main.width;
        let windowHeight = this.cameras.main.height;

        this.cameras.main.setBackgroundColor('#c8f7f1');

        this.title = this.add.sprite(windowWidth / 2, windowHeight * 0.3, 'titleImage');
        this.title.setScale(1);

        let titleText = `Load-in was 30 minutes ago and your bandmates are nowhere to be found. Find all your gear and get to the gig!`
        this.directions = this.add.text(windowWidth / 2, windowHeight * 0.55, titleText, { color: '#4aaf56', align: 'center', wordWrap: { width: windowWidth * 0.6, useAdvancedWrap: true } }).setOrigin(0.5);


        this.enter = this.add.text(windowWidth / 2, windowHeight * 0.7, "Press Enter to Play", { color: '#4aaf56' }).setOrigin(0.5);

        this.input.keyboard.on('keyup', (e) => {
            console.log(e.key)
            if (e.key === 'Enter') {
                this.scene.start('MyGame');
                Tone.Transport.bpm.value = 180;
                Tone.Transport.start();
            }
        });
    }
}