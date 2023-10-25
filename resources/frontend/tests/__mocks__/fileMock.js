const path = require('path');

module.exports = {
    process(src, filename, config, options) {
        return 'module.exports = ' + JSON.stringify(path.basename(path.dirname(filename)) + '/' + path.basename(filename)) + ';';
    }
};