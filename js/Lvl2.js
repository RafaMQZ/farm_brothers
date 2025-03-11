var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

class Lvl2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Lvl2' });
    }

    preload() {
        this.load.image('bg', 'media/mainBG.png');
        this.load.image('sky2', 'media/bg2.png');
        this.load.image('ground2', 'media/plataforma2.png');
        this.load.image('floor2', 'media/floor2.png');
        this.load.image('star', 'media/paca.png');
        this.load.image('bomb', 'media/bomb.png');
        this.load.spritesheet('dude', 'media/player2.png', { frameWidth: 46, frameHeight: 90 });
    }

    create() {
        gameOver = false; // Reinicia el estado del juego
        score = 0; // Reinicia el puntaje
    
        // Fondo
        this.add.image(400, 300, 'sky2');
    
        // Puntaje
        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    
        // Plataformas
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 600, 'floor2');
        platforms.create(610, 430, 'ground2');
        platforms.create(50, 280, 'ground2');
        platforms.create(750, 260, 'ground2');
    
        // Jugador
        player = this.physics.add.sprite(100, 420, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        
        // Controles
        cursors = this.input.keyboard.createCursorKeys();
        
        // Estrellas
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
    
        stars.children.iterate(child => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    
        // Bombas
        bombs = this.physics.add.group();
    
        // Colisiones
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);
        this.physics.add.overlap(player, stars, this.collectStar, null, this);
        this.physics.add.collider(player, bombs, this.hitBomb, null, this);
    }
    
    update() {
        if (gameOver) return;

        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0) {
            stars.children.iterate(child => {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
    }
}
