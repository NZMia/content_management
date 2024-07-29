module.exports = {
  // extends: ['@commitlint/config-conventional'],
  extends: [],
  rules: {
    'header-end-period': [2, 'always'],
    'type-enum': [2, 'always', ['Feat', 'Bug', 'Workflow', 'Style', 'Chore']],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'header-pattern': [2, 'always', /^(\w+):\s.+$/],
    'header-min-length': [2, 'always', 10],
  },
  plugins: [
    {
      rules: {
        'header-end-period': ({ header }) => {
          return [/\.$/.test(header), 'Commit message must end with a period'];
        },
        'type-enum': ({ raw }) => {
          const types = ['Feat', 'Bug', 'Workflow', 'Style', 'Chore'];
          const type = raw.split(':')[0];
          return [
            types.includes(type),
            `Commit message must start with one of: ${types.join(', ')}`,
          ];
        },
      },
    },
  ],
};
