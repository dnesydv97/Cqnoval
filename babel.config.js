module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          src: './src',
          assets: './src/assets',
          components: './src/components',
          constant: './src/constant',
          scenes: './src/scenes',
          services: './src/services',
          styles: './src/styles',
          utils: './src/utils',
        },
      },
    ],
  ],
};
