class Level2 extends Phaser.Scene {
    constructor() {
        super("Level2");
    }

    preload() {
        // load assets here
        this.load.spritesheet("slime", "./assets/slime.png", { frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1 });
        this.load.spritesheet("Knight", "./assets/Knight.png", { frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 1 });
        this.load.spritesheet("BG2", "./assets/Background2.png", { frameWidth: 1600, frameHeight: 800, startFrame: 0, endFrame: 7 });
        this.load.spritesheet("cards", "./assets/cards.png", { frameWidth: 96, frameHeight: 144, startFrame: 0, endFrame: 22 });
        this.load.spritesheet("fire", "./assets/FireSpirit.png", { frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 3 });
        this.load.spritesheet("shade", "./assets/shade.png", { frameWidth: 150, frameHeight: 150, startFrame: 0, endFrame: 8 });
        this.load.spritesheet("sporeMan", "./assets/sporeMan.png", { frameWidth: 250, frameHeight: 250, startFrame: 0, endFrame: 10 });
        this.load.spritesheet("bleed", "./assets/bleed.png", { frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 20 });
        this.load.spritesheet("beasts", "./assets/Beasts.png", { frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 2 });

        this.load.image("rat", "./assets/rat.png");
        //this.load.image("card", "./assets/card.png");
        this.load.image("shadow", "./assets/Shadow.png");
        this.load.image("amalgam", "./assets/amalgam.png");
        this.load.image("dog", "./assets/dog.png");
        this.load.image('newcard', "CardDraw/newcard.png"); // loads image from card draw scene

        //selected card:
        this.load.spritesheet("draw", "./assets/cards.png", { frameWidth: 96, frameHeight: 144, startFrame: 20, endFrame: 21 });


        // audio
        this.load.audio("hurt", "./assets/hurt.wav");
        this.load.audio("killed", "./assets/killed.wav");
        this.load.audio("shadeattack", "./assets/shadeattack.wav");
        this.load.audio("shadelevel", "./assets/shadelevel.wav");
    }

