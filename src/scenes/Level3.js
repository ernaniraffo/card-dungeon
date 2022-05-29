class Level3 extends Phaser.Scene {
    constructor() {
        super("Level3");
    }

    preload() {
        // load assets here
        this.load.spritesheet("slime", "./assets/slime.png", {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet("Knight", "./assets/Knight.png", {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 1});
        this.load.spritesheet("BG2", "./assets/Background2.png", {frameWidth: 1600, frameHeight: 800, startFrame: 0, endFrame: 7});
        this.load.spritesheet("cards", "./assets/cards.png", {frameWidth: 96, frameHeight: 144, startFrame: 0, endFrame: 22});
        this.load.spritesheet("fire", "./assets/FireSpirit.png", {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 3});
        this.load.spritesheet("shade", "./assets/shade.png", {frameWidth: 150, frameHeight: 150, startFrame: 0, endFrame: 8});
        this.load.spritesheet("sporeMan", "./assets/sporeMan.png", {frameWidth: 250, frameHeight: 250, startFrame: 0, endFrame: 10});
        this.load.spritesheet("bleed", "./assets/bleed.png", {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 20});
        this.load.spritesheet("beasts", "./assets/Beasts.png", {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 2});


        this.load.image("rat", "./assets/rat.png");
        this.load.image("card", "./assets/card.png");
        this.load.image("shadow", "./assets/Shadow.png");
        this.load.image("amalgam", "./assets/amalgam.png");
        this.load.image("dog", "./assets/dog.png");

        // audio
        this.load.audio("hurt", "./assets/hurt.wav");
        this.load.audio("killed", "./assets/killed.wav");
        this.load.audio("sporemanattack", "./assets/sporemanattack.wav");
    }

    create() {
        //sword to go over enemy head and designate attacks 
        this.swords = this.add.sprite(game.config.width / 1.24, 2.5 *game.config.height / 11, "swords").setOrigin(0.0);
        this.swords.setScale(.1);
        this.swords.alpha=1;

        //shield to go over enemy head and designate attacks 
        this.shield = this.add.sprite(game.config.width / 1.24, 2.5 *game.config.height / 11, "shield").setOrigin(0.0);
        this.shield.setScale(.1);
        this.shield.alpha=0;
        
        // reset these
        yourTurn = true;
        enemyTurn = false;

        // hp config
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

        // strength config
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

        // Background
        this.background = this.add.sprite(0,0, "BG2").setOrigin(0);
        this.background.setDepth(-1);

        //add sporeMan
        this.sporeMan = this.add.sprite(game.config.width / 1.6, 1.65 * game.config.height / 5, "sporeMan").setOrigin(0.0);
        this.sporeMan.setScale(1);

        //sporeMan anim
        // spore anim break this up into the attack and idle anims once coded!!!
        this.anims.create({
            key: "idleSpore",
            frames: this.anims.generateFrameNumbers("sporeMan", {start: 0, end: 10}),
            frameRate: 8,
            repeat: -1
        });
        this.sporeMan.anims.play("idleSpore");

        this.anims.create({
            key: "attackSpore",
            frames: this.anims.generateFrameNumbers("sporeMan", {start: 0, end: 10}),
            frameRate: 8,
            repeat: -1
        });

        // place Player
        this.player = this.add.sprite(game.config.width / 10, 2.5 * game.config.height / 4, "Knight").setOrigin(0.0);
        this.shadow = this.add.sprite((game.config.width / 10), (2.5 * game.config.height/4) , "shadow").setOrigin(0.0);
        this.shadow.setDepth(-1);

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

        // sporeMan hp
        this.sporeMan.hp = 45;
        this.sporeMan.bleed = 0;
        this.EnemyHPbar = this.add.text(this.sporeMan.x + 150, this.sporeMan.y, this.sporeMan.hp, hpConfig).setOrigin(0.0);
        this.EnemyHPbar.gone = false;

        // Player hp
        this.player.hp = playerHealth;
        this.player.hpBar = this.add.text(this.player.x + 10, this.player.y - 55, this.player.hp, hpConfig).setOrigin(0.0);
        this.player.hpBar.gone = false;
        this.player.strength = playerStrength;
        this.player.strengthBar = this.add.text(this.player.x + 65, this.player.y + 10, "Str: +" + this.player.strength.toString(), strengthConfig).setOrigin(0,0);
        if (this.player.strength == 0) {
            this.player.strengthBar.alpha = 0;
        }

        // Background anim
        this.anims.create({
            key: "bganimate2",
            frames: this.anims.generateFrameNumbers("BG2", {start: 0, end: 5}),
            frameRate: 2,
            repeat: -1
        });
        this.background.setScale(.5);
        this.background.anims.play("bganimate2");
        this.background.setDepth(-1);

        let cardHeight = game.config.height /4;

        // card rows
        let row1, row2, row3;
        row1 = 2 * game.config.width / 6;
        row2 = 3 * game.config.width / 6;
        row3 = 4 * game.config.width / 6;
        
        let randomNumber = Math.floor(Math.random() * 22);

        // place card 1
        this.card1 = new Card(this, row1, cardHeight, "cards", cardTypes[randomNumber][1], cardTypes[randomNumber][2], cardTypes[randomNumber][3], cardTypes[randomNumber][4], randomNumber).setInteractive();
        this.card1.row = row1;
        this.card1.visible = true;
        
        randomNumber = Math.floor(Math.random() * 22);
        
        // place card2
        this.card2 = new Card(this, row2, cardHeight, "cards", cardTypes[randomNumber][1], cardTypes[randomNumber][2], cardTypes[randomNumber][3], cardTypes[randomNumber][4],randomNumber).setInteractive();
        this.card2.row = row2;
        this.card2.visible = true;
        
        randomNumber = Math.floor(Math.random() * 22);

        // place card3
        this.card3 = new Card(this, row3, cardHeight, "cards", cardTypes[randomNumber][1], cardTypes[randomNumber][2], cardTypes[randomNumber][3], cardTypes[randomNumber][4],randomNumber).setInteractive();
        this.card3.row = row3;
        this.card3.visible = true;

        // Card Selection
        this.card1.on("pointerdown", () => {
            console.log("clicked on card");
            if(yourTurn) {
                yourTurn = false;
                this.burnFX(this.sporeMan, this.card1);
                this.bleed(this.player, this.card1.bleed);
                this.addStrength(this.player, this.card1, 1);
                this.checkCard(this.card1, 1);
                this.attackAnim(this.card1);
            }
        });
        this.card2.on("pointerdown", () => {
            console.log("clicked on card");
            if(yourTurn) {
                yourTurn = false;
                this.burnFX(this.sporeMan, this.card2);
                this.bleed(this.player, this.card2.bleed);
                this.addStrength(this.player, this.card2, 2);
                this.checkCard(this.card2, 2);
                this.attackAnim(this.card2);
            }
        });
        this.card3.on("pointerdown", () => {
            if(yourTurn) {
                yourTurn = false;
                this.burnFX(this.sporeMan, this.card3);
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
        this.bleed(this.sporeMan, 0);
        this.time.delayedCall(1200, () => {
            let enemyTween = this.tweens.add({
                targets: this.sporeMan,
                alpha: {from: 1, to: 1},
                x: {from: this.sporeMan.x, to: this.sporeMan.x - 300},
                ease: 'Expo.easeInOut',
                yoyo: true,
                repeat: 0,
                hold: 500,
                duration: 1000,
                onComplete: function() {
                    this.player.hp -= this.sporeMan.attack;
                    yourTurn = true;
                },
                onCompleteScope: this
            });
            this.time.delayedCall((1000 / 3), () => {
                this.sound.play("sporemanattack");
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
                this.scene.start("gameOver");
            }
        }
        // update the enemy text
        if (this.EnemyHPbar.txt != this.sporeMan.hp && !(this.EnemyHPbar.gone)) {
            this.EnemyHPbar.text = this.sporeMan.hp;
            if (this.sporeMan.hp <= 0) {
                // kill the enemy
                this.sound.play("killed");
                this.sporeMan.destroy();
                this.EnemyHPbar.gone = true;
                this.time.delayedCall(500, () => {
                    this.EnemyHPbar.destroy();
                }, null, this);
                
                // add the player to next level scene
                playerHealth = this.player.hp;
                playerStrength = this.player.strength;
                this.scene.start("Level3");
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
        }

        if (card.frame.name == 8) {
            // take half damage ("Strong Stance")
            this.sporeMan.attack /= 2;
        } else {
            this.sporeMan.attack = 10;
        }

        if (card.frame.name == 9) {
            // parry
            this.time.delayedCall(2500, () => {
                this.sporeMan.hp -= this.sporeMan.attack;
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
            this.sporeMan.attack -= Math.floor(this.sporeMan.attack * 0.25); // reduce next attack by 25%
            this.reduced = true;

            this.sporeMan.bleed += Math.floor(Phaser.Math.Between(2, 5));

        } else if (this.reduced) {
            this.sporeMan.attack += Math.floor(this.sporeMan.attack * 0.25);
        }

        if (card.frame.name == 20) {
            // flesh wound
            this.player.hp += Math.floor(Phaser.Math.Between(1, 5));
        }

        if (card.frame.name == 21) {
            // fatal blow
            this.sporeMan.hp -= Math.floor(this.sporeMan.hp * 0.30);
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
                this.sporeMan.hp -= card.use();
                enemyTurn = true;
            },
            onCompleteScope: this
        });
        attackTween.setTimeScale(2.5);

        this.time.delayedCall((1000 / 2.5), () => {

            // shake card
            let Cardshake = this.tweens.add({
                targets: card,
                x: {from: card.x + 5, to: card.x, end: card.x},
                ease: 'Expo.easeInOut',
                repeat: 5,
            });
            Cardshake.setTimeScale(20);

            // use on sporeMan
            this.sound.play("hurt");    
            let shake = this.tweens.add({
                targets: this.sporeMan,
                x: {from: this.sporeMan.x + 5, to: this.sporeMan.x},
                ease: 'Expo.easeInOut',
                yoyo: true,
                repeat: 3
            });
            shake.setTimeScale(20);
            
        }, null, this);
    }
}