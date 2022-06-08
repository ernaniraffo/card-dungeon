class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load menu assets
        this.load.spritesheet("BG", "./assets/Background.png", {frameWidth: 1600, frameHeight: 800, startFrame: 0, endFrame: 7});
        
        this.load.audio("menuMusic", "./assets/intro_organ.wav");
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Impact',
            fontSize: '50px',
            color: '#8B0000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        let instructionConfig = {
            fontFamily: 'Helvetica',
            fontSize: '30px',
            color: '#0000FF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.background = this.add.sprite(0,0, "BG").setOrigin(0);
        this.add.text(game.config.width/2, game.config.height/5, 'Welcome To Our Card Dungeon', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/3, '1) Press -> to Play', instructionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 - 30, game.config.height/3 + 50, '2) Game is One on One with an enemy', instructionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 - 20, game.config.height/3 + 100, '3) Pick a card out of the 3 shown to attack enemy', instructionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 - 20, game.config.height/3 + 150, '4) First player that reaches zero health loses the battle', instructionConfig).setOrigin(0.5);

        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        this.music = this.sound.add('menuMusic', {
            loop: true
        });
    }

    update() {
        if (!(this.music.isPlaying)) {
            console.log("playing");
            this.music.play();
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.sound.stopAll();
            this.scene.start("playGame");
        }
    }
}