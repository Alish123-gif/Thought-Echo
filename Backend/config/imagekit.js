const ImageKit = require('imagekit');

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Test basic authentication method
async function testImageKitAuth() {
    try {


        // Test 1: Try getFileMetadata (simpler operation)

        try {
            await imagekit.getFileMetadata('non-existent-file');
        } catch (metadataError) {
            // We expect this to fail due to file not existing, but it should show auth status

        }

        // Test 2: Try listFiles with more specific error handling

        const result = await imagekit.listFiles({ limit: 1 });


    } catch (error) {
        throw new Error(`ImageKit authentication failed: ${error.message}`);
    }
}

// Call auth test when module is loaded
testImageKitAuth();

module.exports = imagekit;
