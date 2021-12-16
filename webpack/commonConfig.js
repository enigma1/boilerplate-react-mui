import { exec } from 'child_process';
import paths from '{}/paths'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import ContextReplacementPlugin from 'webpack/lib/ContextReplacementPlugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const ConsoleCleanupPlugin = () => {
  let passState = 0;
  const cStrings = {
    startText: '----------------------------------Starting----------------------------------------\n',
    restartText: '\n----------------------------------Restarting--------------------------------------\n'
  }

  const clearDisplay = () => {
    const output = passState === 0?cStrings.startText:cStrings.restartText;
    if(passState !== 1) {
      const erase = process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H"
      process.stdout.write(`${erase}${output}`);
      passState++;
    }
  }

  return {
    apply: (compiler) => {
      compiler.hooks.afterEnvironment.tap(
        'CleanupPluginStart', (compilation, callback) => {
          clearDisplay();
        }
      ),
      compiler.hooks.watchRun.tap(
        'CleanupPluginRestart', (compilation, callback) => {
          clearDisplay();
          passState++;
        }
      )
      //console.log('compiler', compiler.hooks)
    }
  }
}
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
    ConsoleCleanupPlugin(),
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
