module.exports = {
  "env": {
    "browser": true,
    "jest": true,
    "es6": true
  },
  "globals": {
    "global": true,
    "randomize": true,
    "React": true,
    "ReactDOM": true,
    "PropTypes": true,
    "PubSub": true
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "plugins": [
      "html",
      "import",
      "react"
  ],
  "rules": {
    "react/prop-types": "off",
    "react/jsx-key": "off",
    "react/display-name": "off",
    "no-sparse-arrays": "off",
    "no-control-regex": "off",
    "no-eval": "error",
    "import/first": "error",
    "no-unreachable": "warn",
    "no-unused-vars": "warn"
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ]
}
