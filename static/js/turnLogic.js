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
var score;
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
	var resolution = {
		"attackerMoves" : attackerMoves,
		"defenderMoves" : defenderMoves,
		"results" : {
			"attackSuccess" : (Math.random*255>levelLayout.nodes[attackerMoves[attackerMoves.length-1].coords] && attackerMoves[attackerMoves.length-1].isAttacking),
			"attackerCaught" : ((Math.random*255>levelLayout.nodes[myCoords].attackerCaughtWithDefender) && isOnSameSpot) || (Math.random*255>levelLayout.nodes[myCoords].attackerCaughtWithoutDefender)
		}
	};
	connection.send(resolution);
	if(resolution.results.attackSuccess) {
		score+=levelLayout.nodes[myCoords].value;
		//remove all links to a destroyed node
		for(var index in levelLayout.edges) {
			levelLayout.edges[index] = levelLayout.edges[index].indexOf(myCoords*1)<0 ? levelLayout.edges[index] : levelLayout.edges[index].splice(levelLayout.edges[index].indexOf(myCoords*1),1);
		}
	}
	defenderMoved=false;
	attackerMoved=false;
	document.getElementById("infoArea").innerText++;
}
