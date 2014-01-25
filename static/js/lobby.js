function chooseAttacker() {
	console.log("chooseAttacker");
	document.getElementById("infoArea").innerText="Searching for partner...";
	peer = new Peer({key: 'afb1ctzmpbricnmi'});	
	peer.on('open', function(id) {
		console.log("My ID: " + id);
		var socket = io.connect();
		socket.on('connect', function() {
			console.log("I connected");
			socket.emit('chooseAttacker', id);
		});
	});
	peer.on('connection', function(conn) {
		console.log("Got connection");
		connection = conn;
		playerType="attacker";
		initGame(null);
		startGameLogic();
		connection.on('error', function(err) {
			console.err(err);
		});
		connection.on('close', function() {
			console.log("Connection closed");
		});
	});
}
function chooseDefender() {
	console.log("chooseDefender");
	document.getElementById("infoArea").innerText="Searching for partner...";
	peer = new Peer({key: 'afb1ctzmpbricnmi'});
	peer.on('open', function(id) {
		console.log("My ID: " + id);
		var socket = io.connect();
		socket.on('connect', function() {
			console.log("i connected");
			socket.emit('chooseDefender', id);
		});
		socket.on('foundPartner', function(id) {
			console.log("Connecting to: " + id);
			connection = peer.connect(id);
			playerType = "defender";
			initGame(null);
			startGameLogic();
		});
	});
}
