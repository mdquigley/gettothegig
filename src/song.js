import * as Tone from 'tone';

export function createKick() {
    // KICK
    const kick = new Tone.MembraneSynth({
        volume: -5,
        envelope: {
            sustain: 0,
            attack: 0.02,
            decay: 0.8
        },
        octaves: 10,
        pitchDecay: 0.01,
    }).toDestination();

    const kickPart = new Tone.Part(((time, note) => {
        kick.triggerAttackRelease(note, "16n", time);
    }), [["0:0:0", 'C2'], ["0:0:2", 'C2'], ["0:1:2", 'C2'], ["0:2:0", 'C2'], ["0:2:2", 'C2']]);
    kickPart.loop = true;
    kickPart.loopEnd = '1m';
    kickPart.start(0);

}

export function createSnare() {
    // SNARE
    const lowPass = new Tone.Filter({
        frequency: 11000,
    }).toDestination();
    const snare = new Tone.NoiseSynth({
        volume: -8,
        noise: {
            type: 'brown',
            playbackRate: 3
        },
        envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0,
            release: 0.1
        }
    }).connect(lowPass);

    const snarePart = new Tone.Loop(((time) => {
        snare.triggerAttack(time);
    }), "2n");
    snarePart.start("4n");
}

export function createGuitar() {

    // DISTORTION
    const dist = new Tone.Distortion(0.4).toDestination();


    // GUITAR
    const guitar = new Tone.PolySynth(Tone.Synth, {
        volume: -10,
        oscillator: {
            partials: [1, 2, 1],
        },
        envelope: {
            attack: 0.1,
            decay: 0.3,
            release: 0.1,
        },
    }).connect(dist);

    const cChord = ["C4", "E4", "G4"];
    const dChord = ["D4", "F4", "A4"];
    const eChord = ["E4", "G4", "B4"];
    const fChord = ["F4", "A4", "C5"];
    const gChord = ["G4", "B4", "D5"];

    const guitarPart = new Tone.Part(((time, chord) => {
        guitar.triggerAttackRelease(chord, "32n", time);
    }), [["0:0:2", cChord],
    ["0:1:2", cChord],
    ["0:2:2", fChord],
    ["0:3:2", fChord],
    ["1:0:2", cChord],
    ["1:1:2", cChord],
    ["1:2:2", gChord],
    ["1:3:2", gChord]]);

    guitarPart.loop = true;
    guitarPart.loopEnd = "2m";
    guitarPart.humanize = true;

    guitarPart.start(0);

}

export function createBass() {

    // BASS
    const bass = new Tone.MonoSynth({
        volume: -13,
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
    }).toDestination();

    const bassPart = new Tone.Sequence(((time, note) => {
        bass.triggerAttackRelease(note, "16n", time);
    }), [["C2", "C2"], [null, "C2"], ["F2", "F2"], [null, "F2"], ["C2", "C2"], [null, "C2"], ["G2", "G2"], [null, "G2"]], "4n");

    bassPart.start(0);
}

export function createFlute() {
    // FLUTE
    const flute = new Tone.MonoSynth({
        volume: -8,
        envelope: {
            attack: 0.1,
            decay: 0.3,
            release: 0.1,
        },
        filterEnvelope: {
            attack: 0.001,
            decay: 0.01,
            sustain: 0.5,
            baseFrequency: 200,
            octaves: 2.6
        }
    }).toDestination();

    const flutePart = new Tone.Sequence(((time, note) => {
        flute.triggerAttackRelease(note, "16n", time);
    }), ["E5", ["D5", "C5"], ["G4", "C5"], "B4", null, ["F4", "E4"], "D4", ["E4", "G4", "B4", "D5"]], "2n");

    flutePart.start(0);
}

// export function stop() {

//     // Set stop position for instrument parts
//     flutePart.stop(0);
//     bassPart.stop(0);
//     kickPart.stop(0);
//     snarePart.stop(0);
//     guitarPart.stop(0);

//     // Stop the transport
//     Tone.Transport.stop();
// }