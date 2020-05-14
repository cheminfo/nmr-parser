import json from '@rollup/plugin-json';

const config = {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    exports: 'named',
  },
  plugins: [json()],
  external: ['jeolconverter'],
};

export default config;
