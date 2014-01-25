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
var gMoveCount;
var gMoveCountElem;

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
    x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);
    var cell = new Cell(Math.floor(y/kPieceHeight), Math.floor(x/kPieceWidth));
    return cell;
}

function halmaOnClick(e) {
    var cell = getCursorPosition(e);
    clickOnEmptyCell(cell);
}

function clickOnEmptyCell(cell) {
	if(((playerType=="attacker") && canMove) || ((playerType=="defender") && !defenderMoved))
	{
		gPiece.row = cell.row;
		gPiece.column = cell.column;
		gSelectedPieceHasMoved = false;
		drawBoard();
		if(playerType=="defender") {
			console.log("Defending a space");
			//convert the coordinates into a single number which is the UID of the space
			defendSpace(cell.row+cell.column*kBoardWidth);
		}
		else {
			console.log("Attacking a space");
			attackSpace(cell.row+cell.column*kBoardWidth, true);
		}
		return;
	}
}

function drawBoard() {

    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);

    gDrawingContext.beginPath();
    
    /* vertical lines */
    for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
	gDrawingContext.moveTo(0.5 + x, 0);
	gDrawingContext.lineTo(0.5 + x, kPixelHeight);
    }
    
    /* horizontal lines */
    for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
	gDrawingContext.moveTo(0, 0.5 + y);
	gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
    }
    
    /* draw it! */
    gDrawingContext.strokeStyle = "#ccc";
    gDrawingContext.stroke();
    
	drawPiece(gPiece, false);

    gMoveCountElem.innerHTML = gMoveCount;

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
    gPiece = new Cell(Math.floor(kBoardHeight/2), Math.floor(kBoardWidth/2));
    gMoveCount = 0;
    drawBoard();
}

function initGame(canvasElement, moveCountElement) {
    if (!canvasElement) {
        canvasElement = document.createElement("canvas");
	canvasElement.id = "halma_canvas";
	document.body.appendChild(canvasElement);
    }
    if (!moveCountElement) {
        moveCountElement = document.createElement("p");
	document.body.appendChild(moveCountElement);
    }
    gCanvasElement = canvasElement;
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
    gCanvasElement.addEventListener("click", halmaOnClick, false);
    gMoveCountElem = moveCountElement;
    gDrawingContext = gCanvasElement.getContext("2d");
	newGame();
}
