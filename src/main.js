
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    backgroundColor: 0x00000000,
    scene: [Menu, Play],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
}

let game = new Phaser.Game(config);
let yourTurn = true;

// 2D Array of Card Names, Stats + etc...
// I just have the Name and Damage saved for now
let cardTypes = [
    ["Ace", 0],
    ["Slash", 6],
    ["Reklass Charge", 0],
    ["Field Gauze", 0],
    ["Mangle", 3],
    ["Stitchasone", 0],
    ["Flatten", 2],
    ["Strong Stance", 0],
    ["Parry", 0],
    ["Fan the Flames", 0],
    ["Fuzzy Friend", 0],
    ["Flying Fury Fist", 1],
    ["Flagellate", 0],
    ["Eldritch Lore", 0],
];

// reserve keyboard variables
let keyRIGHT;