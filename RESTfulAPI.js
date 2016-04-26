var express = require('express');
var app = express();

var multiparty = require('multiparty');

//app.use(express.bodyParser());

var users = [
	{ name: 'John', phone: 12345},
	{ name: 'Kelly', phone: 12346} 

];

app.get('/', function(req, res){
	res.json(users);
})

app.get('/users/:id', function(req, res){
	res.json(users[req.params.id]);
})



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

	form.on('close', function() {
  		console.log('Upload completed!');
  		if (id != undefined && number != undefined){
  			users.push({name: id, phone: number});
  		}
  		res.end('Received data\n');
  		res.send();
  	});

  	form.on('error', function(err){
  		console.log(err);
  	})
  	form.parse(req);

});

app.listen(process.env.PORT || 8888);