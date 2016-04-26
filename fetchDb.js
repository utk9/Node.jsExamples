var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/Persons';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // Get the documents collection
    var collection = db.collection('users');

    var cursor = collection.find({name: 'modulus user'});

    retrieve(cursor, function(){
      db.close();
    })
      
      
    }
    });
function retrieve(cursor, cb){
  cursor.each(function(err, doc){
      if (err) {
        console.log(err);
      } else{
        console.log("Fetched: ", doc);
      }
    });
}

