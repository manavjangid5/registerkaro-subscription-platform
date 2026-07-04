import nodeConfig from '@registerkaro/eslint-config/node';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nodeConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
