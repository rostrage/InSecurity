var express=require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);
console.log("test");

app.use(express.static(__dirname+"/static"));
app.use(app.router);

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

var attackers = [];
var defenders = [];
io.sockets.on('connection',  function(socket) {
	console.log("Someone connected");
	socket.on('chooseDefender', function(id) {
		console.log("Someone choose a defender");
		if(attackers.length!=0) {
			var attacker = attackers.pop();
			socket.emit("foundPartner", attacker.id);
		}
		else {
			defenders.push({"id" : id, "connection" : socket});
		}
	});
	socket.on('chooseAttacker', function(id, connnectedEvent) {
		console.log("Someone choose an attacker");
		//if there are already defenders, send both players the other players id
		if(defenders.length!=0) {
			var defender = defenders.pop();
			defender.connection.emit("foundPartner", id);
		}
		//otherwise add them to a waiting list
		else {
			attackers.push({"id" : id, "connection" : socket});
		}
	});
	socket.on('disconnect', function() {
		//remove any people who disconnect before finding a partner
		for(var i=0; i<defenders.length; i++) {
			if(defenders[i].connection===socket) {
				defenders.splice(i,1);
			}
		}
		for(var i=0; i<attackers.length; i++) {
			if(attackers[i].connection===socket) {
				attackers.splice(i,1);
			}
		}
	});
});

server.listen(3000);

