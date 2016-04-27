var express = require('express');
var fs = require('fs');
var app = express();
var mongoose = require('mongoose');

var multiparty = require('multiparty');

mongoose.connect("mongodb://localhost/UsersDB", function(err){
	if (err){
		console.log(err);
	} else {
		console.log('Connection Successful');
	}
});

var userSchema = new mongoose.Schema({
	name: String,
	phone: Number,
	imagePath: String
});

var User = mongoose.model('User', userSchema);



app.get('/', function(req, res){
	User.find(function(err, users){
		if (err){
			console.log(err);
		} else{
			res.send(users);
		}

	});
})

app.get('/getUserData/:id', function(req, res){
	
	User.findOne({'_id': req.params.id}, function(err, user){
		if (err){
			console.log(err);
		} else{
			res.send(user)
		}
	});
});

app.get('/getUserImage/:id', function(req, res){

	User.findOne({'_id': req.params.id}, function(err, user){
		//console.log("Path is: " + user[0]);
		if (err){
			console.log(err);
		} else{
			fs.readFile(user.imagePath, function (err, content) {

            if (err) {
                res.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                res.end("No such image");    
            } else {
                res.writeHead(200,{'Content-type':'image/png'});
                res.end(content);
            }
        });
		}
	});

	
});

app.post('/', function(req, res){

	var id, number, path;

	var form = new multiparty.Form();
	form.on('field', function(name, value){
		res.statusCode = 200;
		res.write(name + ": "+ value+"\n");
		if (name === "Name"){
			id = value;
		} else if(name === "Phone"){
			number = value
		}
	});

	form.on('part', function(part){
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
		path = file.path;
		console.log("written to: " + path);
	});

	form.on('close', function() {
  		console.log('Upload completed!');
  		if (id != undefined && number != undefined){
  			console.log("exec");
  			//users.push({name: id, phone: number, imagePath: path});
  			var newUser = new User({
  				'name': id,
  				'phone': number,
  				'imagePath': path
  			});
  			newUser.save(function(err, newUser){
  				if (err){
  					console.log("Error adding to database");
  				} else{
  					console.log("Added to database.");
  				}
  			})
  		}


  		res.end('Received data\n');
  	});

  	form.on('error', function(err){
  		console.log(err);
  	})
  	form.parse(req);

});

app.listen(process.env.PORT || 8888);



