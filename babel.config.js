module.exports = (api) => {
  api.cache(true);
  return {
    "env": {
      "development": {
        "plugins": [
          ["babel-plugin-root-import", {
            "functions": ["jest.mock", "import", "rootTransformed"],
            "paths": [
              {
                root: __dirname,
                "rootPathPrefix": "^/",
                "rootPathSuffix": "src"
              },
              {
                root: __dirname,
                "rootPathPrefix": "?/",
                "rootPathSuffix": "tests"
              },
              {
                root: __dirname,
                "rootPathPrefix": "~/",
                "rootPathSuffix": "assets/images"
              },
              {
                root: __dirname,
                "rootPathPrefix": "!/",
                "rootPathSuffix": "src/core"
              },
              {
                root: __dirname,
                "rootPathPrefix": "%/",
                "rootPathSuffix": "src/Modules"
              },
              {
                root: __dirname,
                "rootPathPrefix": ">/",
                "rootPathSuffix": "src/core/services"
              },
              {
                root: __dirname,
                "rootPathPrefix": "{}/",
                "rootPathSuffix": "webpack"
              },
              {
                root: __dirname,
                "rootPathPrefix": "=/",
                "rootPathSuffix": "src/static"
              }
            ]
          }]
        ]
      }
    }
  }
}
