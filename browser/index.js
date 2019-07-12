import bowser from 'bowser';

function browserDetect(){

	let userTechData = bowser.getParser(window.navigator.userAgent).parse().parsedResult;

	if( userTechData.browser.name === 'Internet Explorer' )
		userTechData.browser.name = 'ie';

	window.browser = userTechData.browser;
	window.browser.engine = userTechData.engine;
	window.browser.touch = ('ontouchstart' in window || navigator.msMaxTouchPoints || false);
	window.os = userTechData.os;
	window.platform = userTechData.platform.type;

	document.documentElement.className += (' ' + browser.name + ' ' + browser.name + '-' + browser.version.substr(0, browser.version.indexOf('.')) + ' ' + os.name+ ' ' + browser.engine.name + ('version' in browser.engine ? ' ' + browser.engine.name+'-' + browser.engine.version : '') + ' ' + os.name + '-' + os.versionName + ' ' + (browser.touch ? 'touch' : 'no-touch')).toLowerCase();
}

export default browserDetect;