/* Para uso de canvas */
let canvas = document.getElementById("pantallaInicio");
let ctx = canvas.getContext("2d");

let bgImage=new Image();
let logo=new Image();

bgImage.src="media/mainBG.png";
logo.src="media/name.png";

//para agregar el logo con una animacion
//necesitamos algunas variables
let baseY = 10;     // Posición inicial del logo 
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

function pantalla_Avatar(){
    // Ocultar la pantalla inicial
    document.getElementById('mainPantalla').style.display = 'none';

    // Mostrar la pantalla de selección de avatar
    document.getElementById('pantallaAvatar').style.display = 'grid';
}

/* Para drag and drop -----------------------------------------------------*/
var selectedAvatar;
var playerPath; //para elegir el jugador

function allowDrop(ev) {
    ev.preventDefault();  // Permite el drop en la zona
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id); // Asigna el id del avatar al evento drag
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data); // Obtiene el avatar arrastrado
    ev.target.appendChild(draggedElement); // Mueve el avatar al dropzone

    // Aquí verificamos qué avatar está dentro del dropzone
    if (ev.target.id === "dropzone") {
        selectedAvatar = ev.target.querySelector('img').id; // Obtiene el avatar dentro del dropzone
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
            Swal.fire({
                icon: "success",
                title: "Avatar elegido!",
                text: "Puedes continuar"
            });
            playerPath="media/player1.png";
            document.getElementById('pantallaAvatar').style.display = 'none';
        } else if (selectedAvatar === "avatar2"){
            Swal.fire({
                icon: "success",
                title: "Avatar elegido!",
                text: "Puedes continuar"
            });
            playerPath="media/player2.png";
            document.getElementById('pantallaAvatar').style.display = 'none';
        }
        
        
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
    //vaciar el dropzone
    var dropzone = document.getElementById("dropzone");
    dropzone.innerHTML = "";  // Elimina el avatar que esté dentro del dropzone

    // Vuelve a poner los avatares disponibles
    var avatar1 = document.getElementById("avatar1");
    var avatar2 = document.getElementById("avatar2");

    // Añade los avatares nuevamente al contenedor
    document.getElementById("avatares").appendChild(avatar1);
    document.getElementById("avatares").appendChild(avatar2);
}