    create() {

        console.log("current level: ", game.config.currentLevel);


        //sword to go over enemy head and designate attacks 
        this.swords = this.add.sprite(game.config.width / 1.23, 2.5 * game.config.height / 8, "swords").setOrigin(0.0);
        this.swords.setScale(.1);
        this.swords.alpha = 1;

        //shield to go over enemy head and designate attacks 
        this.shield = this.add.sprite(game.config.width / 1.23, 2.5 * game.config.height / 8, "shield").setOrigin(0.0);
        this.shield.setScale(.1);
        this.shield.alpha = 0;

        // reset these
        yourTurn = true;
        enemyTurn = false;

        StartingDeck[StartingDeck.length] = copyCardTypes[game.config.cardChoice]; // add the drawn card
        if (StartingDeck[StartingDeck.length - 1][1] instanceof Array) {
            StartingDeck[StartingDeck.length - 1][1][1] += playerStrength;
        } else {
            StartingDeck[StartingDeck.length - 1][1] += playerStrength;
        }

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
        this.background = this.add.sprite(0, 0, "BG2").setOrigin(0);
        this.background.setDepth(-1);

        //add shade
        this.shade = this.add.sprite(game.config.width / 1.6, 1.65 * game.config.height / 4, "shade").setOrigin(0.0);
        this.shade.setScale(1.5);
        this.shade.attack = 15;
        //the type of attack the shade will do
        this.shade.attackType= Math.floor(Math.random() * 3);
        console.log(this.shade.attackType)

        //shade anim
        this.anims.create({
            key: "idleShade",
            frames: this.anims.generateFrameNumbers("shade", { start: 0, end: 8 }),
            frameRate: 8,
            repeat: -1
        });
        this.shade.setScale(2);
        this.shade.anims.play("idleShade");

        // place Player
        this.player = this.add.sprite(game.config.width / 10, 2.5 * game.config.height / 4, "Knight").setOrigin(0.0);
        this.shadow = this.add.sprite((game.config.width / 10), (2.5 * game.config.height / 4), "shadow").setOrigin(0.0);
        this.shadow.setDepth(-1);

        // Player anim
        this.anims.create({
            key: "idle1",
            frames: this.anims.generateFrameNumbers("Knight", { start: 0, end: 1 }),
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
            frames: this.anims.generateFrameNumbers("bleed", { start: 0, end: 20 }),
            frameRate: 20
        })

        // Fire anim
        this.anims.create({
            key: "fire",
            frames: this.anims.generateFrameNumbers("fire", { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        // Beast anim
        this.anims.create({
            key: "beast0",
            frames: this.anims.generateFrameNumbers("beasts", { start: 0, end: 0 }),
            frameRate: 0,
            repeat: -1
        });
        // Beast anim
        this.anims.create({
            key: "beast1",
            frames: this.anims.generateFrameNumbers("beasts", { start: 1, end: 1 }),
            frameRate: 0,
            repeat: -1
        });
        // Beast anim
        this.anims.create({
            key: "beast2",
            frames: this.anims.generateFrameNumbers("beasts", { start: 2, end: 2 }),
            frameRate: 0,
            repeat: -1
        });

        // shade hp
        this.shade.hp = 45;
        this.shade.bleed = 0;
        this.EnemyHPbar = this.add.text(this.shade.x + 150, this.shade.y, this.shade.hp, hpConfig).setOrigin(0, 0);
        this.EnemyHPbar.gone = false;

        //the type of attack the shade will do
        this.shade.attackType = Math.floor(Math.random() * 3);
        console.log(this.shade.attackType)

        // Player hp
        this.player.hp = playerHealth + 15;
        this.player.hpBar = this.add.text(this.player.x + 10, this.player.y - 55, this.player.hp, hpConfig).setOrigin(0.0);
        this.player.hpBar.gone = false;
        this.player.strength = playerStrength;
        this.player.bleed = 0;
        this.player.strengthBar = this.add.text(this.player.x + 65, this.player.y + 10, "Str: +" + this.player.strength.toString(), strengthConfig).setOrigin(0, 0);
        if (this.player.strength == 0) {
            this.player.strengthBar.alpha = 0;
        }

        // Background anim
        this.anims.create({
            key: "bganimate2",
            frames: this.anims.generateFrameNumbers("BG2", { start: 0, end: 5 }),
            frameRate: 2,
            repeat: -1
        });
        this.background.setScale(.5);
        this.background.anims.play("bganimate2");
        this.background.setDepth(-1);

        let cardHeight = game.config.height / 4;

        // card rows
        let row1, row2, row3;
        row1 = 2 * game.config.width / 6;
        row2 = 3 * game.config.width / 6;
        row3 = 4 * game.config.width / 6;
        
        let texture;

        let randomNumber = Math.floor(Math.random() * (StartingDeck.length - 1));
        texture = checkTexture(randomNumber);

        // place card 1
        this.card1 = new Card(this, row1, cardHeight, texture, StartingDeck[randomNumber][1], StartingDeck[randomNumber][2], StartingDeck[randomNumber][3], StartingDeck[randomNumber][4], randomNumber).setInteractive(this.input.makePixelPerfect());
        this.card1.row = row1;
        this.card1.visible = true;

        randomNumber = Math.floor(Math.random() * (StartingDeck.length - 1));
        randomNumber = StartingDeck.length - 1;
        texture = checkTexture(randomNumber);
        // console.log(texture);
        // place card2
        this.card2 = new Card(this, row2, cardHeight, texture, StartingDeck[randomNumber][1], StartingDeck[randomNumber][2], StartingDeck[randomNumber][3], StartingDeck[randomNumber][4], randomNumber).setInteractive(this.input.makePixelPerfect());
        this.card2.row = row2;
        this.card2.visible = true;

        randomNumber = Math.floor(Math.random() * (StartingDeck.length - 1));
        texture = checkTexture(randomNumber);
        // place card3
        this.card3 = new Card(this, row3, cardHeight, texture, StartingDeck[randomNumber][1], StartingDeck[randomNumber][2], StartingDeck[randomNumber][3], StartingDeck[randomNumber][4], randomNumber).setInteractive(this.input.makePixelPerfect());
        this.card3.row = row3;
        this.card3.visible = true;

        // Card Selection
        this.card1.on("pointerdown", () => {
            console.log("clicked on card");
            if (yourTurn) {
                yourTurn = false;
                this.burnFX(this.shade, this.card1);
                this.bleed(this.player, this.card1.bleed);
                this.addStrength(this.player, this.card1, 1);
                this.checkCard(this.card1, 1);
                this.attackAnim(this.card1);
            }
        });
        this.card2.on("pointerdown", () => {
            console.log("clicked on card");
            if (yourTurn) {
                yourTurn = false;
                this.burnFX(this.shade, this.card2);
                this.bleed(this.player, this.card2.bleed);
                this.addStrength(this.player, this.card2, 2);
                this.checkCard(this.card2, 2);
                this.attackAnim(this.card2);
            }
        });
        this.card3.on("pointerdown", () => {
            if (yourTurn) {
                yourTurn = false;
                this.burnFX(this.shade, this.card3);
                this.bleed(this.player, this.card3.bleed);
                this.addStrength(this.player, this.card3, 3);
                this.checkCard(this.card3, 3);
                this.attackAnim(this.card3);
            }
        });

        this.reduced = false; // rot mist card used?

        this.background = this.sound.add('shadelevel', { loop: true, volume: 0.3 });
        this.background.play();
    }

    // Player Turn
    PlayerTurn() {

    }

    // Enemy Turn
    EnemyTurn() {
        enemyTurn = false;
        this.swords.alpha = 1;
        this.shield.alpha = 0;
        this.bleed(this.shade, 0);
        this.time.delayedCall(1200, () => {
            let enemyTween = this.tweens.add({
                targets: this.shade,
                alpha: { from: 1, to: 1 },
                x: { from: this.shade.x, to: this.shade.x - 300 },
                ease: 'Expo.easeInOut',
                yoyo: true,
                repeat: 0,
                hold: 500,
                duration: 1000,
                onComplete: function () {
                    this.player.hp -= this.shade.attack;
                    yourTurn = true;
                },
                onCompleteScope: this
            });
            this.time.delayedCall((1000 / 3), () => {
                this.sound.play("shadeattack");
                let shake = this.tweens.add({
                    targets: this.player,
                    x: { from: this.player.x - 5, to: this.player.x },
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
    EnemyTurnBlock() {
        enemyTurn = false;
        this.swords.alpha = 0;
        this.shield.alpha = 1;
        this.bleed(this.shade, 0);
        this.time.delayedCall(1200, () => {
            let enemyTween = this.tweens.add({
                targets: this.shade,
                alpha: { from: 1, to: 1 },
                y: { from: this.shade.y, to: this.shade.y - 100 },
                ease: 'Expo.easeInOut',
                yoyo: true,
                repeat: 0,
                hold: 500,
                duration: 1000,
                onComplete: function () {
                    this.shade.hp += 6;
                    yourTurn = true;
                },
                onCompleteScope: this
            });
            this.time.delayedCall((1000 / 3), () => {
                this.sound.play("shadeattack");
                let shake = this.tweens.add({
                    targets: this.player,
                    x: { from: this.player.x - 5, to: this.player.x },
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
    EnemyTurnBlock() {
        enemyTurn = false;
        this.swords.alpha = 0;
        this.shield.alpha = 1;
        this.bleed(this.shade, 0);
        this.time.delayedCall(1200, () => {
            let enemyTween = this.tweens.add({
                targets: this.shade,
                alpha: {from: 1, to: 1},
                y: {from: this.shade.y, to: this.shade.y - 100},
                ease: 'Expo.easeInOut',
                yoyo: true,
                repeat: 0,
                hold: 500,
                duration: 1000,
                onComplete: function() {
                    this.shade.hp+=6;
                    yourTurn = true;
                },
                onCompleteScope: this
            });
            this.time.delayedCall((1000 / 3), () => {
                this.sound.play("shadeattack");
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
                this.background.stop();
                this.scene.start("gameOver2");
            }
        }
        // update the enemy text
        if (this.EnemyHPbar.txt != this.shade.hp && !(this.EnemyHPbar.gone)) {
            this.EnemyHPbar.text = this.shade.hp;
            if (this.shade.hp <= 0) {
                // kill the enemy
                this.sound.play("killed");
                this.shade.destroy();
                this.EnemyHPbar.gone = true;
                this.time.delayedCall(500, () => {
                    this.EnemyHPbar.destroy();
                }, null, this);

                // add the player to next level scene
                playerHealth = this.player.hp;
                playerStrength = this.player.strength;
                game.config.currentLevel = 3;
                this.background.stop();
                this.scene.start("gameOver3");
            }
        }
        if(enemyTurn) {
            //let attack 2/3rds of time and block 1/3rd
            //console.log(this.shade.attackType);
            if (this.shade.attackType == 0 || this.shade.attackType == 1) {
                this.EnemyTurn();
            }
            if (this.shade.attackType == 2){
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
                    x: enemy.x + 150,
                    y: enemy.y + 150,
                    moveToX: { min: enemy.x + 70, max: enemy.x + 250 },
                    moveToY: { min: enemy.y + 50, max: enemy.y + 200 },
                    alpha: 0.4,
                    scale: 0.6,
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

            let bleedDrop = this.add.sprite(self.x + 25, self.y + 25, "bleed").setOrigin(0, 0);
            bleedDrop.setScale(0.2);

            // play anim before tween
            bleedDrop.anims.play("bleeding");

            let bleedTween = this.tweens.add({
                targets: bleedDrop,
                alpha: { from: 1, to: 0 },
                scale: { from: 0.2, to: 0.3 },
                y: { from: self.y + 25, to: self.y + 100 },
                ease: 'Expo',
            });

            bleedTween.setTimeScale(0.3);

            self.bleed -= 1;
            self.hp -= 1;
        }
    }

    addStrength(self, card, num) {
        if (card.strength > 0) {

            for (let i = 0; i <= (StartingDeck.length - 1); i++) {
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
            this.shade.attack /= 2;
        } else {
            this.shade.attack = 10;
        }

        if (card.frame.name == 9) {
            // parry
            this.time.delayedCall(2500, () => {
                this.shade.hp -= this.shade.attack;
                this.sound.play("hurt");
            }, null, this);
        }

        if (card.frame.name == 11) {
            // Fuzzy Friend
            this.time.delayedCall(1500, () => {
                // place Random Beast
                this.beast = this.add.sprite(this.player.x + 60, this.player.y + 80, "beasts").setOrigin(0.0);
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

            this.shade.attack -= this.shade.attack * 0.25; // reduce next attack by 25%
            this.reduced = true;

            this.shade.bleed += Math.floor(Phaser.Math.Between(2, 5));

        } else if (this.reduced) {
            this.shade.attack += this.shade.attack * 0.25;
        }

        if (card.frame.name == 20) {
            // flesh wound
            this.player.hp += Math.floor(Phaser.Math.Between(1, 5));
        }

        if (card.frame.name == 21) {
            // fatal blow
            this.shade.hp -= this.shade.hp * 0.30;
        }
    }

    attackAnim(card) {

        let attackTween = this.tweens.add({
            targets: this.player,
            alpha: { from: 1, to: 1 },
            x: { from: this.player.x, to: this.player.x + 300 },
            ease: 'Expo.easeInOut',
            yoyo: true,
            repeat: 0,
            hold: 400,
            duration: 1000,
            onComplete: function () {
                this.shade.hp -= card.use();
                enemyTurn = true;
                //what attack enemy will use
                this.shade.attackType = Math.floor(Math.random() * 3);
                //console.log(this.shade.attackType);
                this.shade.attackType = Math.floor(Math.random() * 3);
                //console.log(this.shade.attackType);
                if (this.shade.attackType == 0 || this.shade.attackType == 1) {
                    this.shield.alpha = 0;
                    this.swords.alpha = 1;
                }
                if (this.shade.attackType == 2) {
                    this.shield.alpha = 0;
                    this.swords.alpha = 1;
                }
            },
            onCompleteScope: this
        });
        attackTween.setTimeScale(2.5);

        this.time.delayedCall((1000 / 2.5), () => {

            // shake card
            let Cardshake = this.tweens.add({
                targets: card,
                x: { from: card.x + 10, to: card.x, end: card.x },
                ease: 'Expo.easeInOut',
                repeat: 5,
            });
            Cardshake.setTimeScale(20);

            // use on shade
            this.sound.play("hurt");
            let shake = this.tweens.add({
                targets: this.shade,
                x: { from: this.shade.x + 5, to: this.shade.x },
                ease: 'Expo.easeInOut',
                yoyo: true,
                repeat: 3
            });
            shake.setTimeScale(20);

        }, null, this);
        // Beast damage
        if(this.summonedBeast == true) {
            let beastTween = this.tweens.add({
                targets: this.beast,
                alpha: {from: 1, to: 1},
                x: {from: this.beast.x, to: this.beast.x + 300},
                ease: 'Expo.easeInOut',
                yoyo: true,
                repeat: 0,
                hold: 400,
                duration: 1000,
                onComplete: function() {
    
                    this.slime.hp -= 5;
                },
                onCompleteScope: this
            });
            beastTween.setTimeScale(2.5);
        }
    }
}