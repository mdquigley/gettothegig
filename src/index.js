import Phaser from 'phaser';
import * as Tone from 'tone';

import TitleScene from './TitleScene.js';
import Level01 from './Level01.js';

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    scale: {
        zoom: 1
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [TitleScene, Level01]
};

const game = new Phaser.Game(config);