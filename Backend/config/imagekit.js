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

// Test basic authentication method
async function testImageKitAuth() {
    try {
        console.log('=== Testing ImageKit Authentication Methods ===');
        
        // Test 1: Try getFileMetadata (simpler operation)
        console.log('Test 1: Attempting getFileMetadata...');
        try {
            await imagekit.getFileMetadata('non-existent-file');
        } catch (metadataError) {
            // We expect this to fail due to file not existing, but it should show auth status
            console.log('Metadata test response:', metadataError.response?.status, metadataError.message);
        }

        // Test 2: Try listFiles with more specific error handling
        console.log('Test 2: Attempting listFiles...');
        const result = await imagekit.listFiles({ limit: 1 });
        console.log('✅ listFiles successful, files count:', result.length);
        
    } catch (error) {
        console.log('❌ Auth test failed with details:');
        console.log('Error message:', error.message);
        console.log('Error code:', error.code);
        console.log('HTTP status:', error.response?.status);
        console.log('Response headers:', error.response?.headers);
        console.log('Response data:', error.response?.data);
        console.log('Full error object:', JSON.stringify(error, null, 2));
    }
}

// Call auth test when module is loaded
testImageKitAuth();

module.exports = imagekit;
