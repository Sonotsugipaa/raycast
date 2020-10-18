const Fs = require('fs');



const splitPattern = /\[\[\[PARAM(?:\s+((?:".+?")|(?:'.+?')))?\]\]\]/;
const beginPattern = new RegExp('^'+splitPattern.source);
const anonParamName = ':anon';
const nullFunctionName = ':null';


function checkNotation(notation) {
	return notation.length > 1 &&
		(notation[0] == '\'' || notation[0] == '"') &&
		notation[0] == notation[notation.length-1];
}

function stringFromNotation(notation) {
	if(checkNotation(notation))
		return notation.substr(1, notation.length - 2);
	return;
}

function onInvalidParameter(paramIndex) {
	console.log('WARNING: parameter '+paramIndex+' is invalid');
}

class SplitPoint {
	constructor(name, index) {
		this.name = name;
		this.index = index;
	}
}



class WebpageTemplate {
	constructor(template) {
		this.splitPoints = [];
		this.parts = [];
		let parts = template.split(splitPattern);
		let nameIndices = [];
		const firstVarIndex = template.match(beginPattern)? 0:1;
		for(let i=0; i < parts.length; ++i) {
			if(i % 2 == 1) {
				// current part is a parameter
				let name = anonParamName;
				if(typeof parts[i] !== 'undefined') {
					name = stringFromNotation(parts[i]); }
				if(typeof name === 'undefined') {
					onInvalidParameter(((i - firstVarIndex) / 2)+1);
					name = null;
				}
				if(typeof nameIndices[name] === 'undefined') {
					nameIndices[name] = 0; }
				this.splitPoints.push(new SplitPoint(name, nameIndices[name]));
				++nameIndices[name];
			} else {
				// current part is static
				this.parts.push(parts[i]);
			}
		}
	}
}

WebpageTemplate.fromFile = function (templatePath) {
	let r = new WebpageTemplate(Fs.readFileSync(templatePath, 'utf8'));
	r.path = Fs.readFileSync(templatePath, 'utf8');
	return r;
}



class Webpage {
	// functionSet: an object where every member is a function
	//              that takes a param's name and index as arguments;
	//              alternatively, a function can just be a value.
	constructor(template, functionSet) {
		this.error = null;
		if(! (template instanceof WebpageTemplate)) {
			template = new WebpageTemplate(template); }
		if(typeof functionSet !== 'object') {
			functionSet = {}; }
		this.string = '';
		const partsCount = template.parts.length + template.splitPoints.length;
		const nullFunction = (typeof functionSet[nullFunctionName] === 'undefined')?
			function (name, i) { return '[[[PARAM "'+name+'"]]]'; } :
			functionSet[nullFunctionName];
		for(let i=0; i < partsCount; ++i) {
			if(i % 2 == 0) {
				// part is static
				this.string += template.parts[i/2];
			} else {
				// part is dynamic
				const splitPointIndex = (i-1)/2;
				const splitPoint = template.splitPoints[splitPointIndex];
				let func = functionSet[splitPoint.name];
				if(typeof func === 'undefined') {
					func = nullFunction;
				}
				let resolvedParam;
				switch(typeof func) {
				case 'function':
					resolvedParam = func(splitPoint.name, splitPoint.index);  break;
				case 'undefined':
					resolvedParam = '';  break;
				default:
					resolvedParam = func;  break;
				}
				this.string += resolvedParam;
			}
		}
	}
}

Webpage.Template = WebpageTemplate;

Webpage.Template.BASIC = new WebpageTemplate(
	'<!DOCTYPE html><html>' +
	'<head>[[[PARAM "head"]]]' +
	'</head><body>[[[PARAM "body"]]]</body></html>');



module.exports = Webpage;
