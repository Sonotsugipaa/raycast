const Express = require('express');
const Webpage = requireLocal('webpage');
const Redirect = requireLocal('redirect');

const DEFAULT_SIZE = {
	width: 1000,
	height: 700
};



const pageTemplate = Webpage.Template.fromFile(
	__dirname + '/index.html');

const router = Express.Router();

const rootRedirect = new Redirect(
	'index.html?res='+DEFAULT_SIZE.width+'x'+DEFAULT_SIZE.height);



function getIndex(req, res) {
	let resolution = req.query.res ?? (DEFAULT_SIZE.width+'x'+DEFAULT_SIZE.height);
	let error = null;
	resolution = resolution.match(/^(\d*)x(\d*)$/) ??
		[, DEFAULT_SIZE.width, DEFAULT_SIZE.height];
	let [ width, height ] = [
		resolution[1] ?? String(DEFAULT_SIZE.width),
		resolution[2] ?? String(DEFAULT_SIZE.height)
	];
	let page = new Webpage(pageTemplate, {
		width: width,
		height: height
	});
	if(! (error || page.error)) {
		res.status(200).send(page.string);
	} else {
		res.status(500);
	}
}



router.use('/', Express.static(__dirname + '/static'));

router.get('/', (rq, rs) => { rootRedirect.sendFullRedirect(rq, rs); });
router.get('/index.html', getIndex);

module.exports = router;
