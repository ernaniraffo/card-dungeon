
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    backgroundColor: 0x00000000,
    scene: [Menu, Play, GameOver, Level2],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
}

let game = new Phaser.Game(config);
let yourTurn = true;
let enemyTurn = false;

// 2D Array of Card Names, Stats + etc...
// Name, Damage, Burn, Bleed, Strength
let cardTypes = [
    ["Ace", 1, 0, 0, 1],
    ["Slash", 6, 0, 0, 0],
    ["Reklass Charge", 4, 0, 0, 2],
    ["Field Gauze", 0, 0, 0, 0],
    ["Mangle", 6, 0, 3, 0, 0],
    ["Stitchasone", 0, 0, 0, 3],
    ["Flatten", 2, 0, 0, 0],
    ["Blue Ace", 2, 0, 0, 2],
    ["Strong Stance", 0, 0, 0, 0],
    ["Parry", 0, 0, 0, 0],
    ["Fan the Flames", 0, 2, 0, 0],
    ["Fuzzy Friend", 0, 0, 0, 0],
    ["Flying Fury Fist", 5, 0, 0, 0],
    ["Flagellate", 0, 0, 3, 2],
    ["Eldritch Lore", 0, 0, 0, 0],
    ["Bludgeon", 5, 0, 0, 0],
    ["Myst. Mixture", [0, 10], 0, 0, 0],
    ["Ichor Bomb", [3, 4], 0, 0, 0],
    ["Point Blank", [5, 7], 0, 0, 0],
    ["Rot Myst", 0, 0, 5, 0],
    ["Flesh Wound", 0, 0, 0, 0],
    ["Fatal Blow", 0, 0, 0, 0],
    ["Bile Bomb", [1, 5], 0, 0, 0]
];

// global player strength + health
let playerHealth;
let playerStrength;

// reserve keyboard variables
let keyRIGHT, keyR, keyM;