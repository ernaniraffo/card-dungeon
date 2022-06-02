class CardSelect extends Phaser.Scene {
    constructor() {
        super("CardSelect");
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
        this.load.image("doneButton", "./assets/doneButton.png");
        this.load.image("rat", "./assets/rat.png");
        this.load.image("shadow", "./assets/Shadow.png");
        this.load.image("amalgam", "./assets/amalgam.png");
        this.load.image("dog", "./assets/dog.png");

        // audio
        this.load.audio("hurt", "./assets/hurt.wav");
        this.load.audio("killed", "./assets/killed.wav");
    }

    create() {
        //allows a random card after the first 5 which are already drawn for both cards
        let randomNumberOne = Math.floor(Math.random() * (Math.floor(22) - Math.ceil(5)) + Math.ceil(5));
        let randomNumberTwo = Math.floor(Math.random() * (Math.floor(22) - Math.ceil(5)) + Math.ceil(5));
        //while true
        //if randomNumberOne == 
        for(let i = 0; i <= 22; i++) {
            this.anims.create({
                key: "cardHolderOne",
                frames: this.anims.generateFrameNumbers("cards", {start: randomNumberOne, end:randomNumberOne}),
                frameRate: 1,
                repeat: -1
            });
        }

        for(let i = 0; i <= 22; i++) {
            this.anims.create({
                key: "cardHolderTwo",
                frames: this.anims.generateFrameNumbers("cards", {start: randomNumberTwo, end:randomNumberTwo}),
                frameRate: 1,
                repeat: -1
            });
        }
  
        this.add.text(150, 20, 'select card you would like to add to deck')

        //hieght of each card
        let cardHeight = game.config.height /4;

        // card rows
        let row1, row2, row3;
        row1 = 2 * game.config.width / 6;
        row2 = 3 * game.config.width / 6;
        row3 = 4 * game.config.width / 6;
        //this.doneButton = this.add.sprite(2.3 * game.config.width / 6, cardHeight-50, "doneButton").setInteractive();

        //add a new card to deck
        // changed to sprite instead of card due to bugs
        //this.player = this.add.sprite(game.config.width / 10, 2.5 * game.config.height / 4, "Knight").setOrigin(0.0);
        this.cardpick1 = this.add.sprite(row1-75, cardHeight, "cards").setInteractive();
        //this.cardpick1 = new Card(this, row1, cardHeight, "cards", cardTypes[randomNumber][1], cardTypes[randomNumber][2], cardTypes[randomNumber][3], cardTypes[randomNumber][4], randomNumber).setInteractive();
        //this.cardpick1.row = row1;
        this.cardpick1.visible = true;
        this.cardpick1.setScale(2)
        this.cardpick1.setOrigin(0.0)
        this.cardpick1.setDepth(-1);
        this.cardpick1.anims.play("cardHolderOne");

        this.cardpick2 = this.add.sprite(row2+75, cardHeight, "cards").setInteractive();
        this.cardpick2.visible = true;
        this.cardpick2.setScale(2)
        this.cardpick2.setOrigin(0.0)
        this.cardpick2.setDepth(-1);
        this.cardpick2.anims.play("cardHolderTwo");

        this.cardpick1.on("pointerdown", () => {
            console.log("clicked on card one");
            this.cardpick2.destroy();
            game.config.cardChoice = randomNumberOne;
            this.scene.start("CardDraw");



        });
        this.cardpick2.on("pointerdown", () => {
            console.log("clicked on card two");
            game.config.cardChoice = randomNumberTwo;
            this.cardpick1.destroy();
            this.scene.start("CardDraw");


        });
    }   
    update() {}

}

var CreateButton = function (scene, text, name) {
    if (name === undefined) {
        name = text;
    }
    return scene.rexUI.add.label({
        text: scene.add.text(0, 0, text),
        align: 'center',
        space: {
            left: 10, right: 10, top: 10, bottom: 10
        },
        name: name
    })
}