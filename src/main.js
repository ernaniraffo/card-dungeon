
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

// reserve keyboard variables
let keyRIGHT;