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
			console.log("Got data");
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
	connection.send({
		"attackerMoves" : attackerMoves,
		"defenderMoves" : defenderMoves,
		"results" : {
			"attackSuccess" : false,
			 "attackerCaught" : false
		}
	});
	defenderMoved=false;
	attackerMoved=false;
	document.getElementById("infoArea").innerText++;
}
