var express=require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
mongojs = require('mongojs'),
db = mongojs("InSecurity", ['defender', 'attacker']);
console.log("test");

app.use(express.static(__dirname+"/static"));
app.use(express.bodyParser());
app.use(app.router);

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

app.post('/api/attacker', function(req, res) {
	db.collection('attacker').find(req.params, function(err, docs) {
		if(docs.length==0) {
			req.params.frequency = 1;
			db.collection('attacker').save(req.params);
		}
		else {
			db.collection('attacker').update(req.params, {$inc : {"frequency" : 1}});
		}
	});
	res.send(200);
});

app.post('/api/defender', function(req, res) {
	db.collection('defender').find(req.body, function(err, docs) {
		if(docs.length==0) {
			req.body.frequency = 1;
			db.collection('defender').save(req.body);
		}
		else {
			db.collection('defender').update(req.body, {$inc : {"frequency" : 1}});
		}
	});
	res.send(200);
});

var attackers = {};
var defenders = {};
io.sockets.on('connection',  function(socket) {
	console.log("Someone connected");
	socket.on('chooseDefender', function(id, room) {
		console.log("Someone choose a defender");
		if(attackers[room] && attackers[room].length!=0) {
			var attacker = attackers[room].pop();
			socket.emit("foundPartner", attacker.id);
		}
		else {
			if(!defenders[room]) defenders[room] = [];
			defenders[room].push({"id" : id, "connection" : socket});
		}
	});
	socket.on('chooseAttacker', function(id, room) {
		console.log("Someone choose an attacker");
		//if there are already defenders, send both players the other players id
		if(defenders[room] && defenders[room].length!=0) {
			var defender = defenders[room].pop();
			defender.connection.emit("foundPartner", id);
		}
		//otherwise add them to a waiting list
		else {
			if(!attackers[room]) attackers[room]=[];
			attackers[room].push({"id" : id, "connection" : socket});
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

server.listen(3002);

