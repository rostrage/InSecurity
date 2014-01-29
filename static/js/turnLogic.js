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
var score = 0;
function startGameLogic() {
	document.getElementById("infoArea").innerHTML=0;
	connection.on('open', function() {
		connection.on('data', function(data) {
			if(data=="gameover") {
				gameOver("Defender ran out of spaces to move to!");
			}
			if(playerType=="attacker") {
				score = data.score;
				if(data.results.attackSuccess) {
					//remove all links to a destroyed node
					if(levelLayout.nodes[myCoords].isDestructible) {
						for(var index in levelLayout.edges) {
							if(levelLayout.edges[index].indexOf(myCoords*1)>-1) {
								levelLayout.edges[index].splice(levelLayout.edges[index].indexOf(myCoords*1),1);
							}
						}
					}
					levelLayout.nodes[myCoords*1].isDisabled=true;
				}
				var isOnSameSpot = (myCoords == defenderMoves[defenderMoves.length-1]);
				if(data.results.attackerCaught && !isOnSameSpot) {
					gameOver("You were exposed!");
				}
				if(data.results.attackerCaught) {
					gameOver("You were caught!");
				}
				if(levelLayout.edges[myCoords].length==0) {
					gameOver("You ran out of spaces to move to!");
				}
				attackerMoves = data.attackerMoves;
				defenderMoves = data.defenderMoves;
				if(attackerMoves[attackerMoves.length-1].isAttacking) {
					$.notify("Attack Failed");
				}
				document.getElementById("infoArea").innerHTML++;
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
	if(levelLayout.nodes[myCoords].isDisabled) isAttacking = false;
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
	var isOnSameSpot = (myCoords == attackerMoves[attackerMoves.length-1].coords);
	var resolution = {
		"attackerMoves" : attackerMoves,
		"defenderMoves" : defenderMoves,
		"results" : {
			"attackSuccess" : (Math.random()*255<levelLayout.nodes[attackerMoves[attackerMoves.length-1].coords].attackerSuccessChance && attackerMoves[attackerMoves.length-1].isAttacking),
			"attackerCaught" : ((Math.random()*255<levelLayout.nodes[myCoords].attackerCaughtWithDefender) && isOnSameSpot) || (Math.random()*255<levelLayout.nodes[myCoords].attackerCaughtWithoutDefender &&attackerMoves[attackerMoves.length-1].isAttacking)
		}
	};
	if(resolution.results.attackSuccess) {
		score+=levelLayout.nodes[attackerMoves[attackerMoves.length-1].coords].value;
		//remove all links to a destroyed node
		if(levelLayout.nodes[myCoords].isDestructible) {
			for(var index in levelLayout.edges) {
				if(levelLayout.edges[index].indexOf(myCoords*1)>-1) {
					levelLayout.edges[index].splice(levelLayout.edges[index].indexOf(myCoords*1),1);
				}
			}
		}
		levelLayout.nodes[attackerMoves[attackerMoves.length-1].coords].isDisabled=true;
	}
	resolution.score=score;
	connection.send(resolution);
	if(levelLayout.edges[myCoords].length==0) {
		connection.send("gameover");
		gameOver("You ran out of spaces to move to!");
	}
	if(resolution.results.attackerCaught && !isOnSameSpot) {
		gameOver("The attacker was exposed!");
	}
	if(resolution.results.attackerCaught) {
		gameOver("You caught the attacker");
	}
	if(levelLayout.edges[myCoords].length==0) {
		gameOver("You ran out of spaces to move to!");
	}
	defenderMoved=false;
	attackerMoved=false;
	document.getElementById("infoArea").innerHTML++;
}

function gameOver(reason) {
	console.log("Game Over!");
	var gameState = {
		"defender" : defenderMoves,
		"attacker" : attackerMoves,
		"points" : score,
		"endCondition" : reason
	};
	if(playerType=="defender") {
		$.post('/api/defender', gameState, function(data) {
			gameState.playerType = "Defender";
			window.location = window.location.origin+'/gameover.html#'+encodeURI(JSON.stringify(gameState));
		});
	}
	else {
		gameState.playerType = "Attacker";
		window.location = window.location.origin+'/gameover.html#'+encodeURI(JSON.stringify(gameState));
	}
}
