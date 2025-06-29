const ImageKit = require('imagekit');
const { config, validateConfig } = require('./config');

// Validate configuration before proceeding
validateConfig();

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: config.imagekit.publicKey,
    privateKey: config.imagekit.privateKey,
    urlEndpoint: config.imagekit.urlEndpoint
});

module.exports = imagekit;
