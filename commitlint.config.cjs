// ref: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
module.exports = {
  extends: [],
  rules: {
    'header-end-period': [2, 'always'],
    'type-enum': [2, 'always', ['Feat', 'Bug', 'Workflow', 'Style', 'Chore']],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'header-min-length': [2, 'always', 10],
    'header-case-start-capital': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'header-case-start-capital': ({ raw }) => {
          return [
            /^[A-Z]/.test(raw),
            'Commit message must start with a capital letter',
          ];
        },
        'header-end-period': ({ header }) => {
          return [/\.$/.test(header), 'Commit message must end with a period'];
        },
      },
    },
  ],
};
