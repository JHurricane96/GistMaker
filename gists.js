const octoClient = require("./octokatClient.js");

exports.get = async (gistId) => {
	return await octoClient.gists(gistId).fetch();
}

exports.create = async (request) => {
	return await octoClient.gists.create(request);
};

exports.delete = async (gistId) => {
	return await octoClient.gists(gistId).remove();
};

exports.update = async (gistId, request) => {
	return await octoClient.gists(gistId).update(request);
};

exports.makeCreateRequest = (fileName, fileContents) => {
	return {
		description: "blank",
		public: "false",
		files: {
			[fileName]: {
				content: fileContents
			}
		}
	};
}

exports.makeUpdateRequest = (oldFileName, newFileName, fileContents) => {
	return {
		description: "blank",
		public: "false",
		files: {
			[oldFileName]: {
				fileName: newFileName,
				content: fileContents
			}
		}
	};
}
