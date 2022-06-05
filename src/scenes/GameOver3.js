class GameOver3 extends Phaser.Scene {
    constructor() {
        super("gameOver3");
    }

    preload() {
        this.load.spritesheet("BG", "./assets/Background.png", {frameWidth: 1600, frameHeight: 800, startFrame: 0, endFrame: 7});
    }

    create () {

        // menu text configuration
        let menuConfig = {
            fontFamily: 'Impact',
            fontSize: '40px',
            color: '#FF0000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.background = this.add.sprite(0,0, "BG").setOrigin(0);

        this.add.text(game.config.width/2, game.config.height/2 - 64, 'BATTLE WON!!', menuConfig).setOrigin(0.5);

        this.add.text(game.config.width/2, game.config.height/2, 'Entering The Final Battle', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) for finale or (M) for Menu', menuConfig).setOrigin(0.5);
        
        // keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

    }

    update () {
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start("CardSelect");
        }
        if (Phaser.Input.Keyboard.JustDown(keyM)) {
            // reset cards
            StartingDeck = StartingDeckCopy;
            this.scene.start("menuScene");
        }
    }
}