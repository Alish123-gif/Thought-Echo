const multer = require('multer');

// Set up multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // Check if the file is an image
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File too large',
                error: 'The uploaded file exceeds the 5MB size limit'
            });
        }
        return res.status(400).json({ message: 'File upload error', error: err.message });
    } else if (err) {
        return res.status(400).json({ message: 'File upload error', error: err.message });
    }
    next();
};

module.exports = { upload, handleMulterError };
