module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    assets: './assets',
                },
            },
        ],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
    env: {
        production: {
            plugins: ['transform-remove-console'],
        },
    },
};
