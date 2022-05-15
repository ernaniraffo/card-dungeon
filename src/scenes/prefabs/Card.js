class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, damage, burn, bleed, strength, frame) {
        super(scene, x, y, texture, frame);

        // add to scene
        scene.add.existing(this);
        
        // stats
        this.damage = damage;
        this.burn = burn;
        this.bleed = bleed;
        this.strength = strength;

        this.visible = false;
        this.row = 0;

        // Card Frames
        for(let i = 0; i <= 14; i++) {
            this.anims.create({
                key: i,
                frames: this.anims.generateFrameNumbers(texture, {start: i, end: i}),
                frameRate: 1,
                repeat: -1
            });
        }

        this.on("pointerover", () => {
            this.setScale(1.5);
            this.y += 50;
            this.setDepth(2);
        });

        this.on("pointerout", () => {
            this.setScale(1);
            this.y -= 50;
            this.setDepth(1);
        });
    }

    update() {
        if (this.visible) {
            this.alpha = 1;
            this.card = this.add.sprite(this.row, game.config.height /4, texture, {start: frame, end:frame});
        } else {
            this.row = 0;
            this.visible = false;
            this.alpha = 0;
        }

    }

    use () {
        let oldDamage = this.damage;
        // New Card
        let randomNumber = Math.floor(Math.random() * 14);
        this.play(randomNumber.toString());
        this.damage = cardTypes[randomNumber][1];
        this.burn = cardTypes[randomNumber][2];
        this.bleed = cardTypes[randomNumber][3];
        this.strength = cardTypes[randomNumber][4];

        return oldDamage;
    }

}