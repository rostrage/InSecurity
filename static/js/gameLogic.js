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
	  return {"index" : index, "isAttacking" : x>curNode.position.x};
	}
    }
    return null;
}

function halmaOnClick(e) {
    var cell = getCursorPosition(e);
    clickOnEmptyCell(cell);
}

function clickOnEmptyCell(cell) {
	if(cell!=null && levelLayout.edges[myCoords].indexOf(cell.index*1)!=-1 && (((playerType=="attacker") && canMove) || ((playerType=="defender") && !defenderMoved)))
	{
		if(playerType=="defender") {
			//convert the coordinates into a single number which is the UID of the space
			defendSpace(cell.index);
		}
		else {
			attackSpace(cell.index, cell.isAttacking);
		}
		drawBoard();
		return;
	}
	else if(levelLayout.edges[myCoords].indexOf(cell.index*1)==-1) {
		$.notify("You can't go there!");
	}
	else if(cell!=null) {
		console.log("Notifying!");
		$.notify('You are waiting on the other player!');
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
		gDrawingContext.moveTo(curNode.position.x,curNode.position.y-curNode.value);
		gDrawingContext.lineTo(curNode.position.x-2*curNode.value/Math.sqrt(3),curNode.position.y+curNode.value);
		gDrawingContext.lineTo(curNode.position.x+2*curNode.value/Math.sqrt(3),curNode.position.y+curNode.value);
	}
	gDrawingContext.closePath();
	if(playerType=="defender") {
	    gDrawingContext.strokeStyle = "rgba("+curNode.attackerCaughtWithDefender+",0,0,"+.5*(1+(levelLayout.edges[myCoords].indexOf(index*1)>-1))+")";
	    gDrawingContext.fillStyle = "rgba("+curNode.attackerCaughtWithDefender+",0,0,"+.5*(1+(levelLayout.edges[myCoords].indexOf(index*1)>-1))+")";
	}
	else {
	    gDrawingContext.strokeStyle = "rgba(0,0,0,"+.5*(1+(levelLayout.edges[myCoords].indexOf(index*1)>-1))+")";
	    gDrawingContext.fillStyle = "rgba(0,0,0,"+.5*(1+(levelLayout.edges[myCoords].indexOf(index*1)>-1))+")";
	}
	    gDrawingContext.stroke();
	if(!curNode.isDisabled) {
		gDrawingContext.fill();
	}
	if(playerType=="attacker") {
		gDrawingContext.beginPath();
		gDrawingContext.moveTo(curNode.position.x,curNode.position.y+curNode.value);
		gDrawingContext.lineTo(curNode.position.x,curNode.position.y-curNode.value);
		gDrawingContext.closePath();
		gDrawingContext.strokeStyle="#FFF";
		gDrawingContext.stroke();
	}
    }

	gDrawingContext.strokeStyle="#000";
    for (var ii in levelLayout.edges) {
    	for (var jj in levelLayout.edges[ii]) {
		gDrawingContext.beginPath();
		gDrawingContext.moveTo(levelLayout.nodes[ii].position.x,levelLayout.nodes[ii].position.y);
		gDrawingContext.lineTo(levelLayout.nodes[levelLayout.edges[ii][jj]].position.x,levelLayout.nodes[levelLayout.edges[ii][jj]].position.y);
		gDrawingContext.closePath();
		gDrawingContext.stroke();
	}
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
    gCanvasElement.style.display="inherit";
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
    gCanvasElement.addEventListener("click", halmaOnClick, false);
    gDrawingContext = gCanvasElement.getContext("2d");

	newGame();
}
