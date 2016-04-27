var express = require('express');
var fs = require('fs');
var app = express();

var multiparty = require('multiparty');

//app.use(express.bodyParser());

var users = [
	{ name: 'John', phone: 12345},
	{ name: 'Kelly', phone: 12346} 

];

var filePath;

app.get('/', function(req, res){
	res.json(users);
})

app.get('/users/:id', function(req, res){
	res.json(users[req.params.id]);
});

app.get('/getImage/:id', function(req, res){
	fs.readFile(filePath, function (err, content) {
            if (err) {
                res.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                res.end("No such image");    
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200,{'Content-type':'image/png'});
                res.end(content);
            }
        });
});



app.post('/', function(req, res){

	var id, number;

	var form = new multiparty.Form();
	form.on('field', function(name, value){
		console.log('inside form.on(feild)');
		res.statusCode = 200;
		res.write(name + ": "+ value+"\n");
		if (name === "Name"){
			id = value;
		} else if(name === "Phone"){
			number = value
		}
	});

	form.on('part', function(part){
		console.log('inside form.on(part)');
		if (!part.filename){
			part.resume();
		}
		else {
			res.write("file incoming\n");
			part.resume();
		}
		
	});

	form.on('file', function(name, file){
		console.log('eyy, its a file');
		filePath = file.path;
		console.log("written to: " + filePath);
	});

	form.on('close', function() {
  		console.log('Upload completed!');
  		if (id != undefined && number != undefined){
  			users.push({name: id, phone: number});
  		}
  		res.end('Received data\n');
  	});

  	form.on('error', function(err){
  		console.log(err);
  	})
  	form.parse(req);

});

app.listen(process.env.PORT || 8888);