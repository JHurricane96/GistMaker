const Octokat = require("octokat");
const fileHandler = require("./fileHandler.js");
const megaGistUtils = require("./megaGistUtils");
const gists = require("./gists.js");

const octoClient = new Octokat(require("./config.js").authConfig);

function mergeUpdates(gistDetails, newGists) {
	gistDetails = gistDetails.map((detail, i) => {
		detail.fileName = newGists[i].fileName;
	});
}

function main() {
	if (process.argv.length < 3) {
		console.log("Invalid invocation: args are update, delete or get");
		return;
	}

	const command_type = process.argv[2];

	if (command_type === "get") {
		getMegaGist(process.argv[3]).then(response => console.log(response));
	}
	else if (command_type === "update") {
		if (process.argv.length < 4) {
			console.log("Update needs project name as arg");
			return;
		}

		updateProject(process.argv[3]);
	}
	else if (command_type === "delete") {
		if (process.argv.length < 4) {
			console.log("Delete needs project name as arg");
			return;
		}

		deleteProject(process.argv[3]);
	}
	else {
		console.log("Invalid invocation: args are update, delete or get");
	}
}

async function getMegaGist(projectName) {
	return await megaGistUtils.get();
}

async function deleteProject(projectName) {
	const megaGist = await megaGistUtils.get();
	const gistDetails = megaGistUtils.getGistList(megaGist, projectName);

	const responses = gistDetails.map(gistDetail => gists.delete(gistDetail.id));
	delete megaGist[projectName];

	await Promise.all([...responses, megaGistUtils.update(megaGist)]);
}

async function updateProject(projectName) {
	const newGists = await fileHandler.getGists();
	const megaGist = await megaGistUtils.get();
	const gistDetails = megaGistUtils.getGistList(megaGist, projectName);

	if (newGists.length > gistDetails.length) {
		const toUpdate = newGists.slice(0, gistDetails.length);
		const toCreate = newGists.slice(gistDetails.length);

		const updateRequests = toUpdate.map((gist, i) =>
			gists.update(gistDetails[i].id, gists.makeUpdateRequest(gistDetails[i].fileName, gist.fileName, gist.file))
		);
		const createRequests = toCreate.map(gist => gists.create(gists.makeCreateRequest(gist.fileName, gist.file)));

		const responses = await Promise.all([...updateRequests, ...createRequests]);
		const updateResponses = responses.slice(0, updateRequests.length - 1);
		const createResponses = responses.slice(updateRequests.length);

		mergeUpdates(gistDetails, newGists);

		createResponses.forEach((response, i) =>
			gistDetails.push(new megaGistUtils.MegaGistListEntry(newGists[i].fileName, response.htmlUrl, response.id))
		);
	}
	else if (newGists.length < gistDetails.length) {
		const toUpdate = newGists.slice(0, newGists.length);
		const toDelete = gistDetails.slice(newGists.length);

		const updateRequests = toUpdate.map((gist, i) =>
			gists.update(gistDetails[i].id, gists.makeUpdateRequest(gistDetails[i].fileName, gist.fileName, gist.file))
		);
		const deleteRequests = toDelete.map(gistDetail => gists.delete(gistDetail.id));

		const responses = await Promise.all([...updateRequests, ...deleteRequests]);
		const updateResponses = responses.slice(0, updateRequests.length - 1);

		gistDetails.splice(updateRequests.length);
		mergeUpdates(gistDetails, newGists);
	}
	else {
		const toUpdate = newGists.slice(0, newGists.length);

		const updateRequests = toUpdate.map((gist, i) =>
			gists.update(gistDetails[i].id, gists.makeUpdateRequest(gistDetails[i].fileName, gist.fileName, gist.file))
		);

		const responses = await Promise.all(updateRequests);

		mergeUpdates(gistDetails, newGists);
	}

	await megaGistUtils.update(megaGist);
	await fileHandler.writeOutput(gistDetails.map(detail => detail.url));
}

main();
