import paths from '{}/paths'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import ContextReplacementPlugin from 'webpack/lib/ContextReplacementPlugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const commonOptions = {
  entry: {
    boilerplate: [paths.src + '/index.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new CopyPlugin({
      patterns: [
        {from: './assets', to: './', toType: 'dir'}
      ]
    }),
    new ContextReplacementPlugin(/\/Pages/, './Pages', {
      './request': './request',
      './other-request': './new-request'
    }),
    new ESLintPlugin({
      extensions: '.js'
    }),
  ],

  resolve: {
    fallback: { "buffer": false },
    modules: [paths.src, 'node_modules'],
    extensions: ['.es6', '.jsx', '.js', 'json'],
    alias: {
      Header: paths.root+'./Modules/Header/',
      Templates: paths.root+'src/Templates/'
    }
  },
  module: {
    strictExportPresence: false,
    rules: [
      {
        test: /\.(m?js|jsx|es6)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          }
        }
      },
      {
        test: /\.(png|jp(e)g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              native: false,
            },
          },
        ],
      }
    ]
  }
}

const modes  = Object.freeze({
  dev:  'development',
  pro:  'production',
});


const commonConfig = async env => {
  if(!env || !env.type || !modes[env.type]) env = {type: Object.keys(modes)[0]};

  const cfgProcess = (await import(`{}/${env.type}.js`)).default;
  if(!(cfgProcess instanceof Function)) throw `Webpack configuration file: ${env.type} not found or it is not supported`;

  const name = modes[env.type];
  const result = Object.assign({}, cfgProcess(name), commonOptions);
  return result;
}

export default commonConfig;
