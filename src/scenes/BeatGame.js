class BeatGame extends Phaser.Scene {
    constructor() {
        super("BeatGame");
    }

    preload() {
        this.load.spritesheet("BG", "./assets/Background.png", {frameWidth: 1600, frameHeight: 800, startFrame: 0, endFrame: 7});
    }

    create () {

        // menu text configuration
        let menuConfig = {
            fontFamily: 'Impact',
            fontSize: '40px',
            color: '#9E0129',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        let namesConfig = {
            fontFamily: 'Impact',
            fontSize: '28px',
            color: '#FF0000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.background = this.add.sprite(0,0, "BG").setOrigin(0);

        this.add.text(game.config.width/2, game.config.height/2 - 150, 'ALL BATTLES WON!!!', menuConfig).setOrigin(0.5);

        this.add.text(game.config.width/2, game.config.height/2 - 90, 'Thank you for playing!', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - 30, 'Credits: ', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 20, 'Ernani Raffo / Grant Bosworth / John Lynch / Nelson Pham', namesConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 100, 'Press (R) to restart or (M) for Menu', menuConfig).setOrigin(0.5);
        
        // keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

    }

    update () {

        StartingDeck = StartingDeckCopy;
        cardsMade = [];
        playerHealth = 0;
        playerStrength = 0;
        yourTurn = true;
        enemyTurn = false;
        game.config.cardChoice = null;
        game.config.currentLevel = 1;
        game.config.cardChoice2 = null;
        summonedBeast = false;

        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start("playGame");
        }
        if (Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.start("menuScene");
        }
    }
}