var kBoardWidth = 9;
var kBoardHeight= 9;
var kPieceWidth = 50;
var kPieceHeight= 50;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);

var gCanvasElement;
var gDrawingContext;
var gPattern;

var gPiece;
var levelLayout;
function Cell(row, column) {
    this.row = row;
    this.column = column;
}

function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    for(var index in levelLayout.nodes) {
	var curNode = levelLayout.nodes[index];
	var dist = Math.sqrt(Math.pow((curNode.position.x-x),2)+ Math.pow(curNode.position.y-y,2));
	if(dist<curNode.value) {
	  return index;
	}
    }
    return null;
}

function halmaOnClick(e) {
    var cell = getCursorPosition(e);
    clickOnEmptyCell(cell);
}

function clickOnEmptyCell(cell) {
	if(cell!=null && ((playerType=="attacker") && canMove) || ((playerType=="defender") && !defenderMoved) &&levelLayout.edges[myCoords].indexOf(cell*1)!=-1)
	{
		if(playerType=="defender") {
			console.log("Defending a space");
			//convert the coordinates into a single number which is the UID of the space
			defendSpace(cell);
		}
		else {
			console.log("Attacking a space");
			attackSpace(cell, true);
		}
		drawBoard();
		return;
	}
}

function drawBoard() {
	
    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);

    
    for (var index in levelLayout.nodes) {
	var curNode = levelLayout.nodes[index];
	gDrawingContext.beginPath();
	if(index!=myCoords) {
		gDrawingContext.arc(curNode.position.x,curNode.position.y, curNode.value, 0, Math.PI*2, false);
	}
	else {
		gDrawingContext.moveTo(curNode.position.x,curNode.position.y);
		gDrawingContext.lineTo(curNode.position.x+curNode.value,curNode.position.y);
		gDrawingContext.lineTo(curNode.position.x+curNode.value/2,curNode.position.y+curNode.value/2);
		gDrawingContext.lineTo(curNode.position.x, curNode.position.y);
	}
	gDrawingContext.closePath();
	console.log(1+(levelLayout.edges[myCoords].indexOf(index*1)>-1));
	if(playerType=="defender") {
		console.log(128*(1+(levelLayout.edges[myCoords].indexOf(index*1)>0)));
	    gDrawingContext.strokeStyle = "rgba("+curNode.attackerCaughtWithDefender+",0,0,"+.5*(1+(levelLayout.edges[myCoords].indexOf(index*1)>-1))+")";
	    gDrawingContext.fillStyle = "rgba("+curNode.attackerCaughtWithDefender+",0,0,"+.5*(1+(levelLayout.edges[myCoords].indexOf(index*1)>-1))+")";
	  console.log(gDrawingContext.fillStyle);
	}
	else {
	    gDrawingContext.strokeStyle = "rgba(0,0,0,"+.5*(1+(levelLayout.edges[myCoords].indexOf(index*1)>-1))+")";
	    gDrawingContext.fillStyle = "rgba(0,0,0,"+.5*(1+(levelLayout.edges[myCoords].indexOf(index*1)>-1))+")";
	}
	    gDrawingContext.stroke();
	gDrawingContext.fill();
    }
    if(!canMove || (defenderMoved&&!attackerMoved)) {
	gDrawingContext.fillText("Waiting on other player!", 20, 10);
	}
    
    

}

function drawPiece(p, selected) {
    var column = p.column;
    var row = p.row;
    var x = (column * kPieceWidth) + (kPieceWidth/2);
    var y = (row * kPieceHeight) + (kPieceHeight/2);
    var radius = (kPieceWidth/2) - (kPieceWidth/10);
    gDrawingContext.beginPath();
    gDrawingContext.arc(x, y, radius, 0, Math.PI*2, false);
    gDrawingContext.closePath();
    gDrawingContext.strokeStyle = "#000";
    gDrawingContext.stroke();
    if (selected) {
	gDrawingContext.fillStyle = "#000";
	gDrawingContext.fill();
    }
}

function newGame() {
    
    drawBoard();
}

function initGame(canvasElement) {
    myCoords = Math.floor(10*Math.random());
    if (!canvasElement) {
        canvasElement = document.createElement("canvas");
	canvasElement.id = "halma_canvas";
	document.body.appendChild(canvasElement);
    }
    gCanvasElement = canvasElement;
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
    gCanvasElement.addEventListener("click", halmaOnClick, false);
    gDrawingContext = gCanvasElement.getContext("2d");

    $.getJSON('/js/level1.json', function (data) {
	console.log("Got json!");
	console.log(data);
	levelLayout=data;
	newGame();
	});
}
