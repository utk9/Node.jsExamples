var fs = require('fs');

fs.writeFile("file.txt", "Hello World", function(){
	console.log("Written to file.")
})