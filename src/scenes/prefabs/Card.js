class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, damage, burn, bleed, strength, frame) {
        super(scene, x, y, texture, frame);

        // add to scene
        scene.add.existing(this);
        
        // stats
        
        if (damage.constructor == Array) {
            // random value
            this.damage = Phaser.Math.Between(damage[0], damage[1]);
        } else {
            this.damage = damage;
        }

        this.burn = burn;
        this.bleed = bleed;
        this.strength = strength;

        this.visible = false;
        this.row = 0;

        this.scaling = 1;

        // Card Frames
        if (texture == 'newcard') {
            this.scaling = 0.4;
            this.frame.name = game.config.cardChoice;
            this.setScale(this.scaling);
        } else if (texture == 'newcard2') {
            this.scaling = 0.4;
            this.frame.name = game.config.cardChoice2;
            this.setScale(this.scaling);
        }

        this.on("pointerover", () => {
            //console.log(this.scaling);
            this.setScale(this.scaling + (this.scaling / 2));
            this.y += 50;
            this.setDepth(2);
        });

        this.on("pointerout", () => {
            //console.log(this.scaling);
            this.setScale(this.scaling);
            this.y -= 50;
            this.setDepth(1);
        });
    }

    update() {
        if (this.visible) {
            this.alpha = 1;
            // this.card = this.add.sprite(this.row, game.config.height /4, texture, {start: frame, end:frame});
        } else {
            this.row = 0;
            this.visible = false;
            this.alpha = 0;
        }

    }

    use () {
        let oldDamage = this.damage;
        // console.log("Old card's damage: ", oldDamage);

        // New Card
        let randomNumber = Math.floor(Math.random() * (StartingDeck.length));

        console.log("Card.js: card frame: ", randomNumber);
        console.log("Card.js: current level: ", game.config.currentLevel);
        console.log("Card.js: texture: ", checkTexture(randomNumber));

        if (checkTexture(randomNumber) == "newcard") {
            console.log("card choice: ", game.config.cardChoice);
            console.log("playing new card");
            this.setTexture("newcard");
            this.scaling = 0.4;
            this.frame.name = game.config.cardChoice;
        } else if (checkTexture(randomNumber) == "newcard2") {
            console.log("card choice 2: ", game.config.cardChoice2);
            console.log("playing newcard2");
            this.setTexture("newcard2");
            this.scaling = 0.4;
            this.frame.name = game.config.cardChoice;
        } else {
            this.scaling = 1;
            this.setTexture("cards", randomNumber);
        }

        this.setScale(this.scaling);
        
        this.damage = StartingDeck[randomNumber][1];
        if (this.damage.constructor == Array) {
            // random value
            this.damage = Phaser.Math.Between(this.damage[0], this.damage[1]);
        }
        // console.log("New card's damage: ", this.damage);

        this.burn = StartingDeck[randomNumber][2];
        this.bleed = StartingDeck[randomNumber][3];
        this.strength = StartingDeck[randomNumber][4];

        return oldDamage;
    }

}