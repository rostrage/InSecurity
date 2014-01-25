var connection;
function chooseAttacker() {
	console.log("chooseAttacker");
	var peer = new Peer({key: 'lwjd5qra8257b9'});	
	peer.on('open', function(id) {
		console.log("peer connection open");
		var socket = io.connect();
		socket.on('connect', function() {
			console.log("I connected");
			socket.emit('chooseAttacker', id);
		});
		socket.on('foundPartner', function(id) {
			console.log("Connecting to defender");
			peer.connect(id);	
		});
	});
	peer.on('connection', function(conn) {
		initGame("attacker", conn);
	});
};

function chooseDefender() {
	console.log("chooseDefender");
	var peer = new Peer({key: 'lwjd5qra8257b9'});
	peer.on('open', function(id) {
		console.log("peer connection open");
		var socket = io.connect();
		socket.on('connect', function() {
			console.log("i connected");
			socket.emit('chooseDefender', id);
		});
		socket.on('foundPartner', function(id) {
			console.log("Connecting to attacker");
			peer.connect(id);
		});
	});
	peer.on('connection', function(conn) {
		connection = conn;
		initGame("defender");
	});
};
