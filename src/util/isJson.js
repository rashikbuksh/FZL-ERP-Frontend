function isJSON(str) {
	try {
		return JSON.parse(str) && !!str;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export default isJSON;
