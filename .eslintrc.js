module.exports = {
  root: true,
  ignorePatterns: ["*.js","*.d.ts"],
  //parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    /**
     * Best Practices
     */

    // require the use of === and !==
    eqeqeq: 'error',

    // disallow the use of variables before they are defined
    'no-use-before-define': 'warn',

    // require let or const instead of var
    //'no-var': 'error',

    // require constructor names to begin with a capital letter
    'new-cap': 'warn',

    // require return statements to either always or never specify values
    'consistent-return': 'warn',

    // disallow this keywords outside of classes or class-like objects
    'no-invalid-this': 'error',

    // disallow unmodified conditions of loops
    'no-unmodified-loop-condition': 'warn',

    // disallow unused expressions
    'no-unused-expressions': 'error',

    // disallow unused variables
    'no-unused-vars': 'warn',

    // disallow redundant return statements
    'no-useless-return': 'error',

    // require const declarations for variables that are never reassigned after declared
    'prefer-const': 'error',


    /**
     * Styling
     */

    // enforce consistent indentation
    indent: ['warn', 2, { 'SwitchCase': 1 }],

    // require or disallow semicolons instead of ASI
    semi: ['error', 'always'],

    // require or disallow trailing commas
    'comma-dangle': ['warn', 'always-multiline'],

    // require or disallow newline at the end of files
    'eol-last': ['warn', 'always'],

    // enforce consistent linebreak style
    'linebreak-style': ['error', 'unix'],

    // disallow trailing whitespace at the end of lines
    'no-trailing-spaces': 'warn',

    // require parens in arrow function arguments
    //'arrow-parens': ['warn', 'as-needed', { 'requireForBlockBody': true }],

    // enforce consistent spacing before blocks
    'space-before-blocks': ['warn', 'always'],

    // enforce consistent spacing before function definition opening parenthesis
    'space-before-function-paren': ['warn', {
        "anonymous": 'never',
        "named": 'never',
        "asyncArrow": 'always'
    }],

    // enforce consistent spacing before and after keywords
    'keyword-spacing': [
      'warn',
      {
        before: true, // requires at least one space before keywords
        after: true,  // requires at least one space after keywords
      },
    ],

    // enforce consistent spacing around commas
    'comma-spacing': 'warn',

    // enforce standard key spacing in object literals
    'key-spacing': 'warn',

    'space-in-parens': ['error', 'never'],

    /**
     * Relaxing overly strict recommended
     */

    // allow console.log and other console statements
    'no-console': 'off',

    'no-unused-vars': ["error", { "argsIgnorePattern": "^_" }]
  },
};
