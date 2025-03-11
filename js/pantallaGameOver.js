class PantallaGameOver extends Phaser.Scene {
    constructor () {
        super({ key: 'PantallaGameOver' });
    }

    preload() {
        this.load.image('fondo', 'media/gameOver.png');
        this.load.image('text', 'media/gameOver_txt.png');
    }

    create() {
        this.add.image(400, 300, 'fondo');

        let txt = this.add.image(400, 300, 'text');
        this.tweens.add({
            targets: txt,
            y: 130,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
}