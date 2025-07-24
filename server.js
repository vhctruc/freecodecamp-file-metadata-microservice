const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Configure multer for file uploads
// Use memory storage to avoid saving files to disk
const storage = multer.memoryStorage();

// Configure multer with file size limit and field name
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1, // Only one file at a time
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types
    cb(null, true);
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST /api/fileanalyse - Analyze uploaded file
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded. Please select a file with the name "upfile".'
      });
    }
    
    // Extract file metadata
    const fileMetadata = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    };
    
    // Log file upload for debugging
    console.log('File uploaded:', {
      name: fileMetadata.name,
      type: fileMetadata.type,
      size: fileMetadata.size,
      fieldname: req.file.fieldname
    });
    
    // Return file metadata
    res.json(fileMetadata);
    
  } catch (error) {
    console.error('Error processing file upload:', error);
    res.status(500).json({
      error: 'Internal server error while processing file'
    });
  }
});

// Handle multer errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 50MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files. Only one file allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected field name. Use "upfile" as the field name.'
      });
    }
    
    return res.status(400).json({
      error: 'File upload error: ' + error.message
    });
  }
  
  // Handle other errors
  console.error('Unexpected error:', error);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'File Metadata Microservice',
    upload_limits: {
      max_file_size: '50MB',
      max_files: 1,
      field_name: 'upfile'
    }
  });
});

// API documentation endpoint
app.get('/api/info', (req, res) => {
  res.json({
    title: 'File Metadata Microservice',
    description: 'Upload files and get metadata including name, type, and size',
    endpoints: {
      upload: {
        method: 'POST',
        url: '/api/fileanalyse',
        field_name: 'upfile',
        response: {
          name: 'string - original filename',
          type: 'string - MIME type',
          size: 'number - file size in bytes'
        }
      },
      health: {
        method: 'GET',
        url: '/api/health',
        description: 'Service health check'
      }
    },
    usage: [
      '1. Select a file using the form',
      '2. Ensure the input field has name="upfile"',
      '3. Submit to POST /api/fileanalyse',
      '4. Receive JSON response with file metadata'
    ]
  });
});

// Test endpoint to verify multer is working
app.get('/api/test-upload-form', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test File Upload</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        form { max-width: 400px; margin: 20px 0; }
        input[type="file"] { margin: 10px 0; padding: 10px; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
      </style>
    </head>
    <body>
      <h2>Test File Upload</h2>
      <p>Use this form to test the file upload API directly:</p>
      <form action="/api/fileanalyse" method="post" enctype="multipart/form-data">
        <label for="upfile">Choose file:</label><br>
        <input type="file" id="upfile" name="upfile" required><br>
        <button type="submit">Upload and Analyze</button>
      </form>
      <p><strong>Note:</strong> The input field name must be "upfile"</p>
    </body>
    </html>
  `);
});

// Handle 404 for API routes
app.get('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    available: [
      'POST /api/fileanalyse',
      'GET /api/health',
      'GET /api/info',
      'GET /api/test-upload-form'
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log('🚀 File Metadata Microservice running on port', PORT);
  console.log('📡 API endpoints available:');
  console.log('   POST /api/fileanalyse (file upload)');
  console.log('   GET  /api/health (health check)');
  console.log('   GET  /api/info (API documentation)');
  console.log('   GET  /api/test-upload-form (test form)');
  console.log('🌐 Frontend available at: http://localhost:' + PORT);
  console.log('📁 File upload field name: "upfile"');
  console.log('📏 Maximum file size: 50MB');
  console.log('💾 Using memory storage (files not saved to disk)');
});
