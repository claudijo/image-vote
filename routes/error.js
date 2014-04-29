exports.notfound = function(req, res){
  res.status(404).format({
    html: function(){
      res.render('errors/404', {
        title: '404 Not Found'
      });
    },
    json: function(){
      res.json(404, { message: 'Resource not found' });
    },
    xml: function() {
      res.write('<error>\n');
      res.write('  <message>Resource not found</message>\n');
      res.end('</error>\n');
    },
    text: function(){
      res.send('Resource not found\n');
    }
  });
};

exports.internalError = function(err, req, res, next) {
  console.error(err.stack);
  var msg;

  switch (err.type) {
    case 'database':
      msg = 'Server Unavailable';
      res.statusCode = 503;
      break;
    default:
      msg = 'Internal Server Error';
      res.statusCode = 500;
  }

  res.format({
    html: function() {
      res.render('errors/5xx', {
        title: res.statusCode + ' ' + msg
      });
    },
    json: function() {
      res.json(res.statusCode, {message: msg});
    },
    text: function() {
      res.send(msg + '\n');
    }
  });
};
