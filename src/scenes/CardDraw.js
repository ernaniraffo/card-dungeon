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
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        this.canvas.needRedraw();
        return this;
    }
}
class CardDraw extends Phaser.Scene {
    constructor() {
        super("CardDraw");
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
        this.load.spritesheet("colors", "./assets/colors2.png", {frameWidth: 250, frameHeight: 250, startFrame: 0, endFrame: 6});

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
        //set to first color of different buttons to change color of brush
        //uses HSL color so create variables to represent hue saturation and lightness
        let brushHue =359;
        let brushSaturation = "34.3";
        let brushLightness = "40.0";
        for(let i = 0; i <= 6; i++) {
            this.anims.create({
                key: i.toString(),
                frames: this.anims.generateFrameNumbers("colors", {start: i, end:i}),
                frameRate: 1,
                repeat: -1
            });
        }
        this.redButton = this.add.sprite(700,50,"colors").setInteractive();
        this.redButton.anims.play("0"); 
        this.redButton.visible = true;
        this.redButton.setScale(0.2);
        this.redButton.setOrigin(0, 0);
        this.darkBlueButton = this.add.sprite(700,100,"colors").setInteractive();
        this.darkBlueButton.anims.play("1");
        this.darkBlueButton.visible = true;
        this.darkBlueButton.setScale(0.2);
        this.darkBlueButton.setOrigin(0, 0);
        this.greyButton = this.add.sprite(700,150,"colors").setInteractive();
        this.greyButton.anims.play("2");
        this.greyButton.visible = true;
        this.greyButton.setScale(0.2);
        this.greyButton.setOrigin(0, 0);
        //this.lightBlueButton = this.add.sprite(0,0,"colors").setInteractive();
        //this.lightBlueButton.anims.play("3");
        //this.lightBlueButton.visible = true;
        //this.lightBlueButton.setScale(0.2);
        // this.lightBlueButton.setOrigin(0, 0);
        this.yellowButton = this.add.sprite(700,200,"colors").setInteractive();
        this.yellowButton.anims.play("4");
        this.yellowButton.visible = true;
        this.yellowButton.setScale(0.2);
        this.yellowButton.setOrigin(0, 0);
        this.greenButton = this.add.sprite(700,250,"colors").setInteractive();
        this.greenButton.anims.play("5");
        this.greenButton.visible = true;
        this.greenButton.setScale(0.2);
        this.greenButton.setOrigin(0, 0);
        this.pinkButton = this.add.sprite(700,300,"colors").setInteractive();
        this.pinkButton.anims.play("6");
        this.pinkButton.visible = true;
        this.pinkButton.setScale(0.2);
        this.pinkButton.setOrigin(0, 0);

        //.on('pointerout', () => startButton.setStyle({ fill: '#FFF' }))
        // //allows a random card after the first 5 which are already drawn for both cards
        // let randomNumberOne = Math.floor(Math.random() * (Math.floor(22) - Math.ceil(5)) + Math.ceil(5));
        // let randomNumberTwo = Math.floor(Math.random() * (Math.floor(22) - Math.ceil(5)) + Math.ceil(5));
        //while true
        //if randomNumberOne == 
        // Card Frames
        for(let i = 0; i <= 22; i++) {
            this.anims.create({
                key: i.toString(),
                frames: this.anims.generateFrameNumbers("cards", {start: i, end: i, first: i}),
                frameRate: 1,
                repeat: -1
            });
        }

        var panel = CreatePanel(this)
            .setPosition(3.4 * game.config.width / 6+75, game.config.height / 2.8)
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
                1, // r
                `hsl(${brushHue},${brushSaturation}%,${brushLightness}%)` // color
            );
            drawer.circle(
                Math.floor(canvas.input.localX+1), // x
                Math.floor(canvas.input.localY+1), // y
                1, // r
                `hsl(${brushHue},${brushSaturation}%,${brushLightness}%)` // color
            );
            drawer.circle(
                Math.floor(canvas.input.localX-1), // x
                Math.floor(canvas.input.localY-1), // y
                1, // r
                `hsl(${brushHue},${brushSaturation}%,${brushLightness}%)` // color
            );
            //console.log(canvas.input.localX);
            //console.log(canvas.input.localY);

            //hue = (hue + 3) % 360;
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
        this.add.text(game.config.width / 6-100, 125, 'Drag slowly on canvas to draw')

        //hieght of each card
        let cardHeight = game.config.height /4;

        // card rows
        let row1, row2, row3;
        row1 = 2 * game.config.width / 6;
        row2 = 3 * game.config.width / 6;
        row3 = 4 * game.config.width / 6;
        this.doneButton = this.add.sprite(game.config.width / 6, cardHeight+200, "doneButton").setInteractive();
        //add a new card to deck
        // changed to sprite instead of card due to bugs
        //this.player = this.add.sprite(game.config.width / 10, 2.5 * game.config.height / 4, "Knight").setOrigin(0.0);
        this.cardpick1 = this.add.sprite(row1+75, cardHeight-75, "cards").setInteractive();
        this.cardpick1.visible = true;
        this.cardpick1.setScale(2.5);
        this.cardpick1.setOrigin(0.0);
        this.cardpick1.setDepth(-1);

        // which card do we play?
        let cardFrameChoice = null;
        if (game.config.currentLevel == 2) {
            cardFrameChoice = game.config.cardChoice;
            console.log("cardFrameChoice: ", cardFrameChoice);
        } else if (game.config.currentLevel == 3) {
            cardFrameChoice = game.config.cardChoice2;
            console.log("cardFrameChoice: ", cardFrameChoice);
        } else {
            console.log("error: cardFrameChoice: ", cardFrameChoice);
        }

