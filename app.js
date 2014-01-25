var express=require('express'),
app = express();

app.use(express.static(__dirname+"/static"));
app.use(app.router);

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

app.listen(3005);

