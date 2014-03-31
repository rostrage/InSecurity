var canvasBack = document.getElementById("gameArea"),
ctxB = canvasBack.getContext("2d");

var background = new Image();
background.src = "img/2-green-grass.jpg";

// Make sure the image is loaded first otherwise nothing will draw.
background.onload = function(){
	ctxB.drawImage(background,0,0);   
}