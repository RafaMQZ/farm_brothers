class PantallaInicio extends Phaser.Scene {
    constructor() {
        super({ key: 'PantallaInicio' });
    }

    preload() {
        this.load.image('bg', 'media/mainBG.png'); // Fondo
        this.load.image('title', 'media/name.png');
        this.load.image('playButton', 'media/playBtn.png'); // Botón de "Play"
    }

    create() {
        // Fondo
        this.add.image(400, 300, 'bg');

        // Nombre
        let title = this.add.image(250, 110, 'title');
        this.tweens.add({
            targets: title,
            y: 130, // Mueve el título un poco hacia abajo
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true, // Hace que vuelva a la posición original
            repeat: -1 // Repite para siempre
        });

        // Botón de "Play"
        let playButton = this.add.image(400, 400, 'playButton').setInteractive();

        // Al hacer clic en el botón, cambia a la escena del juego
        playButton.on('pointerdown', () => {
            this.scene.start('Juego');
        });

        // Efecto visual al pasar el mouse sobre el botón
        playButton.on('pointerover', () => {
            playButton.setScale(1.1); // Aumenta el tamaño del botón
        });

        playButton.on('pointerout', () => {
            playButton.setScale(1); // Vuelve al tamaño normal
        });
    }
}

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

class Juego extends Phaser.Scene {
    constructor() {
        super({ key: 'Juego' });
    }

    //para cargar todos los recursos
    preload (){
        this.load.image('bg', 'media/mainBG.png');
        this.load.image('sky', 'media/bg.png');
        this.load.image('ground', 'media/plataforma.png');
        this.load.image('floor', 'media/floor.png');
        this.load.image('star', 'media/paca.png');
        this.load.image('bomb', 'media/bomb.png');
        this.load.spritesheet('dude', 'media/player2.png', { frameWidth: 46, frameHeight: 90 });
    }

    create (){
        //background
        this.add.image(400, 300, 'sky');
        
        //score
        scoreText = this.add.text(16, -180, 'score: 0', { fontSize: '32px', fill: '#000' });
    
        //es un grupo de elementos estaticos, no se moveran, no hacen nadota
        platforms = this.physics.add.staticGroup();
    
        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        platforms.create(400, 600, 'floor');
    
        //  Now let's create some ledges
        platforms.create(610, 430, 'ground');
        platforms.create(50, 280, 'ground');
        platforms.create(750, 260, 'ground');
    
        //es un elemento sprite dinamico 
        player = this.physics.add.sprite(100, 420, 'dude');
    
        //  Player physics properties. Animacion para que parezca que rebota un poquis
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
    
        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1 //significa que cuando termine, vuelve a empezar
            //la animacion de left es de 10 fgps y usa el frame 0, 1, 2 y 3
        });
    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    
        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
    
        //grupo de elementos dinamico
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11, //se crean 12 en total,1 por defecto y 11 mas
            setXY: { x: 12, y: 0, stepX: 70 } //posicion inicial de las estrellas, stepX es la separacion (70px)
        });
    
        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            //todas rebotan en forma diferente, se les da un valor entre .4 y .8
        });
    
        bombs = this.physics.add.group();
    
        //propiedad de colision (choque) con las plataformas
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);
    
        this.physics.add.overlap(player, stars, collectStar, null, this); //verifica si el jugador se sobrepone a una estrella
        //y si si, llama a collectStar, que la deshabilita, asi ya no se ve y da la ilusion de que el jugador la recogió
    
        this.physics.add.collider(player, bombs, hitBomb, null, this); //verifica si el jugador choca con una bomba
        //y si si, llama a hitBomb
    }
    
    update (){
        if (gameOver){
            return;
        }
    
        if (cursors.left.isDown){
            player.setVelocityX(-160);
    
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown){
            player.setVelocityX(160);
    
            player.anims.play('right', true);
        }
        else{
            player.setVelocityX(0);
    
            player.anims.play('turn');
        }
    
        if (cursors.up.isDown && player.body.touching.down){
            player.setVelocityY(-330);
        }
    }

    collectStar (player, star){
        star.disableBody(true, true);
    
        //  Add and update the score
        score += 10;
        scoreText.setText('Score: ' + score);
    
        if (stars.countActive(true) === 0){
            //  A new batch of stars to collect
            stars.children.iterate(function (child) {
    
                child.enableBody(true, child.x, 0, true, true);
    
            });
    
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);                                     
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
    
        }
    }
    
    hitBomb (player, bomb){
        this.physics.pause();
    
        player.setTint(0xff0000);
    
        player.anims.play('turn');
    
        gameOver = true;
    }

}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [PantallaInicio, Juego]
};

var game = new Phaser.Game(config);

/*
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

//para cargar todos los recursos
function preload (){
    this.load.image('bg', 'media/mainBG.png');
    this.load.image('sky', 'media/bg.png');
    this.load.image('ground', 'media/plataforma.png');
    this.load.image('floor', 'media/floor.png');
    this.load.image('star', 'media/paca.png');
    this.load.image('bomb', 'media/bomb.png');
    this.load.spritesheet('dude', 'media/player2.png', { frameWidth: 46, frameHeight: 90 });
}

function create (){
    //background
    this.add.image(400, 300, 'sky');
    
    //score
    scoreText = this.add.text(16, -180, 'score: 0', { fontSize: '32px', fill: '#000' });

    //es un grupo de elementos estaticos, no se moveran, no hacen nadota
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 600, 'floor');

    //  Now let's create some ledges
    platforms.create(610, 430, 'ground');
    platforms.create(50, 280, 'ground');
    platforms.create(750, 260, 'ground');

    //es un elemento sprite dinamico 
    player = this.physics.add.sprite(100, 420, 'dude');

    //  Player physics properties. Animacion para que parezca que rebota un poquis
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1 //significa que cuando termine, vuelve a empezar
        //la animacion de left es de 10 fgps y usa el frame 0, 1, 2 y 3
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //grupo de elementos dinamico
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11, //se crean 12 en total,1 por defecto y 11 mas
        setXY: { x: 12, y: 0, stepX: 70 } //posicion inicial de las estrellas, stepX es la separacion (70px)
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        //todas rebotan en forma diferente, se les da un valor entre .4 y .8
    });

    bombs = this.physics.add.group();

    //propiedad de colision (choque) con las plataformas
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this); //verifica si el jugador se sobrepone a una estrella
    //y si si, llama a collectStar, que la deshabilita, asi ya no se ve y da la ilusion de que el jugador la recogió

    this.physics.add.collider(player, bombs, hitBomb, null, this); //verifica si el jugador choca con una bomba
    //y si si, llama a hitBomb
}

function update (){
    if (gameOver){
        return;
    }

    if (cursors.left.isDown){
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown){
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else{
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-330);
    }
}

function collectStar (player, star){
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0){
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);                                     
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb){
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
*/