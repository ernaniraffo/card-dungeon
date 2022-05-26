class Play extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {
        // load assets here
        this.load.spritesheet("slime", "./assets/slime.png", {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet("Knight", "./assets/Knight.png", {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 1});
        this.load.spritesheet("BG", "./assets/Background.png", {frameWidth: 1600, frameHeight: 800, startFrame: 0, endFrame: 7});
        this.load.spritesheet("cards", "./assets/cards.png", {frameWidth: 96, frameHeight: 144, startFrame: 0, endFrame: 22});
        this.load.spritesheet("fire", "./assets/FireSpirit.png", {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 3});
        this.load.spritesheet("shade", "./assets/shade.png", {frameWidth: 150, frameHeight: 150, startFrame: 0, endFrame: 8});
        this.load.spritesheet("sporeMan", "./assets/sporeMan.png", {frameWidth: 250, frameHeight: 250, startFrame: 0, endFrame: 10});
        this.load.spritesheet("bleed", "./assets/bleed.png", {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 20});

        this.load.image("rat", "./assets/rat.png");
        this.load.image("rat2", "./assets/rat2.png");
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

        let strengthConfig = {
            fontFamily: 'Impact',
            fontSize: '15px',
            color: 'Gold',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // place enemy slime
        this.slime = this.add.sprite(8 *game.config.width / 10, 2.5 *game.config.height / 4, "slime").setOrigin(0.0);
        this.slime.attack = 10;

        // // place enemy rat
        // this.rat = this.add.sprite(game.config.width / 3, 2.5 *game.config.height / 7, "rat").setOrigin(0.0);
        // this.rat.setScale(1.5);

        // // place enemy rat2
        // this.rat2 = this.add.sprite(game.config.width / 2, 2 *game.config.height / 10, "rat2").setOrigin(0.0);
        // this.rat2.setScale(.2);

        // // place dog
        // this.dog = this.add.sprite(game.config.width / 1.3, 2.5 *game.config.height / 4, "dog").setOrigin(0.0);
        // this.dog.setScale(1.5);

        // //add shade
        // this.shade = this.add.sprite(game.config.width / 1.9, 2.5 *game.config.height / 4, "shade").setOrigin(0.0);
        // this.shade.setScale(1.5);

        // //add sporeman
        // this.sporeMan = this.add.sprite(game.config.width / 1.3, game.config.height / 10-90, "sporeMan").setOrigin(0.0);
        // this.sporeMan.setScale(1);
        
        // // place amalgam
        // this.amalgam = this.add.sprite(game.config.width / 2, 2.5 *game.config.height / 10, "amalgam").setOrigin(0.0);
        // this.amalgam.setScale(2);
        // this.amalgam.setOrigin(0.5);

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

        // // spore anim break this up into the attack and idle anims once coded!!!
        // this.anims.create({
        //     key: "idleSpore",
        //     frames: this.anims.generateFrameNumbers("sporeMan", {start: 0, end: 10}),
        //     frameRate: 8,
        //     repeat: -1
        // });
        // this.sporeMan.anims.play("idleSpore");


        // //shade anim
        // this.anims.create({
        //     key: "idleShade",
        //     frames: this.anims.generateFrameNumbers("shade", {start: 0, end: 8}),
        //     frameRate: 8,
        //     repeat: -1
        // });
        // this.shade.setScale(1.5);
        // this.shade.anims.play("idleShade");

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

        // bleed anim
        this.anims.create({
            key: "bleeding",
            frames: this.anims.generateFrameNumbers("bleed", {start: 0, end: 20}),
            frameRate: 20
        })

        // Fire anim
        this.anims.create({
            key: "fire",
            frames: this.anims.generateFrameNumbers("fire", {start: 0, end: 3}),
            frameRate: 8,
            repeat: -1
        });

        // slime hp
        this.slime.hp = 20;
        this.slime.bleed = 0;
        this.EnemyHPbar = this.add.text(this.slime.x + 7, this.slime.y - 55, this.slime.hp, hpConfig).setOrigin(0.0);
        this.EnemyHPbar.gone = false;

        // Player hp
        this.player.hp = 100;
        this.player.hpBar = this.add.text(this.player.x + 10, this.player.y - 55, this.player.hp, hpConfig).setOrigin(0.0);
        this.player.hpBar.gone = false;
        this.player.strength = 0;
        this.player.bleed = 0;
        this.player.strengthBar = this.add.text(this.player.x + 65, this.player.y + 10, this.player.strength, strengthConfig).setOrigin(0,0);
        this.player.strengthBar.alpha = 0;

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
        
        let randomNumber = Math.floor(Math.random() * 22);
        // randomNumber = 4;

        // place card 1
        this.card1 = new Card(this, row1, cardHeight, "cards", cardTypes[randomNumber][1], cardTypes[randomNumber][2], cardTypes[randomNumber][3], cardTypes[randomNumber][4], randomNumber).setInteractive();
        this.card1.row = row1;
        this.card1.visible = true;
        
        randomNumber = Math.floor(Math.random() * 22);
        // randomNumber = 19;
        
        // place card2
        this.card2 = new Card(this, row2, cardHeight, "cards", cardTypes[randomNumber][1], cardTypes[randomNumber][2], cardTypes[randomNumber][3], cardTypes[randomNumber][4],randomNumber).setInteractive();
        this.card2.row = row2;
        this.card2.visible = true;
        
        randomNumber = Math.floor(Math.random() * 22);
        // randomNumber = 4;

        // place card3
        this.card3 = new Card(this, row3, cardHeight, "cards", cardTypes[randomNumber][1], cardTypes[randomNumber][2], cardTypes[randomNumber][3], cardTypes[randomNumber][4],randomNumber).setInteractive();
        this.card3.row = row3;
        this.card3.visible = true;

        // Card Selection
        this.card1.on("pointerdown", () => {
            if(yourTurn) {
                yourTurn = false;
                enemyTurn = true;
                this.burnFX(this.slime, this.card1);
                this.bleed(this.player, this.card1.bleed);
                this.addStrength(this.player, this.card1, 1);
                this.checkCard(this.card1, 1);
                this.slime.hp -= this.card1.use();
                this.sound.play("hurt");
            }
        });
        this.card2.on("pointerdown", () => {
            if(yourTurn) {
                yourTurn = false;
                enemyTurn = true;
                this.burnFX(this.slime, this.card2);
                this.bleed(this.player, this.card2.bleed);
                this.addStrength(this.player, this.card2, 2);
                this.checkCard(this.card2, 2);
                this.slime.hp -= this.card2.use();
                this.sound.play("hurt");
            }
        });
        this.card3.on("pointerdown", () => {
            if(yourTurn) {
                yourTurn = false;
                enemyTurn = true;
                this.burnFX(this.slime, this.card3);
                this.bleed(this.player, this.card3.bleed);
                this.addStrength(this.player, this.card3, 3);
                this.checkCard(this.card3, 3);
                this.slime.hp -= this.card3.use();
                this.sound.play("hurt");
            }
        });

        this.reduced = false; // rot mist card used?
    }
    
    // Player Turn
    PlayerTurn() {

    }

    // Enemy Turn
    EnemyTurn() {
        enemyTurn = false;
        this.time.delayedCall(1000, () => {
            this.bleed(this.slime, 0);
            this.player.hp -= this.slime.attack;
            yourTurn = true;
        }, null, this);
    }

    update() {
        // update the player text
        if (this.player.hpBar.txt != this.player.hp && !(this.player.hpBar.gone)) {
            this.player.hpBar.text = this.player.hp;
            if (this.player.hp <= 0) {
                this.player.destroy();
                this.player.strengthBar.destroy();
                this.player.hpBar.gone = true;
                this.time.delayedCall(500, () => {
                    this.player.hpBar.destroy();
                }, null, this);
                this.scene.start("gameOver");
            }
        }
        // update the enemy text
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

                // add the player to next level scene
                playerHealth = this.player.hp;
                playerStrength = this.player.strength;
                this.scene.start("CardSelect");
            }
        }

        if(enemyTurn) {
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

    bleed(self, amount) {

        self.bleed += amount;

        if (self.bleed > 0) {

            let bleedDrop = this.add.sprite(self.x + 25, self.y + 25, "bleed").setOrigin(0,0);
            bleedDrop.setScale(0.2);

            // play anim before tween
            bleedDrop.anims.play("bleeding");
            
            let bleedTween = this.tweens.add({
                targets: bleedDrop,
                alpha: { from: 1, to: 0 },
                scale: { from: 0.2, to: 0.3 },
                y: {from: self.y + 25, to: self.y + 100},
                ease: 'Expo',
            });
            
            bleedTween.setTimeScale(0.3);

            self.bleed -= 1;
            self.hp -= 1;
        }
    }

    addStrength (self, card, num) {
        if (card.strength > 0) {
            
            for (let i = 0; i <= 22; i++) {
                if (cardTypes[i][1] instanceof Array) {
                    cardTypes[i][1][1] += card.strength;
                } else {
                    cardTypes[i][1] += card.strength;
                }
            }

            for (let i = 1; i <= 3; i++) {
                // also update current cards
                if (i != num) {
                    eval("this.card" + i + ".damage += card.strength");
                }
            }

            self.strength += card.strength;
            self.strengthBar.text = 'Str: +' + self.strength.toString();
            
            if (self.strength > 0) {
                self.strengthBar.alpha = 1;
            } else {
                self.strengthBar.alpha = 0;
            }
        }
    }

    checkCard(card, num) {

        if (card.frame.name == 3) {
            // heal ("Field Gauze")
            this.player.hp += 3;
            this.player.bleed = 0;
            this.player.strength = 0;
        }

        if (card.frame.name == 8) {
            // take half damage ("Strong Stance")
            this.slime.attack /= 2;
        } else {
            this.slime.attack = 10;
        }

        if (card.frame.name == 9) {
            // parry
            this.time.delayedCall(1500, () => {
                this.slime.hp -= this.slime.attack;
                this.sound.play("hurt");
            }, null, this);
        }

        if (card.frame.name == 14) {
            // use the 2 other cards
            for (let i = 1; i <= 3; i++) {
                if (i != num) {
                    eval("this.card" + i + ".use()");
                }
            }
        }
        
        if (card.frame.name == 18) {
            // point blank
            this.player.hp -= Math.floor(Phaser.Math.Between(0, 4));
        }

        if (card.frame.name == 19) {
            // rot myst
            
            this.slime.attack -= this.slime.attack * 0.25; // reduce next attack by 25%
            this.reduced = true;
            
            this.slime.bleed += Math.floor(Phaser.Math.Between(2, 5));

        } else if (this.reduced) {
            this.slime.attack += this.slime.attack * 0.25;
        }

        if (card.frame.name == 20) {
            // flesh wound
            this.player.hp += Math.floor(Phaser.Math.Between(1, 5));
        }

        if (card.frame.name == 21) {
            // fatal blow
            this.slime.hp -= this.slime.hp * 0.30;
        }
    }
}