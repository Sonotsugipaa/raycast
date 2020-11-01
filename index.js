global.requireLocal;
requireLocal = function requireLocal(mod) {
	return require(__dirname+'/project_modules/'+mod); }



const Express = require('express');
const Webpage = requireLocal('webpage');
const Redirect = requireLocal('redirect');
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
		port = Number(port);
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
			r.port = verifyPort(process.argv[2]);
			break;
		case 4: // host, port
			r.host = process.argv[2];
			r.port = verifyPort(process.argv[3]);
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



const rootRedirect = new Redirect('/raycast/index.html?res=1800x780');



app.get('/', (rq, rs) => { rootRedirect.sendFullRedirect(rq, rs); });

app.use('/', Express.static('static'));
app.use('/raycast', require('./routes/raycast/route.js'));
app.use('/sepaxthian', require('./routes/sepaxthian/route.js'));

app.listen(
	options.port,
	() => console.log('Server listening on '+options.host+', port '+options.port));