        this.cardpick1.anims.play(cardFrameChoice.toString());

        this.done = false;
        let scene = this;

        this.doneButton.on("pointerdown", () => {
            //this code is based on the below link. after playing around with it for a long time i have determined
            //the phaser example changes a particle emmiter to be the image but how to change a sprite
            //https://phaser.io/examples/v3/view/snapshot/snapshot-area#
            console.log("clicked on doneButton");
            // let textureManager = this.textures;

            this.game.renderer.snapshotArea(this.cardpick1.x, this.cardpick1.y, 240, 360, function (image)
            {
                // document.body.appendChild(image);
                // console.log(this);
                // console.log(scene);
                //console.log(image);
                // image1 = image;

                if (game.config.currentLevel == 2) {
                    
                    if (scene.textures.exists('newcard')) {
                        scene.textures.remove('newcard');
                    }
    
                    scene.textures.addImage('newcard', image); // adds texture to this scene
                    console.log("does the texture exist? ", scene.textures.exists('newcard'));
                    scene.done = true;

                } else if (game.config.currentLevel == 3) {
                    if (scene.textures.exists('newcard2')) {
                        scene.textures.remove('newcard2');
                    }
    
                    scene.textures.addImage('newcard2', image); // adds texture to this scene
                    console.log("does the texture exist? ", scene.textures.exists('newcard2'));
                    scene.done = true;
                } else {
                    console.log("error: snapshotArea: game.config.currentLevel: ", game.config.currentLevel);
                }

                // // console.log(textureManager);
                // scene.textures.addImage('newcard', image); // adds texture to this scene
                // console.log("does the texture exist? ", scene.textures.exists('newcard'));
                // scene.done = true;
                // console.log("does the texture exist? ", scene.textures.exists('newcard'));
                // scene.add.sprite(row1, cardHeight, 'newcard').setInteractive();
                // console.log("texture: ", scene.newtexture)

            }, 'image/png');

            // EVERYTHING that happens under snapshotArea() function actually occurs before the function.


            // console.log(scene.textures);
            // console.log("does the texture exist? ", scene.textures.exists('newcard'));
            //onsole.log("after snapshot: ", this);
            //console.log(this == scene);
            //scene.add.sprite(row1, cardHeight, 'newcard').setInteractive();
            //console.log("does the texture exist? ", scene.textures.exists('newcard'));
            // console.log(this.textures);
            // console.log("does the texture exist? ", scene.textures.exists('shade'));
            // this.cardpick1.setTexture('new card');
            // console.log("new texture: ", scene.newtexture);
            // this.add.sprite(row1, cardHeight, scene.newtexture).setInteractive();
            // console.log(this.card);

        }, this);

        
        this.cardpick1.on("pointerdown", () => {
            console.log("clicked on card");

        });
        this.redButton.on("pointerdown", () => {
            console.log("clicked on red button");
            brushHue =359;
            brushSaturation = "34.3";
            brushLightness = "40.0";

        });
        this.darkBlueButton.on("pointerdown", () => {
            console.log("clicked on darkBlueButton");
            brushHue =209;
            brushSaturation = "35.7";
            brushLightness = "28.0";

        });
        this.greyButton.on("pointerdown", () => {
            console.log("clicked on greyButton");
            brushHue =250;
            brushSaturation = "15.0";
            brushLightness = "15.7";
        });
        this.yellowButton.on("pointerdown", () => {
            console.log("clicked on yellowButton");
            brushHue =58;
            brushSaturation = "42.4";
            brushLightness = "74.1";

        });
        this.greenButton.on("pointerdown", () => {
            console.log("clicked on greenButton");
            brushHue =151;
            brushSaturation = "90.6";
            brushLightness = "33.5";

        });
        this.pinkButton.on("pointerdown", () => {
            console.log("clicked on pinkButton");
            brushHue =345;
            brushSaturation = "84.7";
            brushLightness = "61.6";

        });
    }   
    update() {
        if (game.config.currentLevel == 2) {
            if (this.textures.exists('newcard') && this.done) {
                console.log("exists in this.textures");
                // this.add.sprite(2 * game.config.width / 6, game.config.height /4, 'newcard').setInteractive();
                if (game.config.currentLevel==1){
                    this.scene.start('playGame');
                }
                if (game.config.currentLevel==2){
                    this.scene.start('Level2');
                }
                if (game.config.currentLevel==3){
                    this.scene.start('Level3');
                }
                console.log("error no level seen");
            }
        } else if (game.config.currentLevel == 3) {
            if (this.textures.exists('newcard2') && this.done) {
                console.log("exists in this.textures");
                // this.add.sprite(2 * game.config.width / 6, game.config.height /4, 'newcard').setInteractive();
                if (game.config.currentLevel==1){
                    this.scene.start('playGame');
                }
                if (game.config.currentLevel==2){
                    this.scene.start('Level2');
                }
                if (game.config.currentLevel==3){
                    this.scene.start('Level3');
                }
                console.log("error no level seen");
            }
        } else {
            console.log("error: no level seen");
        }
    }

}
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
var CreatePanel = function (scene) {

    //hieght of each card
    let cardHeight = game.config.height /4;

    // card rows
    let row1, row2, row3;
    row1 = 2 * game.config.width / 6;
    row2 = 3 * game.config.width / 6;
    row3 = 4 * game.config.width / 6;

    // Top ui
    var panel = scene.rexUI.add.sizer({ orientation: 'x' });

    // Background of panel
    // Drawing canvas
    var canvas = scene.rexUI.add.canvas(100, 100, 208, 150);
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
