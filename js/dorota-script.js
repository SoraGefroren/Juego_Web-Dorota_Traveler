// Variable para conteo de tiempo
var countTime = 0;
// Variables del Player
var playerLife = false; // Indica si el Player esta vivo o muerto
var playerPosition = 40; // Indica la posicion en porcentaje del Player en lo alto (TOP) (Movimiento Vertical)
var playerDirectionMov = 0; // Indica la direccion hacia donde se mueve el Player (1 = Abajo, -1 = Arriba)
function playerMov(movDirection) { //Movimiento Vertical
    var sizeMov = 1; // Velocidad o avance en porcentaje del movimiento del Player
    var sizeMovShadow = 1.5; // Velocidad o avance en porcentaje del movimiento de la Sombra del Player
    if (movDirection < 0 && playerPosition < 90) { // Ir hacia Abajo
        playerPosition += sizeMov;
        // Mover sombra del player
        $(".dorota-player-shadow").css({ top: (playerPosition - sizeMovShadow) + '%' });
    } else if (movDirection > 0 && playerPosition > 5) { // Ir hacia Arriba
        playerPosition -= sizeMov;
        // Mover sombra del player
        $(".dorota-player-shadow").css({ top: (playerPosition + sizeMovShadow) + '%' });
    } else {
        // Mover sombra del player
        $(".dorota-player-shadow").css({ top: playerPosition + '%' });
    }
    // Actualizar la posicion del Player en porcentaje
    $(".dorota-player").css({ top: playerPosition + '%' });
}

// Variables de los Obstaculos
var obstaclesArray = []; // Arreglo de Obstaculos (Todos los obstaculos)
var obstaclesPositionArray = [ // Posicion en Porcentaje de los obstaculos (Movimiento Horizontal)
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100
];
var obstaclesGoAutorizeArray = [ // Autorizacion para Mover el Obstaculo
    false, false, false, false, false, false, false, false, false, false
];

function obstacleMov(obstacleElement, index) { // Movimiento del Obstaculo Horizontal
    if (obstaclesGoAutorizeArray[index]) { // Hay autorizacion para mover??
        if (obstaclesPositionArray[index] > -10) { // Mover Obstaculo Horizontalmente hacia la Izquierda
            obstaclesPositionArray[index] -= 1; // Avance horizontal del Obstaculo
        } else { // Restablecer el obstaculo Horizontalmente a su posicion inicial (Derecha)
            obstaclesPositionArray[index] = 100; // Posicion inicial del Obstaculo
            obstaclesGoAutorizeArray[index] = false; // Reiniciar autorizacion de movimiento del Obstaculo
        }
        // Actualizar posicion del Obstaculo
        $("#" + obstacleElement.id).css({ left: obstaclesPositionArray[index] + '%' });
    }
}

function obstacleAutorizeMov(index) { // Autorizar movimiento del obstaculo
    if (!obstaclesGoAutorizeArray[index]) {
        obstaclesGoAutorizeArray[index] = Boolean(Math.round(Math.random()));
    }
}

