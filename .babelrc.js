// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('./package.json');

const env = {
  'process.env.VERSION': version,
  'process.env.NODE_ENV': process.env.NODE_ENV,
  'process.env.ANALYTICS': process.env.ANALYTICS,
  'process.env.GITHUB_TOKEN': process.env.GITHUB_TOKEN,
};

module.exports = {
  presets: ['next/babel', '@zeit/next-typescript/babel'],
  plugins: [
    'styled-components',
    'polished',
    'inline-dotenv',
    'react-intl',
    ['transform-define', env],
  ],
};
