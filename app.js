var express = require('express');
var api = require('./routes/api');
var user = require('./routes/user');
var photo = require('./routes/photo');
var sheet = require('./routes/sheet');
var like = require('./routes/like');
var error = require('./routes/error');
var http = require('http');
var path = require('path');
var db = require('./models/db');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('photosPublicDir', 'photos')
app.set('photosFullDir', path.join(__dirname, 'public',
    app.get('photosPublicDir')));

// TODO: Fix favicon
app.use(express.favicon());

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(error.notfound);
app.use(error.internalError);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if (process.env.ERROR_ROUTE) {
  app.get('/dev/error', function(req, res, next){
    var err = new Error('database connection failed');
    err.type = 'database';
    next(err);
  });
}

app.get('/upload', photo.form);
app.post('/api/users', user.create);
app.post('/api/sheet', api.auth, sheet.create);
app.get('/api/sheet/:id', api.auth, sheet.read);
app.get('/api/sheet/:id/likes', api.auth, like.read);
app.post('/api/sheet/:id/likes', api.auth, like.create);
app.get('/api/photos', api.auth, photo.random);
app.post('/api/photos', api.auth, photo.create(app.get('photosFullDir'), app.get('photosPublicDir')));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
