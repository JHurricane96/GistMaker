const fs = require("fs");
const config = require("./config.js").fileConfig;

const fileContentsReg = config.gistFileContentsRegex;

const fileNameReg = config.gistFileNameRegex;

exports.getGists = () => {
	const localFiles = [];

	fileContents = fs.readFileSync(config.inputFileName, "utf8");

	let match = fileContentsReg.exec(fileContents);
	while (match !== null) {
		match.input = '';
		localFiles.push({
			fileName: match[1].match(fileNameReg)[1],
			file: match[1]
		});
		match = fileContentsReg.exec(fileContents);
	}

	return localFiles;
};

exports.writeOutput = async (newParts) => {
	fileContents = fs.readFileSync(config.inputFileName, "utf8");
	let i = 0;
	const newFileContents = fileContents.replace(fileContentsReg, () => newParts[i++]);
	await fs.writeFileSync(config.outputFileName, newFileContents);
};
