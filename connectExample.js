var http = require('http');
var connect = require('connect');

var app = connect();

function profile(req, res){
	res.writeHead(200, {"Context-type": "text/plain"});
	res.write("profile requested");
	res.end();	
}

function about(req, res){
	res.writeHead(200, {"Context-type": "text/plain"});
	res.write("about");
	res.end();
}

app.use('/about', about);
app.use('/profile', profile);

http.createServer(app).listen(8888);