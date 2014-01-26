var turn=0;
var attackerMoved=false;
var defenderMoved=false;
var canMove=true;
var myCoords=0;
var playerType;
var connection;
var peer;
var defenderMoves = [];
var attackerMoves = [];
function startGameLogic() {
	console.log("About to listen for connection open.");
	document.getElementById("infoArea").innerText=0;
	connection.on('open', function() {
		console.log("Opened connection with other player.");
		connection.on('data', function(data) {
			console.log(data);
			if(playerType=="attacker") {
				attackerMoves = data.attackerMoves;
				defenderMoves = data.defenderMoves;
				document.getElementById("infoArea").innerText++;
				canMove=true;
			}
			else {
				attackerMoved=true;
				attackerMoves.push(data);
				if(defenderMoved) {
					resolveConflict();
				}
			}
			drawBoard();
		});
	});
};

function attackSpace(coords, isAttacking) {
	myCoords=coords;
	connection.send({"coords" : coords, "isAttacking" : isAttacking});
	canMove=false;
}

function defendSpace(coords) {
	myCoords = coords;
	defenderMoved = true;
	if(attackerMoved) {
		resolveConflict();
	}
	defenderMoves.push({
		"coords" : coords,
	});
}

function resolveConflict() {
	console.log("Resolving conflict");
	var isOnSameSpot = (myCoords == attackerMoves[attackerMoves.length-1]);
	connection.send({
		"attackerMoves" : attackerMoves,
		"defenderMoves" : defenderMoves,
		"results" : {
			"attackSuccess" : (Math.random*256>levelLayout.nodes[attackerMoves[attackerMoves.length-1].coords] && attackerMoves[attackerMoves.length-1].isAttacking),
			"attackerCaught" : ((Math.random*256>levelLayout.nodes[myCoords].attackerCaughtWithDefender) && isOnSameSpot) || (Math.random*256>levelLayout.nodes[myCoords].attackerCaughtWithoutDefender)
		}
	});
	defenderMoved=false;
	attackerMoved=false;
	document.getElementById("infoArea").innerText++;
}
