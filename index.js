const Express = require('express');
const Webpage = require('./webpage.js');
const Fs = require('fs');

const verbose = false;
const app = Express();



// Get bind port from arguments
const port = function () {
	if(process.argv.length > 2) {
		let arg = Number(process.argv[2]);
		if(typeof arg === 'number' && ! isNaN(arg)) {
			return arg; }
	}
	return 80;
} ();

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

app.listen(port, () => console.log('Server listening on port '+port));
