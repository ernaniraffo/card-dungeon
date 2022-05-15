class Play extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {
        // load assets here
        this.load.spritesheet("slime", "./assets/slime.png", {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet("Knight", "./assets/Knight.png", {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 1});
        this.load.spritesheet("BG", "./assets/Background.png", {frameWidth: 1600, frameHeight: 800, startFrame: 0, endFrame: 7});
        this.load.spritesheet("cards", "./assets/cards.png", {frameWidth: 96, frameHeight: 144, startFrame: 0, endFrame: 14});
        this.load.image("card", "./assets/card.png");
        this.load.image("shadow", "./assets/Shadow.png");
        this.load.image("amalgam", "./assets/amalgam.png");
        this.load.image("dog", "./assets/dog.png");

        // audio
        this.load.audio("hurt", "./assets/hurt.wav");
        this.load.audio("killed", "./assets/killed.wav");
    }

    create() {

        let hpConfig = {
            fontFamily: 'Impact',
            fontSize: '45px',
            color: 'Red',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // place enemy slime
        this.slime = this.add.sprite(8 *game.config.width / 10, 2.5 *game.config.height / 4, "slime").setOrigin(0.0);

        // place dog
        this.dog = this.add.sprite(game.config.width / 1.3, 2.5 *game.config.height / 4, "dog").setOrigin(0.0);
        this.dog.setScale(1.5);
        
        // place amalgam
        this.amalgam = this.add.sprite(game.config.width / 2, 2.5 *game.config.height / 10, "amalgam").setOrigin(0.0);
        this.amalgam.setScale(2);
        this.amalgam.setOrigin(0.5);

        // Background
        this.background = this.add.sprite(0,0, "BG").setOrigin(0);
        this.background.setDepth(-1);

        // place Player
        this.player = this.add.sprite(game.config.width / 10, 2.5 * game.config.height / 4, "Knight").setOrigin(0.0);
        this.shadow = this.add.sprite((game.config.width / 10), (2.5 * game.config.height/4) , "shadow").setOrigin(0.0);
        this.shadow.setDepth(-1);


        // slime anim
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("slime", {start: 0, end: 1}),
            frameRate: 8,
            repeat: -1
        });
        this.slime.setScale(1.5);
        this.slime.anims.play("idle");

        // Player anim
        this.anims.create({
            key: "idle1",
            frames: this.anims.generateFrameNumbers("Knight", {start: 0, end: 1}),
            frameRate: 8,
            repeat: -1
        });
        this.player.setScale(.5);
        this.shadow.setScale(.5);
        this.player.anims.play("idle1");
        this.background.setDepth(1);

        // slime hp
        this.slime.hp = 20;
        this.EnemyHPbar = this.add.text(this.slime.x + 7, this.slime.y - 55, this.slime.hp, hpConfig).setOrigin(0.0);
        this.EnemyHPbar.gone = false;

        // Player hp
        this.player.hp = 100;
        this.hpBar = this.add.text(this.player.x + 10, this.player.y - 55, this.player.hp, hpConfig).setOrigin(0.0);
        this.hpBar.gone = false;

        // Background anim
        this.anims.create({
            key: "bganimate",
            frames: this.anims.generateFrameNumbers("BG", {start: 0, end: 5}),
            frameRate: 2,
            repeat: -1
        });
        this.background.setScale(.5);
        this.background.anims.play("bganimate");
        this.background.setDepth(-1);

        let cardHeight = game.config.height /4;

        // card rows
        let row1, row2, row3;
        row1 = 2 * game.config.width / 6;
        row2 = 3 * game.config.width / 6;
        row3 = 4 * game.config.width / 6;
        
        let randomNumber = Math.floor(Math.random() * 14);

        // place card 1
        this.card1 = new Card(this, row1, cardHeight, "cards", cardTypes[randomNumber][1], 5, 0, randomNumber).setInteractive();
        this.card1.row = row1;
        this.card1.visible = true;
        
        randomNumber = Math.floor(Math.random() * 14);
        
        // place card2
        this.card2 = new Card(this, row2, cardHeight, "cards", cardTypes[randomNumber][1], 0, 0, randomNumber).setInteractive();
        this.card2.row = row2;
        this.card2.visible = true;
        
        randomNumber = Math.floor(Math.random() * 14);

        // place card3
        this.card3 = new Card(this, row3, cardHeight, "cards", cardTypes[randomNumber][1], 0, 10, randomNumber).setInteractive();
        this.card3.row = row3;
        this.card3.visible = true;

        // Card Selection
        if(yourTurn) {
            this.card1.on("pointerdown", () => {
                yourTurn = false;
                this.burnFX(this.slime, this.card1);
                this.bleed(this.player, this.card1);
                this.slime.hp -= this.card1.use();
                this.sound.play("hurt");
            });
            this.card2.on("pointerdown", () => {
                yourTurn = false;
                this.burnFX(this.slime, this.card2);
                this.bleed(this.player, this.card2);
                this.slime.hp -= this.card2.use();
                this.sound.play("hurt");
            });
            this.card3.on("pointerdown", () => {
                yourTurn = false;
                this.burnFX(this.slime, this.card3);
                this.bleed(this.player, this.card3);
                this.slime.hp -= this.card3.use();
                this.sound.play("hurt");
            });
        }
    }
    // Player Turn
    PlayerTurn() {

    }
    // Enemy Turn
    EnemyTurn() {
        yourTurn = true;
        this.time.delayedCall(1000, () => {
            this.player.hp -= 10;
        }, null, this);
    }

    update() {
        // update the text
        if (this.hpBar.txt != this.player.hp && !(this.hpBar.gone)) {
            this.hpBar.text = this.player.hp;
            if (this.player.hp <= 0) {
                this.player.destroy();
                this.hpBar.gone = true;
                this.time.delayedCall(500, () => {
                    this.hpBar.destroy();
                }, null, this);
            }
        }
        // update the text
        if (this.EnemyHPbar.txt != this.slime.hp && !(this.EnemyHPbar.gone)) {
            this.EnemyHPbar.text = this.slime.hp;
            if (this.slime.hp <= 0) {
                // kill the enemy
                this.sound.play("killed");
                this.slime.destroy();
                this.EnemyHPbar.gone = true;
                this.time.delayedCall(500, () => {
                    this.EnemyHPbar.destroy();
                }, null, this);
            }
        }

        if(yourTurn) {
            this.PlayerTurn();
        } else {
            this.EnemyTurn();

        }
        this.shadow.x = this.player.x + 5;
        this.shadow.y = this.player.y + 25;
    }

    burnFX(enemy, card) {
        if (card.burn > 0) {
            this.burning = this.time.delayedCall(700, () => {
                enemy.hp -= 1;
            }, null, this);
            this.burning.repeatCount = card.burn - 1;
        }
    }

    bleed(self, card) {
        if (card.bleed > 0) {
            this.bleeding = this.time.delayedCall(700, () => {
                self.hp -= 1;
            }, null, this);
            this.bleeding.repeatCount = card.bleed - 1;
        }
    }
}