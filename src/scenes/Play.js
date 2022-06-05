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
        this.load.spritesheet("beasts", "./assets/Beasts.png", {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 2});

        this.load.image("shield", "./assets/shield.png");
        this.load.image("swords", "./assets/swords.png");
        this.load.image("rat", "./assets/rat.png");
        this.load.image("rat2", "./assets/rat2.png");
        //this.load.image("card", "./assets/card.png");
        this.load.image("shadow", "./assets/Shadow.png");
        this.load.image("amalgam", "./assets/amalgam.png");
        this.load.image("dog", "./assets/dog.png");

        // audio
        this.load.audio("hurt", "./assets/hurt.wav");
        this.load.audio("killed", "./assets/killed.wav");
        this.load.audio("slimeattack", "./assets/slimeattack.wav");
        this.load.audio("burningFX", "./assets/burning.wav");
    }

    create() {
        // reset these if restart
        yourTurn = true;
        enemyTurn = false;

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

        //sword attack indicator
        this.swords = this.add.sprite(game.config.width / 1.25, 2.5 *game.config.height / 6.5, "swords").setOrigin(0.0);
        this.swords.setScale(.1);
        this.swords.alpha=1;

        //block attack indicator
        this.shield = this.add.sprite(game.config.width / 1.25, 2.5 *game.config.height / 6.5, "shield").setOrigin(0.0);
        this.shield.setScale(.1);
        this.shield.alpha=0;

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

        // Beast anim
        this.anims.create({
            key: "beast0",
            frames: this.anims.generateFrameNumbers("beasts", {start: 0, end: 0}),
            frameRate: 0,
            repeat: -1
        });
        // Beast anim
        this.anims.create({
            key: "beast1",
            frames: this.anims.generateFrameNumbers("beasts", {start: 1, end: 1}),
            frameRate: 0,
            repeat: -1
        });
        // Beast anim
        this.anims.create({
            key: "beast2",
            frames: this.anims.generateFrameNumbers("beasts", {start: 2, end: 2}),
            frameRate: 0,
            repeat: -1
        });

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
            key: "burning",
            frames: this.anims.generateFrameNumbers("fire", {start: 0, end: 3}),
            frameRate: 8,
            repeat: -1
        });

        // slime hp
        this.slime.hp = 20;
        this.slime.bleed = 0;
        this.EnemyHPbar = this.add.text(this.slime.x + 7, this.slime.y - 55, this.slime.hp, hpConfig).setOrigin(0.0);
        this.EnemyHPbar.gone = false;
        //the type of attack the slime will do
        this.slime.attackType= Math.floor(Math.random() * 3);
        console.log(this.slime.attackType)
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
        
        let randomNumber = Math.floor(Math.random() * (StartingDeck.length));

        // place card 1
        this.card1 = new Card(this, row1, cardHeight, "cards", StartingDeck[randomNumber][1], StartingDeck[randomNumber][2], StartingDeck[randomNumber][3], StartingDeck[randomNumber][4], randomNumber).setInteractive();
        this.card1.row = row1;
        this.card1.visible = true;
        
        randomNumber = Math.floor(Math.random() * (StartingDeck.length));
        // place card2
        this.card2 = new Card(this, row2, cardHeight, "cards", StartingDeck[randomNumber][1], StartingDeck[randomNumber][2], StartingDeck[randomNumber][3], StartingDeck[randomNumber][4],randomNumber).setInteractive();
        this.card2.row = row2;
        this.card2.visible = true;
        
        randomNumber = Math.floor(Math.random() * (StartingDeck.length));
        // place card3
        this.card3 = new Card(this, row3, cardHeight, "cards", StartingDeck[randomNumber][1], StartingDeck[randomNumber][2], StartingDeck[randomNumber][3], StartingDeck[randomNumber][4],randomNumber).setInteractive();
        this.card3.row = row3;
        this.card3.visible = true;

        // Card Selection
        this.card1.on("pointerdown", () => {
            if(yourTurn) {
                yourTurn = false;
                //enemyTurn = true;
                this.burnFX(this.slime, this.card1);
                this.bleed(this.player, this.card1.bleed);
                this.addStrength(this.player, this.card1, 1);
                this.checkCard(this.card1, 1);
                this.attackAnim(this.card1);
            }
        });
        this.card2.on("pointerdown", (card) => {
            if(yourTurn) {
                yourTurn = false;
                this.burnFX(this.slime, this.card2);
                this.bleed(this.player, this.card2.bleed);
                this.addStrength(this.player, this.card2, 2);
                this.checkCard(this.card2, 2);
                this.attackAnim(this.card2);
            }
        });
        this.card3.on("pointerdown", () => {
            if(yourTurn) {
                yourTurn = false;
                this.burnFX(this.slime, this.card3);
                this.bleed(this.player, this.card3.bleed);
                this.addStrength(this.player, this.card3, 3);
                this.checkCard(this.card3, 3);
                this.attackAnim(this.card3);
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
        this.swords.alpha = 1;
        this.shield.alpha = 0;
        this.bleed(this.slime, 0);
        this.time.delayedCall(1200, () => {
            let enemyTween = this.tweens.add({
                targets: this.slime,
                alpha: {from: 1, to: 1},
                x: {from: this.slime.x, to: this.slime.x - 300},
                ease: 'Expo.easeInOut',
                yoyo: true,
                repeat: 0,
                hold: 500,
                duration: 1000,
                onComplete: function() {
                    this.player.hp -= this.slime.attack;
                    yourTurn = true;
                },
                onCompleteScope: this
            });
            this.time.delayedCall((1000 / 3), () => {
                this.sound.play("slimeattack");
                let shake = this.tweens.add({
                    targets: this.player,
                    x: {from: this.player.x - 5, to: this.player.x},
                    ease: 'Expo.easeInOut',
                    yoyo: true,
                    repeat: 3
                });
                shake.setTimeScale(20);
            }, null, this);
            enemyTween.setTimeScale(2.5);
            // yourTurn = true;
        }, null, this);
    }

     // Enemy Turn
     EnemyTurnBlock() {
        enemyTurn = false;
        this.swords.alpha = 0;
        this.shield.alpha = 1;
        this.bleed(this.slime, 0);
        this.time.delayedCall(1200, () => {
            let enemyTween = this.tweens.add({
                targets: this.slime,
                alpha: {from: 1, to: 1},
                y: {from: this.slime.y, to: this.slime.y - 100},
                ease: 'Expo.easeInOut',
                yoyo: true,
                repeat: 0,
                hold: 500,
                duration: 1000,
                onComplete: function() {
                    this.slime.hp+=6;
                    yourTurn = true;
                },
                onCompleteScope: this
            });
            this.time.delayedCall((1000 / 3), () => {
                this.sound.play("slimeattack");
                let shake = this.tweens.add({
                    targets: this.player,
                    x: {from: this.player.x - 5, to: this.player.x},
                    ease: 'Expo.easeInOut',
                    yoyo: true,
                    repeat: 3
                });
                shake.setTimeScale(20);
            }, null, this);
            enemyTween.setTimeScale(2.5);
            // yourTurn = true;
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
                this.scene.start("gameOver2");
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
                game.config.currentLevel = 2;
                this.scene.start("gameOver");
            }
        }

        if(enemyTurn) {
            //let attack 2/3rds of time and block 1/3rd
            console.log(this.slime.attackType);
            if (this.slime.attackType == 0 || this.slime.attackType == 1) {
                this.EnemyTurn();
            }
            if (this.slime.attackType == 2){
                this.EnemyTurnBlock();
            }
            //this.EnemyTurnAttack();

        }

        this.shadow.x = this.player.x + 5;
        this.shadow.y = this.player.y + 25;
    }

    burnFX(enemy, card) {
        if (card.burn > 0) {
            this.burning = this.time.delayedCall(700, () => {
                let flames = this.add.particles("fire");
                let emitter = flames.createEmitter({
                    x: enemy.x + 25,
                    y: enemy.y + 25,
                    moveToX: { min: enemy.x - 25, max: enemy.x + 60},
                    moveToY: { min: enemy.y, max: enemy.y + 60},
                    alpha: 0.5,
                    scale: 0.2,
                    quantity: 1,
                    delay: 2
                });
                flames.setDepth(1); // change depth to go behind enemy
                
                this.time.delayedCall(25, () => {
                    emitter.stop();
                }, null, this);

                enemy.hp -= 1;
                this.sound.play("burningFX");
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
            
            for (let i = 0; i <= (StartingDeck.length-1); i++) {
                if (StartingDeck[i][1] instanceof Array) {
                    StartingDeck[i][1][1] += card.strength;
                } else {
                    StartingDeck[i][1] += card.strength;
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

        if (card.frame.name == 11) {
            // Fuzzy Friend
            this.time.delayedCall(1500, () => {
                // place Random Beast
                this.beast = this.add.sprite(this.player.x + 60,this.player.y + 80, "beasts").setOrigin(0.0);
                this.beast.setScale(.2);
                var randomFrame = Math.floor(Math.random() * 3);
                randomFrame = "beast" + randomFrame;
                this.beast.anims.play(randomFrame);
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
            this.slime.hp -= Math.floor(this.slime.hp * 0.30);
        }
    }

    attackAnim(card) {

        let attackTween = this.tweens.add({
            targets: this.player,
            alpha: {from: 1, to: 1},
            x: {from: this.player.x, to: this.player.x + 300},
            ease: 'Expo.easeInOut',
            yoyo: true,
            repeat: 0,
            hold: 400,
            duration: 1000,
            onComplete: function() {

                this.slime.hp -= card.use();
                enemyTurn = true;
                //what attack enemy will use
                this.slime.attackType= Math.floor(Math.random() * 3);
                console.log(this.slime.attackType);
                if (this.slime.attackType == 0 || this.slime.attackType == 1) {
                    this.shield.alpha=0;
                    this.swords.alpha=1;
                }
                if (this.slime.attackType == 2){
                    this.shield.alpha=0;
                    this.swords.alpha=1;                }
            },
            onCompleteScope: this
        });
        attackTween.setTimeScale(2.5);

        this.time.delayedCall((1000 / 2.5), () => {

            // shake card
            let Cardshake = this.tweens.add({
                targets: card,
                x: {from: card.x + 10, to: card.x, end: card.x},
                ease: 'Expo.easeInOut',
                repeat: 5,
            });
            Cardshake.setTimeScale(20);

            // use on slime
            this.sound.play("hurt");    
            let shake = this.tweens.add({
                targets: this.slime,
                x: {from: this.slime.x + 5, to: this.slime.x},
                ease: 'Expo.easeInOut',
                yoyo: true,
                repeat: 3
            });
            shake.setTimeScale(20);
            
        }, null, this);
    }
}