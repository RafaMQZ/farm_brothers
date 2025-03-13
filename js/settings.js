var selectedAvatar;

/* Para uso de canvas ---------------------------------------------------------------------- */
let canvas = document.getElementById("pantallaInicio");
let ctx = canvas.getContext("2d");

let bgImage=new Image();
let logo=new Image();

bgImage.src="media/mainBG.png";
logo.src="media/name.png";

//para agregar el logo con una animacion
//necesitamos algunas variables
let baseY = 10;      // Posición inicial del logo 
let offsetY = 0;     // Desplazamiento desde la posición base
let direction = 1;   // Dirección: 1 (sube), -1 (baja)
let speed = 0.3;     // Velocidad de subida/bajada
let maxOffset = 10;  // Cuánto se quiere mover arriba/abajo

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //dibujar el fondo
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // Actualizar offset (sube o baja)
    offsetY += direction * speed;

    // Cambiar dirección al llegar a los límites 
    if (offsetY > maxOffset || offsetY < -maxOffset) {
        direction *= -1;
    }

    // Dibujar logo en nueva posición
    ctx.drawImage(logo, 1, baseY + offsetY, 500, 192);

    // Seguir animando
    requestAnimationFrame(animate);
}

// Esperar que la imagen cargue
logo.onload = function() {
    animate();  // Iniciar la animación
}

//mostar la siguiente pantalla
function pantalla_Avatar(){
    // Ocultar la pantalla inicial
    document.getElementById('mainPantalla').style.display = 'none';

    // Mostrar la pantalla de selección de avatar
    document.getElementById('pantallaAvatar').style.display = 'grid';
}

//si regresa de avatar a pantalla de inicio
function backMain1(){
    document.getElementById('pantallaAvatar').style.display = 'none';
    document.getElementById('mainPantalla').style.display = 'block';

    if(selectedAvatar!=null){
        //si es diferente de nulo, significa que ya habia elegido algo,
        //y luego regresó, entonces hay que reestablecer
        resetAvatarSelection();
        //vaciar el dropzone
        var dropzone = document.getElementById("dropzone");
        dropzone.innerHTML = ""; 
    }
}

/* Para drag and drop ---------------------------------------------------------------------- */
function allowDrop(ev) {
    ev.preventDefault();  
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id); // Asigna el id del avatar al evento drag
}

function drop(ev) {
    ev.preventDefault();

    if (selectedAvatar!=null) {
        //si ya hay algo en el dropzone
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Ya elegiste un avatar"
        });
        return;
    }

    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data); // Obtiene el avatar arrastrado
    draggedElement.classList.add("avatar-fixed");
    ev.target.appendChild(draggedElement); // Mueve el avatar al dropzone

    // Verificamos qué avatar está dentro del dropzone
    if (ev.target.id === "dropzone") {
        selectedAvatar = ev.target.querySelector('img').id;
    }
}

// Colgando los eventos a las etiquetas
document.getElementById("avatar1").addEventListener("dragstart", drag);
document.getElementById("avatar2").addEventListener("dragstart", drag);
//puedan soltarse
document.getElementById("dropzone").addEventListener("dragover", allowDrop);
document.getElementById("dropzone").addEventListener("drop", drop);

//se elige el avatar
function selectAvatar(){
    if(selectedAvatar){
        if(selectedAvatar === "avatar1"){
            document.getElementById('pantallaAvatar').style.display = 'none';
            
        } else if (selectedAvatar === "avatar2"){
            document.getElementById('pantallaAvatar').style.display = 'none';
        }
        
        ejecutarJuego();
    }
    else {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "No elegiste ningun avatar"
        });

        resetAvatarSelection();
    }
}

// Función para resetear la pantalla si no eligio el avatar
function resetAvatarSelection() {
    selectedAvatar=null;
    // Vuelve a poner los avatares disponibles
    var avatar1 = document.getElementById("avatar1");
    var avatar2 = document.getElementById("avatar2");

    // Añade los avatares nuevamente al contenedor
    document.getElementById("avatares").appendChild(avatar1);
    document.getElementById("avatares").appendChild(avatar2);
}

