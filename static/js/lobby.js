function chooseAttacker() {
	console.log("chooseAttacker");
	document.getElementById("infoArea").innerHTML="Searching for partner...";
	document.getElementById("playerInfo").innerHTML = "Attacker";
	peer = createPeer();
	peer.on('open', function(id) {
		var socket = io.connect();
		socket.on('connect', function() {
			socket.emit('chooseAttacker', id, window.location.pathname);
		});
	});
	peer.on('connection', function(conn) {
		connection = conn;
		playerType="attacker";
		initGame(document.getElementById('gameArea'));
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
	document.getElementById("infoArea").innerHTML="Searching for partner...";
	document.getElementById("playerInfo").innerHTML = "Defender";
	peer = createPeer();
	peer.on('open', function(id) {
		var socket = io.connect();
		socket.on('connect', function() {
			console.log("Defender connected to lobby");
			socket.emit('chooseDefender', id, window.location.pathname);
		});
		socket.on('foundPartner', function(id) {
			console.log("Connecting to: " + id);
			connection = peer.connect(id);
			playerType = "defender";
			initGame(document.getElementById("gameArea"));
			startGameLogic();
		});
	});
}
function createPeer() {
  peer = new Peer({
    key: 'afb1ctzmpbricnmi',
    config: {
      'iceServers': [
        {
          url: 'stun:stun.l.google.com:19302'
        },
        {
          url: 'turn:test@butterflysmack.com:3478',
          credential: '1234'
        }
      ]
    }
  });
  return peer;
}
