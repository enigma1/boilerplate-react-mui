import paths, {makePath} from '{}/paths';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const pro = (name) => {
  return {
    output: {
      filename: `[name].${name}.js`,
      path: makePath(name),
      clean: true,
    },

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
    },

    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },

    /* Additional plugins configuration */
    plugins: [
    ],
    devtool: "source-map",
    mode: name,
  };
}
export default pro;