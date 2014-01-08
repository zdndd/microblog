var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
//var MongoStore = require('connect-mongo')(express);//注意：后面有(express)  
var MemoryStore = require('express/node_modules/connect/lib/middleware/session/memory');
var flash = require('connect-flash');
var settings = require('./settings');

var storeMemory = new MemoryStore({
    reapInterval: 60000 * 10
  });


var app = express();

// all environments
app.set('port', 18080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// connect mongodb
app.use(express.cookieParser());  
app.use(express.session({   
      secret: settings.cookieSecret,
      store: storeMemory  
}));
//app.dynamicHelpers
app.use(function(req,res,next){
  res.locals.headers = req.headers;
  var error = req.flash('error');
  var success = req.flash('success');
  res.locals.user = req.session.user;
  res.locals.error = error.length ? error : null;
  res.locals.success = success ? success : null;
  next();
});
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



routes(app);