var settings = require('../settings');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;


module.exports = new Db(settings.db_name, new Server(settings.db_host, settings.db_port, {auto_reconnect:true}), {w: 1});
 
/*var db = new Db(db_name, new Server(db_host, db_port, {}), {w: 1});
 
function testMongo(req, res) {
  function test(err, collection) {
    collection.insert({a: 1}, function(err, docs) {
      if (err) {
        console.log(err);
        res.end('insert error');
        return;
      }
      collection.count(function(err, count) {
        if (err) {
          console.log(err);
          res.end('count error');
          return;
        } 
        res.end('count: ' + count + '\n');
        db.close(); 
      });
    });  
  }
 
  db.open(function(err, db) {
    db.authenticate(username, password, function(err, result) { 
      if (err) {
        db.close();
        res.end('Authenticate failed!');
        return;   
      }
      db.collection('test_insert', test); 
    });  
  });
}*/
 
//module.exports = testMongo;
//module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}));  


