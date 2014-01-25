var turn=0;
var attackerMoved=false;
var defenderMoved=false;
var canMove=true;
var myCoords=0;
function initGame(playerType) {
	connection.on('open', function() {
		console.log("Opened connection with other player.");
		connection.on('data', function(data) {
			if(playerType==attacker) {
				canMove=true;
				if(attackSuccess) //you win
				if(attackerCaught) //you lose
			}
			else {
				attackerMoved=true;
				if(defenderMoved) {
					resolveConflict();
				}
			}
		});
	});
};

function attackSpace(coords, isAttacking) {
	myCoords=coords;
	connection.send({"coords" : coords", "isAttacking" : isAttacking});
	canMove=false;
}

function defendSpace(coords) {
	myCoords = coords;
	defenderMoved = true;
}

function resolveConflict() {
	connection.send({"attackSuccess" : false, "attackerCaught" : false"});
	defenderMove=false;
	attackerMoved=false;
}
