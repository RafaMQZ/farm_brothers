
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
    scene: [PantallaInicio, PantallaUsuario, PantallaGameOver, Lvl1, Lvl2]
};


var game = new Phaser.Game(config);
