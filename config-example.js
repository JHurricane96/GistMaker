exports.authConfig = {
	username: "username",
	password: "password",
};

exports.megaGistConfig = {
	id: "ID of mega gist here",
	fileName: "file name of list of gists in mega gist here"
};

exports.fileConfig = {
	inputFileName: "input file here",
	outputFileName: "output file here",
	gistFileContentsRegex: /[`][`][`]c\s*([\s\S]*?)[`][`][`]/g, // Replace the c after the three backticks with the language of your choice
	gistFileNameRegex: /@file: (\S*)\s/
}
