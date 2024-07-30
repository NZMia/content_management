// ref: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
module.exports = {
  extends: [],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'bug', 'workflow', 'style', 'chore', 'test'],
    ],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-min-length': [2, 'always', 10],
  },
};
