/*class PantallaInicio extends Phaser.Scene {
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
            y: 130,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Botón de "Play"
        let playButton = this.add.image(400, 400, 'playButton').setInteractive();

        // Al hacer clic en el botón, cambia a la escena del juego
        playButton.on('pointerdown', () => {
            this.scene.start('Lvl1');
        });

        // Efecto al pasar el mouse sobre el botón
        playButton.on('pointerover', () => {
            playButton.setScale(1.1);
        });

        playButton.on('pointerout', () => {
            playButton.setScale(1);
        });
    }
}
*/
class PantallaInicio extends Phaser.Scene {
    constructor() {
        super({ key: 'PantallaInicio' });
    }

    preload() {
        this.load.image('bg', 'media/mainBG.png'); 
        this.load.image('title', 'media/name.png');
        this.load.image('playButton', 'media/playBtn.png'); 
    }

    create() {
        // Fondo
        this.add.image(400, 300, 'bg');

        // Animación del título
        let title = this.add.image(250, 110, 'title');
        this.tweens.add({
            targets: title,
            y: 130,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Botón de "Play"
        let playButton = this.add.image(400, 400, 'playButton').setInteractive();

        playButton.on('pointerdown', () => {
            this.scene.start('PantallaUsuario'); // Cambia a la pantalla para ingresar el nombre
        });

        // Efectos al pasar el mouse sobre el botón
        playButton.on('pointerover', () => playButton.setScale(1.1));
        playButton.on('pointerout', () => playButton.setScale(1));
    }
}