// Funcion para actualizar el movimiento del Player cada x tiempo
function onGame_PlayerMovUpdate() {
    if (playerLife) {
        playerMov(playerDirectionMov);
        onGame_PlayerVSObstacles_CollisionDetect();
    }
}
// Funcion para actualizar el movimiento de los Obstaculos cada x tiempo
function onGame_ObstaclesMovUpdate() {
    if (playerLife) {
        for (var i = 0; i < obstaclesArray.length; i++) {
            obstacleMov(obstaclesArray[i], i);
        }
    }
}
// Funcion para autorizar el movimiento de los Obstaculos cada x tiempo (Random)
function onGame_ObstaclesAutorizeMovUpdate() {
    if (playerLife) {
        var pilNum = []; // Pila
        var numObstaclesToAutorize = Math.floor(Math.random() * ((obstaclesArray.length / 2 + obstaclesArray.length / 3) - obstaclesArray.length / 4 + 1)) + obstaclesArray.length / 4;
        for (var i = 0; i < numObstaclesToAutorize; i++) {
            // Eligo aleatoriamente un Obstaculo
            var pos = Math.floor(Math.random() * obstaclesArray.length);
            //console.log(pilNum);
            if (pilNum.indexOf(pos) < 0) { // Si el Obstaculo elegido no esta en pila
                pilNum.push(pos); // Agregar Obstaculo elegido a la pila
                obstacleAutorizeMov(pos); // Autorizo movimiento del Obstaculo elegido
            }
        }
    }
}
// Funcion para detectar colision del Player contra algun Obstaculo
function onGame_PlayerVSObstacles_CollisionDetect() {
    var percentPadding = 15; // Porcentaje del Padding de Colision
    var player = $(".dorota-player"); // Hacer referencia al Player
    var paddingCollision_playerX = (percentPadding * player.width()) / 100; // Establecer padding Horizontal en el player
    var paddingCollision_playerY = (percentPadding * player.height()) / 100; // Establecer padding Vertical en el player
    var pxIni = player.position().left + paddingCollision_playerX; // player.offset().left
    var pxFin = pxIni + player.width() - paddingCollision_playerX;
    var pyIni = player.position().top + paddingCollision_playerY; // player.offset().top
    var pyFin = pyIni + player.height() - paddingCollision_playerY;
    // Comprobar si existe colision con algun Obstaculo
    var i = 0;
    while ((i < obstaclesArray.length) && playerLife) {
        var obstacle = $("#" + obstaclesArray[i].id); // Hacer referencia al obstaculo
        var paddingCollision_obstacle = (percentPadding * obstacle.width()) / 100; // Establecer padding en el Obstaculo
        var oxIni = obstacle.position().left + paddingCollision_obstacle; // obstacle.offset().left
        var oxFin = oxIni + obstacle.width() - paddingCollision_obstacle;
        if ((oxIni <= pxFin) && (oxFin >= pxIni)) { // Comprobar si estan en el mismo rango de posicion Horizontal ('x' o 'left')
            var oyIni = obstacle.position().top + paddingCollision_obstacle; // obstacle.offset().top
            var oyFin = oyIni + obstacle.height() - paddingCollision_obstacle;
            if ((oyIni <= pyFin) && (oyFin >= pyIni)) { // Comprobar si estan en el mismo rango de posicion Vertical ('y' o 'Top')
                playerLife = false; // Indicar que ha muerto el player
                //console.log("Colision con: #"+obstaclesArray[i].id+".");
            }
        }
        i += 1;
    }
}

//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
var nameBaseSprite = "imgs/dorota-player-death-"; // Nombre base de la Imagen-Sprite
var spriteExt = ".png"; // Estencion base de la Imagen-Sprite
var numberNameSprite = 1; // Numero de Image-Sprite, Rango 1 => 4
// Funcion para el control de la animacion de muerte o destruccion
function onDeath_PlayerAnimDestruction() {
    if (!playerLife) { // Activar si el Player esta muerto
        if (numberNameSprite < 5) { // Si no es la ultima Imagen-Sprite, cambiar
            $("img.dorota-player").attr('src', nameBaseSprite + numberNameSprite + spriteExt);
            // Ocultar sombra
            $("img.dorota-player-shadow").attr('hidden', 'true');
        } else { // Si es la ultima Imagen-Sprite, ocultar player
            $("img.dorota-player").attr('hidden', 'true');
            $(".dorota-gui-zone").removeAttr('hidden');
            // Marcar la ultima cantidad de tiempo en la GUI fuera del Juego
            $("#dorota-count-time").text(countTime);
        }
        if (numberNameSprite < 6) {
            numberNameSprite += 1; // Incrementar para ir a la siguiente Imagen-Sprite
        }
    }
}

//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------

function onGame_TimeUpdate() {
    if (playerLife) {
        countTime += 1;
        // Actualizar el contador de tiempo
        $("#dorota-count-time-game").text('' + countTime);
    }
}

//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------

// Establecer intervalo de tiempo en que x funciones seran ejecutadas automaticamente
setInterval('onGame_PlayerMovUpdate()', 10);
setInterval('onGame_ObstaclesMovUpdate()', 25);
setInterval('onGame_ObstaclesAutorizeMovUpdate()', 100);
setInterval('onDeath_PlayerAnimDestruction()', 75);
setInterval('onGame_TimeUpdate()', 1000);

