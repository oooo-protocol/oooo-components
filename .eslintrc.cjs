module.exports = {
  root: true,
  extends: [
    'ted',
    'ted/vue',
    'ted/typescript'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: [
      './tsconfig.json',
      './tsconfig.node.json'
    ],
    tsconfigRootDir: __dirname,
    extraFileExtensions: [
      '.vue'
    ]
  }
}
