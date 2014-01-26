function chooseAttacker() {
	console.log("chooseAttacker");
	document.getElementById("infoArea").innerText="Searching for partner...";
	peer = new Peer({
		key: 'afb1ctzmpbricnmi',
		 config: {
			'iceServers': [
    				{ url: 'stun:stun.l.google.com:19302' },
    				{ url: 'turn:test@butterflysmack.com:3478', credential: '1234' }
		  	]
		},
		debug : 3
	});	
	peer.on('open', function(id) {
		console.log("My ID: " + id);
		var socket = io.connect();
		socket.on('connect', function() {
			console.log("Attacker connected to lobby");
			socket.emit('chooseAttacker', id);
		});
	});
	peer.on('connection', function(conn) {
		console.log("Attacker got  peer connection");
		connection = conn;
		playerType="attacker";
		initGame(null);
		startGameLogic();
		connection.on('error', function(err) {
			console.log(err);
		});
		connection.on('close', function() {
			console.log("Connection closed");
		});
	});
}
function chooseDefender() {
	console.log("chooseDefender");
	document.getElementById("infoArea").innerText="Searching for partner...";
	peer = new Peer({key: 'afb1ctzmpbricnmi',config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'turn:test@butterflysmack.com:3478', credential: '1234' }
  ]}, "debug" : 3});
	peer.on('open', function(id) {
		console.log("My ID: " + id);
		var socket = io.connect();
		socket.on('connect', function() {
			console.log("Defender connected to lobby");
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
