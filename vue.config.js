const path = require("path");

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                'assets': path.resolve(__dirname, 'src/assets/'),
                'components': path.resolve(__dirname, 'src/components/'),
                'network': path.resolve(__dirname, 'src/network/'),
                'utils': path.resolve(__dirname, 'src/utils/'),
                'views': path.resolve(__dirname, 'src/views/')
            }
        }
    },
    publicPath: './'
}