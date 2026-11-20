const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

function runGit(args) {
	return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function parseVersion(version) {
	const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version || '');
	if (!match) {
		throw new Error(`Expected a stable numeric semver version, got: ${version}`);
	}
	return match.slice(1).map(Number);
}

function compareVersions(left, right) {
	const a = parseVersion(left);
	const b = parseVersion(right);
	for (let index = 0; index < a.length; index += 1) {
		if (a[index] !== b[index]) return a[index] > b[index] ? 1 : -1;
	}
	return 0;
}

const event = JSON.parse(fs.readFileSync(process.env.EVENT_PATH, 'utf8'));
const pullRequest = event.pull_request;
if (!pullRequest) throw new Error('Expected a pull_request event payload.');

let baseSha = pullRequest.base.sha;
if (pullRequest.merged && pullRequest.merge_commit_sha) {
	baseSha = runGit(['rev-parse', `${pullRequest.merge_commit_sha}^1`]);
}

const basePackage = JSON.parse(runGit(['show', `${baseSha}:package.json`]));
const currentPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const lockFile = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
const lockVersion = lockFile.packages?.['']?.version || lockFile.version;

if (lockVersion !== currentPackage.version) {
	throw new Error(`package-lock.json is at ${lockVersion}, package.json is at ${currentPackage.version}.`);
}

const changedFiles = runGit(['diff', '--name-only', `${baseSha}...HEAD`])
	.split('\n')
	.filter(Boolean);
const sourceFiles = changedFiles.filter((file) => (
	!file.startsWith('.github/')
	&& !file.startsWith('docs/')
	&& !/^README(?:\.|$)/i.test(file)
	&& !/^LICENSE(?:\.|$)/i.test(file)
	&& !/^CHANGELOG(?:\.|$)/i.test(file)
));

if (sourceFiles.length > 0 && compareVersions(currentPackage.version, basePackage.version) <= 0) {
	throw new Error(
		`Source changes must increase the package version before merge (base ${basePackage.version}, PR ${currentPackage.version}). `
		+ 'Use npm version patch --no-git-tag-version, then commit package.json and package-lock.json.',
	);
}

console.log(sourceFiles.length > 0
	? `Package version ${basePackage.version} -> ${currentPackage.version} is ready for publication.`
	: 'Documentation or workflow-only change; no package release is required.');
