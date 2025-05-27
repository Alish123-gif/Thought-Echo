const ImageKit = require('imagekit');

// Add comprehensive logging
console.log('=== ImageKit Configuration Debug ===');
console.log('IMAGEKIT_PUBLIC_KEY:', process.env.IMAGEKIT_PUBLIC_KEY ? 'SET (length: ' + process.env.IMAGEKIT_PUBLIC_KEY.length + ')' : 'NOT SET');
console.log('IMAGEKIT_PRIVATE_KEY:', process.env.IMAGEKIT_PRIVATE_KEY ? 'SET (length: ' + process.env.IMAGEKIT_PRIVATE_KEY.length + ')' : 'NOT SET');
console.log('IMAGEKIT_URL_ENDPOINT:', process.env.IMAGEKIT_URL_ENDPOINT || 'NOT SET');

// Log first few characters to verify keys
if (process.env.IMAGEKIT_PUBLIC_KEY) {
    console.log('Public key starts with:', process.env.IMAGEKIT_PUBLIC_KEY.substring(0, 10) + '...');
}
if (process.env.IMAGEKIT_PRIVATE_KEY) {
    console.log('Private key starts with:', process.env.IMAGEKIT_PRIVATE_KEY.substring(0, 10) + '...');
}

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

module.exports = imagekit;
