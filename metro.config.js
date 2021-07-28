/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
const extraNodeModules = {
    'common': path.resolve(__dirname + '/../node-back/src/constants'),
};
const watchFolders = [
    path.resolve(__dirname + '/../node-back/src/constants'),
];

module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false,
            },
        }),
    },
    resolver: {
        extraNodeModules,
    },
    watchFolders,
};

