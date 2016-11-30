var httpserver = require('./httpserver');
httpserver.create(80,function(req, res, httppath, realpath){
	console.log(req, res, httppath, realpath);
});
