class Drawer{
    constructor(canvas) {
        this.setCanvas(canvas).clear();
    }
    setCanvas(canvas) {
        this.canvas = canvas;
        return this;
    }
    clear() {
        //dont want to overwrite cards
        //this.canvas.fill('black');
        return this;
    }
    circle(x, y, r, color, fill) {
        if (fill === undefined) {
            fill = true;
        }
        var ctx = this.canvas.context;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        this.canvas.needRedraw();
        return this;
    }
}
class CardSelect extends Phaser.Scene {
    constructor() {
        super("CardSelect");
    }


    preload() {
        //plugins for draw
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.plugin('rexrestorabledataplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexrestorabledataplugin.min.js', true);
        this.load.plugin('rexlzstringplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexlzstringplugin.min.js', true);
        
        // load assets here
        this.load.spritesheet("slime", "./assets/slime.png", {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet("Knight", "./assets/Knight.png", {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 1});
        this.load.spritesheet("BG", "./assets/Background.png", {frameWidth: 1600, frameHeight: 800, startFrame: 0, endFrame: 7});
        this.load.spritesheet("cards", "./assets/cards.png", {frameWidth: 96, frameHeight: 144, startFrame: 0, endFrame: 22});
        this.load.spritesheet("fire", "./assets/FireSpirit.png", {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 3});
        this.load.spritesheet("shade", "./assets/shade.png", {frameWidth: 150, frameHeight: 150, startFrame: 0, endFrame: 8});
        this.load.spritesheet("sporeMan", "./assets/sporeMan.png", {frameWidth: 250, frameHeight: 250, startFrame: 0, endFrame: 10});

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
        var panel = CreatePanel(this)
            .setPosition(353, 200)
            .layout()
        //.drawBounds(this.add.graphics(), 0xff0000)

        var drawer = new Drawer(panel.getElement('canvas'));
        var hue = 0;

        var restorableData = this.plugins.get('rexrestorabledataplugin').add(this);
        var lzstring = this.plugins.get('rexlzstringplugin').add();

        var saveCanvas = function () {
            var state = panel.getElement('canvas').getDataURL();
            // var size0 = state.length;
            state = lzstring.compress(state);
            // var size1 = state.length;
            // var p = (size0 - size1) / size0
            // console.log(`Save size ${Math.floor(p * 100)}%`);
            restorableData.set('canvas', state).commit();
        }
        var restoreCanvas = function () {
            var state = restorableData.get('canvas');
            state = lzstring.decompress(state);
            panel.getElement('canvas').loadFromURL(state);
        }

        panel
            .on('canvas.pan', function (pan, canvas, lastPointer) {
                drawer.circle(
                Math.floor(canvas.input.localX), // x
                Math.floor(canvas.input.localY), // y
                5, // r
                `hsl(${hue},50%,50%)` // color
            );

            hue = (hue + 3) % 360;
        })
        .on('canvas.panend', function () {
            saveCanvas();
        })
        .on('button.click', function (button, index, pointer, event) {
            switch (button.name) {
                case 'undo':
                    if (restorableData.version > 1) {
                        restorableData.version--;
                        restoreCanvas();
                    }
                    break;
                case 'redo':
                    if (restorableData.version < restorableData.lastVersion) {
                        restorableData.version++;
                        restoreCanvas();
                    }
                    break;
            }
        })
        // Store initial canvas
        saveCanvas();
        this.add.text(0, 380, 'Drag on canvas to draw dots')

        //hieght of each card
        let cardHeight = game.config.height /4;

        // card rows
        let row1, row2, row3;
        row1 = 2 * game.config.width / 6;
        row2 = 3 * game.config.width / 6;
        row3 = 4 * game.config.width / 6;
        
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
        this.cardpick1.anims.play("cardHolder");

        this.cardpick2 = this.add.sprite(row2+75, cardHeight, "cards").setInteractive();
        this.cardpick2.visible = true;
        this.cardpick2.setScale(2)
        this.cardpick2.setOrigin(0.0)
        this.cardpick2.setDepth(-1);

 

        // place card 1
        //this.card1 = new Card(this, row1, cardHeight, "cards", cardTypes[randomNumber][1], cardTypes[randomNumber][2], cardTypes[randomNumber][3], cardTypes[randomNumber][4], randomNumber).setInteractive();
        //this.card1.row = row1;
        //this.card1.visible = true;
        
        //randomNumber = Math.floor(Math.random() * 22);
        
        // place card2
        //this.card2 = new Card(this, row2, cardHeight, "cards", cardTypes[randomNumber][1], cardTypes[randomNumber][2], cardTypes[randomNumber][3], cardTypes[randomNumber][4],randomNumber).setInteractive();
        //this.card2.row = row2;
        //this.card2.visible = true;
        
        //randomNumber = Math.floor(Math.random() * 22);

        // Card Selection
        this.cardpick1.on("pointerdown", () => {
            console.log("clicked on card");
            this.cardpick2.destroy();


        });
        this.cardpick2.on("pointerdown", () => {
            console.log("clicked on card");

        });
    }   
    update() {}

}
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
var CreatePanel = function (scene) {
    // Top ui
    var panel = scene.rexUI.add.sizer({ orientation: 'x' });

    // Background of panel
    // Drawing canvas
    var canvas = scene.rexUI.add.canvas(0, 0, 2 * game.config.width / 6-75, game.config.height /4).setOrigin(0)
    // Buttons
    var buttons = scene.rexUI.add.buttons({
        width: 120,
        orientation: 'y',

        buttons: [
            CreateButton(scene, 'Undo', 'undo'),
            CreateButton(scene, 'Redo', 'redo')
        ],
        space: 5,
        eventEmitter: panel
    })

    // Assemble game objects
    panel
        .add(
            canvas, // child
            0, // proportion
            'center', // align
            { left: 20, top: 20, bottom: 20, right: 10 }, // padding
            false // expand
        )
        .add(
            buttons, // child
            0, // proportion
            'top', // align
            { top: 20, bottom: 20, right: 20 }, // padding
            true // expand
        )

    panel.addChildrenMap('canvas', canvas);

    // Button display when pointer-over/pointer-out
    panel
        .on('button.over', function (button) {
        })
        .on('button.out', function (button) {
        })

    // Catch pan events
    scene.rexUI.add.pan(canvas)
        .on('pan', function (pan, gameObject, lastPointer) {
            panel.emit('canvas.pan', pan, gameObject, lastPointer);
        })
        .on('panend', function (pan, gameObject, lastPointer) {
            panel.emit('canvas.panend', pan, gameObject, lastPointer);
        });

    return panel;
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