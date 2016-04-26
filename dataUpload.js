var multiparty = require('multiparty');
var http = require('http');
var util = require('util');


function onRequest(req, res){

	if (req.method == "POST"){
		console.log(req.method);
		var data = new multiparty.Form();
		data.parse(req, function(err, fields, files){
			res.writeHead(200, {"Content-Type": "text/html"});
			res.write('received data: \n');

			res.end(util.inspect({fields: fields, files: files}));
		});
	} else{
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.end("That was a GET request.")
	}
	
}

http.createServer(onRequest).listen(8888);