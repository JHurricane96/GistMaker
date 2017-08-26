const Octokat = require("octokat");
const authConfig = require("./config.js").authConfig;

let client = null;

module.exports = (() => {
	if (client === null) {
		client = new Octokat(authConfig);
	}

	return client;
})();