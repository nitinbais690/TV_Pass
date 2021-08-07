const { includes } = require('lodash');
const fs = require('fs');

// Setup
const github = danger.github;
const pr = github.pr;
const commits = github.commits;
const modified = danger.git.modified_files;
const bodyAndTitle = (pr.body + pr.title).toLowerCase();
console.log(commits.map(({ sha }) => sha));

// Custom modifiers for people submitting PRs to be able to say "skip this"
const trivialPR = bodyAndTitle.includes('trivial');
const acceptedNoTests = bodyAndTitle.includes('skip new tests');

const typescriptOnly = file => includes(file, '.ts');
const filesOnly = file => fs.existsSync(file) && fs.lstatSync(file).isFile();

// Custom subsets of known files
const modifiedLibFiles = modified.filter(p => includes(p, 'packages/')).filter(p => filesOnly(p) && typescriptOnly(p));

// Takes a list of file paths, and converts it into clickable links
const linkableFiles = paths => {
    const repoURL = pr.head.repo.html_url;
    const ref = pr.head.ref;
    const links = paths.map(path => {
        return createLink(`${repoURL}/blob/${ref}/${path}`, path);
    });
    return toSentence(links);
};

// ["1", "2", "3"] to "1, 2 and 3"
const toSentence = array => {
    if (array.length === 1) {
        return array[0];
    }
    return array.slice(0, array.length - 1).join(', ') + ' and ' + array.pop();
};

// ("/href/thing", "name") to "<a href="/href/thing">name</a>"
const createLink = (href, text) => `<a href='${href}'>${text}</a>`;

// Raise about missing code inside files
const raiseIssueAboutPaths = (type, paths, codeToInclude) => {
    if (paths.length > 0) {
        const files = linkableFiles(paths);
        const strict = '<code>' + codeToInclude + '</code>';
        type(`Please ensure that ${strict} is enabled on: ${files}`);
    }
};

console.log('GitHub PR Username:', pr && pr.user && pr.user.login);

const githubBotUsernames = ['macbuilder'];

const isBot = pr && pr.user && pr.user.login && githubBotUsernames.includes(pr.user.login);

// Rules
if (!isBot) {
    // Keep lock files upto date.
    const packageChanged = modified.includes('package.json');
    const lockfileChanged = modified.includes('package-lock.json');
    if (packageChanged && !lockfileChanged) {
        const message = 'Changes were made to package.json, but not to package-lock.lock';
        const idea = 'Perhaps you need to run `npm install`?';
        warn(`${message} - <i>${idea}</i>`);
    }

    // No PR is too small to warrant a paragraph or two of summary
    if (pr.body.length === 0) {
        fail('Please add a description to your PR.');
    }

    const hasLibraryChanges = modifiedLibFiles.length > 0;

    const testChanges = modifiedLibFiles.filter(filepath => filepath.includes('__tests__'));
    const hasTestChanges = testChanges.length > 0;

    // Warn when there is a big PR
    const bigPRThreshold = 600;
    if (github.pr.additions + github.pr.deletions > bigPRThreshold) {
        warn(':exclamation: Big PR');
    }

    // Warn if there are library changes, but not tests
    if (hasLibraryChanges && !hasTestChanges) {
        warn("There are library changes, but not tests. That's OK as long as you're refactoring existing code");
    }

    // Be careful of leaving testing shortcuts in the codebase
    const onlyTestFiles = testChanges.filter(x => {
        const content = fs.readFileSync(x).toString();
        return (
            content.includes('it.only') ||
            content.includes('describe.only') ||
            content.includes('fdescribe') ||
            content.includes('fit(')
        );
    });
    raiseIssueAboutPaths(fail, onlyTestFiles, 'an `only` was left in the test');
}
