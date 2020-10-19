global.requireLocal;
requireLocal = function requireLocal(mod) {
	return require(__dirname+'/project_modules/'+mod); }



const Express = require('express');
const Webpage = requireLocal('webpage.js');
const Fs = require('fs');

const app = Express();

global.verbose;  verbose = false;



// Get bind options from arguments
const options = (() => {
	let r = {
		host: '::',
		port: 80
	};
	function verifyPort(port) {
		port = Number(process.argv[2]);
		console.log(process.argv);
		if(typeof port !== 'number' || isNaN(port)) {
			console.error('Invalid port: "'+port+'"');
			process.exit(1);
		} else {
			return port;
		}
	}
	switch(process.argv.length) {
		case 0: // ?
		case 1: // also '?'
		case 2: // default options
			break;
		case 3: // only port
			port = verifyPort(process.argv[2]);
			break;
		case 4: // host, port
			host = process.argv[2];
			port = verifyPort(process.argv[3]);
			break;
		default:
			console.error(
				'Invalid syntax. The application\'s arguments must use either syntax:'+
				'\n\tnode '+process.argv[1]+' [port]'+
				'\n\tnode '+process.argv[1]+' [host] [port]');
			process.exit(1);
			break;
	}
	return r;
}) ();

// Set the working directory to this file's container if the cwd
// doesn't have the required directories, "static/" and "routes/"
if(! (
	Fs.existsSync('./static/') && Fs.statSync('./static/').isDirectory() &&
	Fs.existsSync('./routes/') && Fs.statSync('./routes/').isDirectory()
)) {
	if(verbose) console.log(
		'= Current working directory is missing certain files;\n'+
		'= trying to cd into "'+__dirname+'"');
	process.chdir(__dirname);
}



// Static webpage that needs to be created from a template
const ROOT_REDIRECT = new Webpage(
	Webpage.Template.fromFile('redirect.html'),
	{ redirect: 'url=\'raycast/\'' });

// Hands out a redirecting HTML page,
// as well as sending a HTTP 301 response
function rootHandler(req, res) {
	res.status(301).
		set({
			'Location':
				req.protocol+'://'+req.get('Host')+
				'/raycast/index.html?res=1000x800',
			'Content-Type': 'text/html'
		}).
		send(ROOT_REDIRECT.string);
}

app.get('/', rootHandler);

app.use('/', Express.static('static'));
app.use('/raycast', require('./routes/raycast/route.js'));

app.listen(
	options.port,
	() => console.log('Server listening on '+options.host+', port '+options.port));
