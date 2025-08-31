import ashNazg from 'eslint-config-ash-nazg';

// eslint-disable-next-line @stylistic/max-len -- Long
export default /** @type {import('eslint').Linter.Config<import('eslint').Linter.RulesRecord>} */ ([
  {
    ignores: ['.idea']
  },
  ...ashNazg(['sauron', 'node']),
  {
    files: ['**/*.md/*.js'],
    languageOptions: {
      globals: {
        listDataTypes: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'import/no-unresolved': 'off',
      'import/unambiguous': 'off'
    }
  }
]);
