module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: ['import'],
  settings: {
    'import/resolver': {
      node: {
        path: ['sources'],
        alias:  {
            assets: './sources/assets',
            sources: './sources',
            components: './sources/components',
            atoms: './sources/components/atoms',
            molecules: './sources/components/molecules',
            organisms: './sources/components/organisms',
            navigations: './sources/navigations',
            screens: './sources/screens',
            services: './sources/services',
            styles: './sources/styles',
            utils: './sources/utils'
        }
      }
    }
  }
};
