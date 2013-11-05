
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , fs = require('fs')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//Handle the file upload
app.post('/upload', function(req, res) {
	if (!fs.existsSync(__dirname + "/user/uploads"))
		fs.mkdirParent(__dirname + "/user/uploads");
	
	//Handle the file
	fs.readFile(req.files.imageUploader.path, function(err, data) {
		var newPath = __dirname + '/user/uploads/' + req.files.imageUploader.name;
		fs.writeFile(newPath, data, function(err) {
			console.log(err);
			res.send("AOK");
			//res.end();
		});
	});
});

fs.mkdirParent = function(dirPath, mode, callback) {
	//Call the standard fs.mkdir
  	fs.mkdir(dirPath, mode, function(error) {
    	//When it fail in this way, do the custom steps
    	if (error && error.errno === 34) {
      		//Create all the parents recursively
      		fs.mkdirParent(path.dirname(dirPath), mode, callback);
      		//And then the directory
      		fs.mkdirParent(dirPath, mode, callback);
    	}

    	//Manually run the callback since we used our own callback to do all these
    	callback && callback(error);
  	});
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
