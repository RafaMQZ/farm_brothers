class PantallaUsuario extends Phaser.Scene {
    constructor() {
        super({ key: 'PantallaUsuario' });
    }

    create() {
        console.log("entrando");
        // Fondo
        this.add.rectangle(400, 300, 800, 600, 0x000000); // Fondo negro

        // Texto "Ingresa tu nombre"
        this.add.text(250, 200, "Ingresa tu nombre:", { fontSize: "32px", fill: "#fff" });

        // Crear input usando Phaser
        let usernameInput = this.add.dom(400, 300).createFromHTML(`
            <input type="text" id="username" placeholder="Tu nombre..." 
                style="padding: 10px; font-size: 20px; text-align: center; width: 200px;">
        `);

        // Crear botón usando Phaser
        let playButton = this.add.dom(400, 360).createFromHTML(`
            <button style="padding: 10px; font-size: 20px;">Jugar</button>
        `);

        // Evento del botón
        playButton.addListener('click');
        playButton.on('click', () => {
            let username = document.getElementById("username").value.trim();
            if (username !== "") {
                localStorage.setItem("usuario", username); // Guardar en localStorage
                this.scene.start('Lvl1'); // Ir al nivel 1
            } else {
                alert("Por favor, ingresa un nombre.");
            }
        });
    }
}
