import path from 'path';

const paths = {
  // Source files
  root: path.resolve(__dirname, '..'),
  src: path.resolve(__dirname, '../src'),

  // Production build files
  buildPro: path.resolve(__dirname, './production'),
  buildDev: path.resolve(__dirname, './development'),

  // Static files that get copied to build folder
  public: path.resolve(__dirname, '../public'),
}

export const makePath = (name) => path.resolve(__dirname, `./${name}`)
export default paths;
