var http = require('http');

function onRequest(req, res){
	res.writeHead(200, {"Context-type": "text/plain"});
	res.write("Hello, this is a message from the server");
	res.end();	
}

http.createServer(onRequest).listen(8888);
console.log("Server running, press ^C to stop...");