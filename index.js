const Express = require('express');
const Webpage = require('./webpage.js');
const Fs = require('fs');

const app = Express();



const port = function () {
	if(process.argv.length > 2) {
		let arg = Number(process.argv[2]);
		if(typeof arg === 'number' && ! isNaN(arg)) {
			return arg; }
	}
	return 80;
} ();



const ROOT_REDIRECT = new Webpage(
	Webpage.Template.fromFile('redirect.html'),
	{ redirect: 'url=\'raycast/\'' });

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
app.use('/raycast', require('./dynamic/raycast/route.js'));

app.listen(port, () => console.log('Server listening on port '+port));