function ejecutarJuego(){
    var player;
    var pacas;
    var gallinas;
    var bombs;
    var coyote;
    var platforms;
    var cursors;
    var score = 0;
    var gameOver = false;
    var scoreText;
    
    class Lvl1 extends Phaser.Scene {
        constructor() {
            super({ key: 'Lvl1' });
        }
    
        preload() {
            this.load.image('sky1', 'media/bg1.png');
            this.load.image('ground1', 'media/plataforma1.png');
            this.load.image('floor1', 'media/floor1.png');
            this.load.image('paca', 'media/paca.png');
            this.load.image('bomb', 'media/bomb.png');
            this.load.spritesheet('dude1', 'media/player1.png', { frameWidth: 46, frameHeight: 90 });
            this.load.spritesheet('dude2', 'media/player2.png', { frameWidth: 46, frameHeight: 90 });
        }
    
        create() {
            this.scene.stop('Lvl1');
            this.scene.start('Lvl2');

            // Fondo
            this.add.image(400, 300, 'sky1');
    
            // Puntaje
            scoreText = this.add.text(16, 0, 'score: ', { fontSize: '32px', fill: '#000' });
    
            // Plataformas
            platforms = this.physics.add.staticGroup();
            platforms.create(400, 600, 'floor1');
            platforms.create(610, 430, 'ground1');
            platforms.create(50, 280, 'ground1');
            platforms.create(750, 260, 'ground1');
    
            if(selectedAvatar==="avatar1"){
                player = this.physics.add.sprite(100, 420, 'dude1');
                player.setBounce(0.2);
                player.setCollideWorldBounds(true);

                // Animaciones
                this.anims.create({
                    key: 'left',
                    frames: this.anims.generateFrameNumbers('dude1', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: -1
                });
        
                this.anims.create({
                    key: 'turn',
                    frames: [{ key: 'dude1', frame: 4 }],
                    frameRate: 20
                });
        
                this.anims.create({
                    key: 'right',
                    frames: this.anims.generateFrameNumbers('dude1', { start: 5, end: 8 }),
                    frameRate: 10,
                    repeat: -1
                });

            } else if(selectedAvatar==="avatar2"){
                player = this.physics.add.sprite(100, 420, 'dude2');
                player.setBounce(0.2);
                player.setCollideWorldBounds(true);

                // Animaciones
                this.anims.create({
                    key: 'left',
                    frames: this.anims.generateFrameNumbers('dude2', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: -1
                });
        
                this.anims.create({
                    key: 'turn',
                    frames: [{ key: 'dude2', frame: 4 }],
                    frameRate: 20
                });
        
                this.anims.create({
                    key: 'right',
                    frames: this.anims.generateFrameNumbers('dude2', { start: 5, end: 8 }),
                    frameRate: 10,
                    repeat: -1
                });
            }
    
            // Controles
            cursors = this.input.keyboard.createCursorKeys();
    
            // Pacas
            pacas = this.physics.add.group({
                key: 'paca',
                repeat: 11, //12 en total
                setXY: { x: 12, y: 0, stepX: 70 }
            });
    
            pacas.children.iterate(child => {
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            });
    
            // Bombas
            bombs = this.physics.add.group();
    
            // Colisiones
            this.physics.add.collider(player, platforms);
            this.physics.add.collider(pacas, platforms);
            this.physics.add.collider(bombs, platforms);
            this.physics.add.overlap(player, pacas, this.colectarPacas, null, this);
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
    
        colectarPacas(player, paca) {
            paca.disableBody(true, true);
    
            score += 10;
            scoreText.setText('Score: ' + score);
    
            if (pacas.countActive(true) === 0) {
                /*pacas.children.iterate(child => {
                    child.enableBody(true, child.x, 0, true, true);
                });
    
                var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;*/
                this.scene.stop('Lvl1');
                this.scene.start('Lvl2'); // Cambia a la escena del segundo nivel
            }
        }
    
        hitBomb(player, bomb) {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        }
    } //lvl1
    
    class Lvl2 extends Phaser.Scene {
        constructor() {
            super({ key: 'Lvl2' });
        }
    
        preload() {
            this.load.image('sky2', 'media/bg2.png');
            this.load.image('ground2', 'media/plataforma2.png');
            this.load.image('floor2', 'media/floor2.png');
            this.load.image('gallina', 'media/paca.png');
            this.load.image('text', 'media/gameOver_txt.png'); //pantalla de game over
            this.load.spritesheet('dude1', 'media/player1.png', { frameWidth: 46, frameHeight: 90 });
            this.load.spritesheet('dude2', 'media/player2.png', { frameWidth: 46, frameHeight: 90 });
            this.load.spritesheet('gallinita', 'media/gallina.png', { frameWidth: 40, frameHeight: 46 });
            this.load.spritesheet('coyote', 'media/coyote.png', { frameWidth: 95, frameHeight: 60 });
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
        
            if(selectedAvatar==="avatar1"){
                player = this.physics.add.sprite(200, 420, 'dude1');

            } else if(selectedAvatar==="avatar2"){
                player = this.physics.add.sprite(200, 420, 'dude2');
            }

            player.setBounce(0.2);
            player.setCollideWorldBounds(true);
            
            // Controles
            cursors = this.input.keyboard.createCursorKeys();
            
            // Gallinas
            this.anims.create({
                key: 'walkGallina',
                frames: this.anims.generateFrameNumbers('gallinita', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
    
            gallinas = this.physics.add.group({
                key: 'gallinita',
                repeat: 9,
            });

            let xG=12; //posicion para la 1era gallina
            gallinas.children.iterate(child => {
                let separacion = Phaser.Math.Between(70, 100); //espacio random entre gallinas
                child.setX(xG);
                child.setY(0);
                xG+=separacion;

                child.setBounce(0.9);
                child.setCollideWorldBounds(true);
                child.setVelocityX(Phaser.Math.Between(100, 250));
                child.anims.play('walkGallina', true);
            });

            //para movimiento del coyote
            this.playerMovements = []; // Guarda los movimientos del jugador
            this.movementDelay = 3000; // 3 segundos en milisegundos
            this.lastMoveTime = 0;
        
            // coyote
            this.anims.create({
                key: 'walkCoyote',
                frames: this.anims.generateFrameNumbers('coyote', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });

            coyote=this.physics.add.sprite(50, 420, 'coyote');
            coyote.setBounce(0.2);
            coyote.setCollideWorldBounds(true);
            coyote.anims.play('walkCoyote');

            // Colisiones
            this.physics.add.collider(player, platforms);
            this.physics.add.collider(gallinas, platforms);
            this.physics.add.collider(coyote, platforms);
            this.physics.add.overlap(player, gallinas, this.colectarGallinas, null, this);
            this.physics.add.collider(player, coyote, this.hitBomb, null, this);
        }
        
        update() {
            if (gameOver && !this.hasHandledGameOver) {
                this.hasHandledGameOver = true; // para que no se llame muchas veces
                
                //Game over
                let overlay = this.add.graphics().setDepth(10);
                overlay.fillStyle(0x000000, 0.5); // Color negro con opacidad
                overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
                // texto de game over
                let txt = this.add.image(400, 300, 'text').setDepth(11);
    
                this.tweens.add({
                    targets: txt,
                    y: 130,
                    duration: 1000,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
    
                //boton de regresar
    
            }
        
            if (!gameOver) {
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

                gallinas.children.iterate(child => {
                    if (child.body.velocity.x > 0) {
                        child.setFlipX(false);
                    } else {
                        child.setFlipX(true);
                    }
                });

                let movement = {
                    x: player.x,
                    y: player.y,
                    velocityX: player.body.velocity.x,
                    velocityY: player.body.velocity.y,
                    timestamp: this.time.now
                };
                this.playerMovements.push(movement);

                // Eliminar movimientos antiguos para evitar que crezca infinito
                while (this.playerMovements.length > 0 && this.time.now - this.playerMovements[0].timestamp > this.movementDelay + 1000) {
                    this.playerMovements.shift();
                }

                // Coyote sigue con 3 segundos de retraso
                let delayedMovement = this.playerMovements.find(m => this.time.now - m.timestamp >= this.movementDelay);
                if (delayedMovement) {
                    coyote.setVelocityX(delayedMovement.velocityX);
                    if (coyote.body.touching.down && delayedMovement.velocityY < -200) {
                        // Simula un salto solo si el jugador había saltado
                        coyote.setVelocityY(-330);
                    }
                }

                if (delayedMovement) {
                    if (delayedMovement.velocityX < 0) {
                        coyote.anims.play('walkCoyote', true);
                        coyote.setFlipX(true);
                    } else if (delayedMovement.velocityX > 0) {
                        coyote.anims.play('walkCoyote', true);
                        coyote.setFlipX(false);
                    } else {
                        coyote.anims.stop();
                    }
                }
            }
        }    
    
        colectarGallinas(player, gallina) {
            gallina.disableBody(true, true);
    
            score += 10;
            scoreText.setText('Score: ' + score);
    
            if (gallinas.countActive(true) === 0) {
                let xG=12;

                gallinas.children.iterate(child => {
                    let separacion = Phaser.Math.Between(70, 100);
                    child.enableBody(true, xG, 0, true, true);

                    let velocidadX = Phaser.Math.Between(100, 500);
                    if (Phaser.Math.Between(0, 1) === 0) velocidadX *= -1;
                    child.setVelocityX(velocidadX);

                    // Reproducir animación
                    child.anims.play('walkGallina', true);

                    xG+=separacion;
                });
            }
        }
    
        hitBomb(player, obj) {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        }
    } //lvl2

    var game; //global

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
        scene: [Lvl1, Lvl2]
    };

    game = new Phaser.Game(config);
}