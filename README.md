# GistMaker

Takes code snippets in markdown files and hosts them as GitHub gists. The snippets are then replaced by the gist URLs. Pretty useful for blogging on Medium, where snippets need to be gists to render with syntax highlighting.

# Setup

1. Clone this repo.
2. Run `npm install`.
3. Fill in stuff inside `config-example.js` located in the project root and rename it to `config.js`.

# Usage

This script organizes gists by grouping them into 'projects'. The script manages projects by maintaining a list of them... on a GitHub gist :)

Run `node index.js` in the project root, followed by the command to execute.

There are 3 commands:

1. `node index.js get` just fetches the master gist list.
2. `node index.js update <projectname>` hosts the snippets in the input file as gists and writes the output (with the snippets replaced by the gist URLs) to the output file specified in `config.js`.
3. `node index.js delete <projectname>` removes all the gists in the given project name permanently from GitHub, and also removes them from the master gist list permanently.
