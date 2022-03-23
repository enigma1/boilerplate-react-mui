import paths, {makePath} from '{}/paths';

const dev = (name) => {
  return {
    output: {
      filename: '[name].development.js',
      path: makePath(name),
      publicPath: '/'
    },
    devServer: {
      port: 8084,
      static: `./public/${name}`,
      host: 'www.example.com',
      hot: true,
      server: {
        type: 'https'
      },
      // Set this for rewrites and to enable js router access
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      open: false,
      client: {
        overlay: {
          warnings: false,
          errors: true
        }
      }
    },
    mode: name,
    devtool: 'source-map'
  }
};

export default dev;