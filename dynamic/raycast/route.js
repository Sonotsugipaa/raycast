const Express = require('express');
const Webpage = require('../../webpage.js');

const pageTemplate = Webpage.Template.fromFile(
	'dynamic/raycast/index.html');

const router = Express.Router();



function getIndex(req, res) {
	let resolution = req.query.res ?? '1000x800';
	let error = null;
	resolution = resolution.match(/^(\d*)x(\d*)$/) ??
		[, 1000, 800];
	let [ width, height ] = [
		resolution[1] ?? '1000',
		resolution[2] ?? '800'
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



router.use('/', Express.static('static/raycast'));

router.get('/', getIndex);
router.get('/index.html', getIndex);

module.exports = router;