//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
// Funcion para reiniciar el Juego
function onGUI_RestartGame() {
    // GUI
    $(".dorota-gui-zone").attr('hidden', 'true');
    $(".dorota-button-restart").attr('src', 'imgs/dorota-button-ready-normal.png');
    //----------------------------------------------------------
    // GAME
    countTime = 0; // Contador de tiempo
    $("#dorota-count-time-game").text(countTime);
    playerLife = true; // Indica si el Player esta vivo o muerto
    playerPosition = 40; // Indica la posicion en porcentaje del Player en lo alto (TOP) (Movimiento Vertical)
    playerDirectionMov = 0; // Indica la direccion hacia donde se mueve el Player (1 = Abajo, -1 = Arriba)
    $(".dorota-player").css({ top: playerPosition + '%' }); // Actualizar la posicion del Player en porcentaje
    $(".dorota-player-shadow").css({ top: playerPosition + '%' }); // Actualizar la posicion de la Sombra del Player en porcentaje


    obstaclesPositionArray = [ // Posicion en Porcentaje de los obstaculos (Movimiento Horizontal)
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100
    ];
    obstaclesGoAutorizeArray = [ // Autorizacion para Mover el Obstaculo
        false, false, false, false, false, false, false, false, false, false
    ];
    for (var i = 0; i < obstaclesArray.length; i++) {
        // Actualizar posicion del Obstaculo
        $("#" + obstaclesArray[i].id).css({ left: obstaclesPositionArray[i] + '%' });
    }
    numberNameSprite = 1; // Numero de Sprite
    $("img.dorota-player").removeAttr('hidden'); // Mostrar Player
    $("img.dorota-player").attr('src', 'imgs/dorota-player.png');
    $("img.dorota-player-shadow").removeAttr('hidden'); // Mostrar Sobra del Player
}

//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------

// Audio
function audioPlayPause() {
    var myAudio = document.getElementById("dorota-audio");
    if (myAudio.paused) {
        myAudio.play();
        if (!myAudio.paused) {
            $("#dorota-button-audio>img").attr('src', 'imgs/dorota-button-audio-on.png');
        }
    } else {
        myAudio.pause();
        $("#dorota-button-audio>img").attr('src', 'imgs/dorota-button-audio-off.png');
    }
}

