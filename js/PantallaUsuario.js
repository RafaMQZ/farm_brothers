class PantallaUsuario extends Phaser.Scene {
    constructor() {
        super({ key: 'PantallaUsuario' });
    }

    preload() {
        this.load.image('bg', 'media/mainBG.png');
        this.load.image('ingresaNombre', 'media/inputname.png'); 
        this.load.image('start', 'media/playBtn.png'); 
    }

    create() {
        console.log("Entrando a la pantalla de usuario...");

        // Fondo
        this.add.image(400, 300, 'bg').setOrigin(0.5, 0.5).setDisplaySize(800, 600);

        // Texto "Ingresa tu nombre" (más arriba)
        this.add.image(400, 100, 'ingresaNombre').setOrigin(0.5).setScale(0.8);

        // Texto interactivo como "input" (más arriba)
        let nombreJugador = "";
        let nombreTexto = this.add.text(400, 180, "Tu nombre...", {
            fontSize: "28px",
            fill: "#fff",
            backgroundColor: "#333",
            padding: { x: 10, y: 5 },
        })
        .setOrigin(0.5)
        .setInteractive();

        // Capturar teclado para "escribir"
        this.input.keyboard.on('keydown', (event) => {
            if (event.key === "Backspace") {
                nombreJugador = nombreJugador.slice(0, -1);
            } else if (event.key.length === 1) {
                nombreJugador += event.key;
            }
            nombreTexto.setText(nombreJugador || "Tu nombre...");
        });

        let playButton = this.add.image(400, 300, 'playButton').setOrigin(0.5).setScale(0.8).setInteractive();

        // Efecto al pasar el mouse
        playButton.on('pointerover', () => {
            playButton.setScale(0.9);
        });

        playButton.on('pointerout', () => {
            playButton.setScale(0.8);
        });
        // Evento del botón
        playButton.on('pointerdown', () => {
            if (nombreJugador.trim() !== "") {
                localStorage.setItem("usuario", nombreJugador.trim());
                this.scene.start('Lvl1');
            } else {
                alert("Por favor, ingresa un nombre.");
            }
        });
    }
}
