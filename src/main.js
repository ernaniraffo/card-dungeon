
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    backgroundColor: 0x00000000,
    scene: [ Menu, Play, GameOver, GameOver2, GameOver3, Level2, CardSelect, CardDraw, Level3 ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
}

let game = new Phaser.Game(config);

game.config.cardChoice = 0;
game.config.currentLevel = 1;

let yourTurn = true;
let enemyTurn = false;

// 2D Array of Card Names, Stats + etc...
// Name, Damage, Burn, Bleed, Strength
let cardTypes = [
    ["Ace", 1, 0, 0, 3],
    ["Slash", 6, 0, 0, 0],
    ["Reklass Charge", 4, 0, 0, 2],
    ["Field Gauze", 0, 0, 0, 0],
    ["Mangle", 6, 0, 3, 0, 0],
    ["Stitchasone", 0, 0, 0, 3],
    ["Flatten", 2, 0, 0, 0],
    ["Blue Ace", 1, 0, 0, 5],
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
    ["Rot Myst", 0, 0, 0, 0],
    ["Flesh Wound", 0, 0, 0, 0],
    ["Fatal Blow", 0, 0, 0, 0],
    ["Bile Bomb", [1, 5], 0, 0, 0]
];

let copyCardTypes = [
    ["Ace", 1, 0, 0, 3],
    ["Slash", 6, 0, 0, 0],
    ["Reklass Charge", 4, 0, 0, 2],
    ["Field Gauze", 0, 0, 0, 0],
    ["Mangle", 6, 0, 3, 0, 0],
    ["Stitchasone", 0, 0, 0, 3],
    ["Flatten", 2, 0, 0, 0],
    ["Blue Ace", 1, 0, 0, 5],
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
    ["Rot Myst", 0, 0, 0, 0],
    ["Flesh Wound", 0, 0, 0, 0],
    ["Fatal Blow", 0, 0, 0, 0],
    ["Bile Bomb", [1, 5], 0, 0, 0]
];

//cards added to starting deck
let cardsMade = [];

//starting deck
let StartingDeck = [
    ["Ace", 1, 0, 0, 3],
    ["Slash", 6, 0, 0, 0],
    ["Reklass Charge", 4, 0, 0, 2],
    ["Field Gauze", 0, 0, 0, 0],
    ["Mangle", 6, 0, 3, 0, 0]
]

//starting deck
let StartingDeckCopy = [
    ["Ace", 1, 0, 0, 3],
    ["Slash", 6, 0, 0, 0],
    ["Reklass Charge", 4, 0, 0, 2],
    ["Field Gauze", 0, 0, 0, 0],
    ["Mangle", 6, 0, 3, 0, 0]
]

// global player strength + health
let playerHealth; // just to start level 2 from the Card Draw scene
let playerStrength;

// reserve keyboard variables
let keyRIGHT, keyR, keyM;

function checkTexture(num) {
    if (num == (StartingDeck.length - 1)) {
        return "newcard";
    }
    return "cards";
}