const gists = require("./gists.js");
const megaGistConfig = require("./config.js").megaGistConfig;

exports.MegaGistListEntry = class {
	constructor(fileName, url, id) {
		this.fileName = fileName;
		this.url = url;
		this.id = id;
	}
}

exports.get = async () => {
	const response = await gists.get(megaGistConfig.id);
	return JSON.parse(response.files[megaGistConfig.fileName].content);
}

exports.getGistList = (megaGist, projectName) => {
	if (megaGist[projectName] === undefined) {
		megaGist[projectName] = [];
	}

	return megaGist[projectName];
}

exports.update = async (megaGist) => {
	await gists.update(megaGistConfig.id, gists.makeUpdateRequest(megaGistConfig.fileName, megaGistConfig.fileName, JSON.stringify(megaGist)));
}