//$( document ).ready(function() { // Al iniciar el documento
$(document).on("pageinit", "#page-dorota-traveler", function() {
    //onGUI_RestartGame();
    $("div.ui-loader.ui-corner-all.ui-body-a.ui-loader-default").attr('hidden', 'true');
    // +++++++++++++++++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++++++++++++++++++++++++++
    $("#dorota-count-time").text(countTime);
    var isFirstGame = true;
    // Establecer/Llamar/HacerReferencia a todos los Obstaculos	
    obstaclesArray = $(".dorota-obstacle").toArray();

    // Para PC ===========================
    // Funcion cuando se preciona una tecla
    $(document).keydown(function(e) {
        if (e.keyCode == 38) { // Mover hacia arriba al Player
            playerDirectionMov = 1;
            //console.log("Key DOWN - Top");
        } else if (e.keyCode == 40) { // Mover hacia abajo al Player
            playerDirectionMov = -1;
            //console.log("Key DOWN - Bot");
        }
    });
    // Funcion cuando se suelta una tecla (se deja de presionar)
    $(document).keyup(function(e) {
        if ((e.keyCode == 38) || (e.keyCode == 40)) {
            playerDirectionMov = 0; // No mover hacia alguna direccion al player
            //console.log("Key UP");
        }
    });

    // +++++++++++++++++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++++++++++++++++++++++++++
    // GUI before Game ===============
    /*
    $( ".dorota-button-restart" ).mousedown(function(e) {
    	if(isFirstGame){
    		$( ".dorota-button-restart" ).attr('src', 'imgs/dorota-button-start-press.png');
    	}else{
    		$( ".dorota-button-restart" ).attr('src', 'imgs/dorota-button-ready-press.png');
    	}
    });
    $( ".dorota-button-restart" ).mouseup(function(e) {
    	if(isFirstGame){
    		$( ".dorota-button-restart" ).attr('src', 'imgs/dorota-button-start-normal.png');
    		isFirstGame = false;
    	}else{
    		$( ".dorota-button-restart" ).attr('src', 'imgs/dorota-button-ready-normal.png');
    	}
    	onGUI_RestartGame();
    });
    */
    $(function() { // or replace this with window.onload for that matter      
        $(".dorota-button-restart").on("vmousedown", function(e) {
            if (isFirstGame) {
                $(".dorota-button-restart").attr('src', 'imgs/dorota-button-start-press.png');
            } else {
                $(".dorota-button-restart").attr('src', 'imgs/dorota-button-ready-press.png');
            }
        });
        $(".dorota-button-restart").on("vmouseup", function(e) {
            if (isFirstGame) {
                $(".dorota-button-restart").attr('src', 'imgs/dorota-button-start-normal.png');
                isFirstGame = false;
            } else {
                $(".dorota-button-restart").attr('src', 'imgs/dorota-button-ready-normal.png');
            }
            onGUI_RestartGame();
        });
    });

    // Para Android ===============
    /*
	// Funcion cuando se hace click
    $( ".dorota-gui-game-zone" ).mousedown(function(e) {
	  	var posClickY = e.pageY -e.target.offsetTop, // Ubicar la posicion del Raton en pantalla
	  	    middleSizePageY = $( document ).height() / 2; // Dividir la pantalla Verticalmente
	  	if(posClickY < middleSizePageY){ // Mover hacia arriba al Player
	  		playerDirectionMov = 1;
	  		//console.log("Click Top");
	  	}else{ // Mover hacia abajo al Player
	  		playerDirectionMov = -1;
	  		//console.log("Click Bot");
	  	}

	});	
	// Funcion cuando se suelta el click
	$( ".dorota-gui-game-zone" ).mouseup(function(e) {
	  	playerDirectionMov = 0; // No mover hacia alguna direccion al player
	});
	*/
    $(function() { // or replace this with window.onload for that matter      
        $(".dorota-gui-game-zone").on("vmousedown", function(e) {
            var posClickY = e.pageY - e.target.offsetTop; // Ubicar la posicion del Raton en pantalla
            // Dividir Pantalla en 2;
            /*
            var middleSizePageY = $( document ).height() / 2; // Dividir la pantalla Verticalmente
            */
            // Dividir pantalla por posicion del player
            var dorotaPlayer = $(".dorota-player"); // Hacer referencia al Player
            var posMiddlePlayer = dorotaPlayer.position().top + dorotaPlayer.height() / 2; // player.offset().top

            if (posClickY < posMiddlePlayer) { // Mover hacia arriba al Player
                playerDirectionMov = 1;
                //console.log("Click Top");
            } else { // Mover hacia abajo al Player
                playerDirectionMov = -1;
                //console.log("Click Bot");
            }

        });
        $(".dorota-gui-game-zone").on("vmouseup", function(e) {
            playerDirectionMov = 0; // No mover hacia alguna direccion al player
        });
        $(".dorota-gui-game-zone").on("vmousecancel", function(e) {
            playerDirectionMov = 0; // No mover hacia alguna direccion al player
        });
    });
    // +++++++++++++++++++++++++++++++++++++++++++++++++
    // +++++++++++++++++++++++++++++++++++++++++++++++++
    /*
    $( "#dorota-go-page-info" ).click(function(event) {
    	$( "#page-info" ).removeAttr('hidden');
    	$( "#page-game" ).attr('hidden', 'true');
    });
    $( "#dorota-go-page-game" ).click(function(event) {
    	$( "#page-game" ).removeAttr('hidden');
    	$( "#page-info" ).attr('hidden', 'true');
    });
    */
    $(function() { // or replace this with window.onload for that matter    
        $("#dorota-go-page-info").on("tap", function(event) {
            $("#page-info").removeAttr('hidden');
            $("#page-game").attr('hidden', 'true');
        });
        $("#dorota-go-page-game").on("tap", function(event) {
            $("#page-game").removeAttr('hidden');
            $("#page-info").attr('hidden', 'true');
        });
    });
    // Audio
    var audio = document.getElementById('dorota-audio');
    audio.addEventListener('touchstart', function() { audio.play(); }, false);

    // Ejecutar musica
    //setTimeout(function() {
    //    $("#dorota-button-audio>img").click();
    //}, 1000);

});

// Forzar orientacion landscape en Movil
$.mobile.portraitOrientationVals = { "0": true, "180": true };
if ($.support.orientation) {
    var isPortraitMode = $.mobile.media("all and (orientation: portrait)"),
        orientation = window.orientation,
        portraitVal = $.mobile.portraitOrientationVals[orientation];

    if ((isPortraitMode && !portraitVal) || (!isPortraitMode && portraitVal)) {
        $.mobile.portraitOrientationVals = { "-90": true, "90": true };
    }
}

function updateOrientation() {
    if ($.support.orientation) {
        $("#orientationText").text($.mobile.portraitOrientationVals[window.orientation] ? "portrait" : "landscape");
    }
}
$(function() {
    updateOrientation();

    $(window).bind("orientationchange", function() {
        updateOrientation();
    });
});