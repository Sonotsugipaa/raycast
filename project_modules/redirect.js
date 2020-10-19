const Webpage = requireLocal('webpage');

const pageTemplate = Webpage.Template.fromFile(
	'redirect.html');

const pageFuncset = {};



function stripSlashes(str, keepAtEnd) {
	if(typeof str !== 'string') {
		return str; }
	keepAtEnd = keepAtEnd ?? 0;
	// strip leading
	for(let i = str.length-1; i >= 0; --i) {
		if(str[i] != '/') {
			str = str.substr(0, i+1);
			break;
		}
	}
	// strip trailing
	for(let i = 0; i < str.length; ++i) {
		if(str[i] != '/') {
			str =  str.substr(i, str.length - i);
			break;
		}
	}
	// add eventual trailing slashes
	if(str.length > 0)
	for(let i=0; i < keepAtEnd; ++i) {
		str += '/'; }
	return str;
}


class UnexpectedTypeError {
	constructor(expect, got) {
		this.expect = expect;
		this.got = got;
		this.string = 'expected \''+expect+'\', got \''+got+'\'';
	}

	toString() { return this.string; }
}


class RedirectWebpage extends Webpage {
	constructor(destination) {
		let funcset = pageFuncset;
		if(destination === undefined || destination === null) {
			throw new UnexpectedTypeError('string', typeof destination); }
		destination = stripSlashes(destination);
		funcset.redirect = 'url="'+destination+'"';
		super(pageTemplate, funcset);
		this.destination = destination;
	}

	sendFullRedirect(
			httpRequestObj,
			httpResponseObj,
			httpStatusCode
	) {
		httpStatusCode = httpStatusCode ?? 301;
		httpResponseObj.status(301).
			set({
				'Location':
					httpRequestObj.protocol+'://'+
					httpRequestObj.get('Host')+'/'+
					stripSlashes(httpRequestObj.baseUrl, 1)+
					this.destination
			}).
			send(this.string);
	}

	sendHtmlRedirect(httpResponseObj) {
		httpResponseObj.status(200).send(this.string);
	}
}



module.exports = RedirectWebpage;
