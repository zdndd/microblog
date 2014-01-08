var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
/*数据库连接信息host,port,user,pwd*/
var db_name = 'fWGaGFyOOWRGrwcXkKaD';                  // 数据库名，从云平台获取
var db_host =  'mongo.duapp.com';      // 数据库地址
var db_port =  '8908';   // 数据库端口
var username = 'lyyflUq8eBBPyDhlbz803f4V';                 // 用户名（API KEY）
var password = 'P68ko70GvcCW0r6DDkgFfojj8KgPRjHA';                 // 密码(Secret KEY)
 
var db = new Db(db_name, new Server(db_host, db_port, {auto_reconnect:true}), {w: 1});
 
function testMongo(req, res) {
  var user = {
      name: "super della",
      password: "this.password",
      email: "this.email"
  };

  function test(err, collection) {
      /*collection.insert(user, function(err, docs) {
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
          res.end('count: ' + count + '\n' + user.name);
          db.close(); 
        });
      });  */


      //查找用户名 name 值为 name文档
      collection.findOne({
        name: "super della"
      },function(err, doc){
        db.close();
        res.end('doc: ' + doc.name);
      });





  }  //test end



 
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
}

 
module.exports = testMongo;
