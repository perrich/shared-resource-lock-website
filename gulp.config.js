var historyApiFallback = require('connect-history-api-fallback');
var proxy = require('http-proxy-middleware');

module.exports = function () {
    var root = 'src/';
    var app = root + 'app/';
    var index = root + 'index.html';

    var build = {
        dev: 'www',
        prod: 'dist',
        temp: 'build'
    };

    var systemJs = {
        builder: {
            normalize: true,
            minify: true,
            mangle: true,
            globalDefs: { DEBUG: false }
        }
    };

    var browserSync = {
        dev: {
            injectChanges: true,
            port: 3000,
            server: {
                baseDir: './' + build.dev,
                middleware: [
                    historyApiFallback(),
                    proxy('/**/*.php', {target: 'http://lock.localhost/'}),
                    proxy('/**/*.php/*', {target: 'http://lock.localhost/'})
                ]
            }
        }
    };

    var config = {
        root: root,
        app: app,
        dev: build.dev,
        dist: build.prod,
        temp: build.temp,
        browserSync: browserSync,
        systemJs: systemJs
    };

    return config;
};
