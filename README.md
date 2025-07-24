# 📁 File Metadata Microservice

FreeCodeCamp Back End Development and APIs Project - File Metadata Microservice

## 📋 Project Description

A microservice that analyzes uploaded files and returns metadata including filename, MIME type, and file size. Built with Express.js and Multer for handling multipart file uploads.

## 🚀 Live Demo

- **Frontend Interface**: [Your deployed URL here]
- **API Endpoint**: [Your deployed URL]/api/fileanalyse

## 📋 API Documentation

### File Upload & Analysis
```
POST /api/fileanalyse
```

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Field name: `upfile` (required)
- File: Any file type, max 50MB

**Response:**
```json
{
  "name": "document.pdf",
  "type": "application/pdf", 
  "size": 1048576
}
```

**Response Fields:**
- `name`: Original filename as uploaded
- `type`: MIME type of the file
- `size`: File size in bytes

## 🧪 Test Cases

### 1. Text File Upload
```bash
curl -X POST https://your-app.railway.app/api/fileanalyse \
  -F "upfile=@document.txt"
```

**Expected Response:**
```json
{
  "name": "document.txt",
  "type": "text/plain",
  "size": 1200
}
```

### 2. Image File Upload
```bash
curl -X POST https://your-app.railway.app/api/fileanalyse \
  -F "upfile=@photo.jpg"
```

**Expected Response:**
```json
{
  "name": "photo.jpg", 
  "type": "image/jpeg",
  "size": 512000
}
```

### 3. PDF Document Upload
```bash
curl -X POST https://your-app.railway.app/api/fileanalyse \
  -F "upfile=@report.pdf"
```

**Expected Response:**
```json
{
  "name": "report.pdf",
  "type": "application/pdf",
  "size": 2621440
}
```

### 4. No File Error
```bash
curl -X POST https://your-app.railway.app/api/fileanalyse
```

**Expected Response:**
```json
{
  "error": "No file uploaded. Please select a file with the name \"upfile\"."
}
```

## 🛠️ Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/file-metadata-microservice-fcc.git
   cd file-metadata-microservice-fcc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Development mode (with auto-reload):**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Project Structure
```
file-metadata-microservice-fcc/
├── index.html          # Frontend interface
├── server.js           # Express.js backend with Multer
├── package.json        # Project configuration
└── README.md          # Documentation
```

## 🔧 Technical Implementation

### Multer Configuration
```javascript
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1 // Only one file at a time
  }
});
```

### File Processing
```javascript
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileMetadata = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  };
  
  res.json(fileMetadata);
});
```

### Key Features

1. **File Upload Handling**: Uses Multer middleware for multipart/form-data
2. **Memory Storage**: Files stored in memory, not saved to disk
3. **File Size Limit**: Maximum 50MB file size
4. **Error Handling**: Comprehensive error responses
5. **All File Types**: Accepts any file type
6. **Metadata Extraction**: Returns name, type, and size

### File Field Requirements
- **Field name must be**: `upfile`
- **Form encoding**: `multipart/form-data`
- **HTTP method**: POST

## 🚀 Deployment

### Railway (Recommended)
1. Push code to GitHub repository
2. Connect Railway to GitHub repo
3. Railway auto-detects Node.js and deploys
4. Generate domain in Settings → Networking

### Environment Considerations
- **Memory Usage**: Files stored in memory during processing
- **File Size**: 50MB limit suitable for most use cases
- **Cleanup**: Files automatically garbage collected after response

## 📦 Dependencies

### Production
- **Express.js**: Web framework and API server
- **CORS**: Cross-origin resource sharing
- **Multer**: Multipart/form-data handling for file uploads

### Development
- **Nodemon**: Auto-reload during development

## ✅ FreeCodeCamp Requirements

- [x] **Test 1**: Provide own project URL (not example URL)
- [x] **Test 2**: Form includes file upload functionality
- [x] **Test 3**: File input field has `name` attribute set to `upfile`
- [x] **Test 4**: Response includes file `name`, `type`, and `size` in JSON

## 🧪 Testing Guide

### Frontend Testing
1. **Visit Homepage**: Test the interactive interface
2. **Select File**: Choose any file type
3. **Upload File**: Submit form and view metadata
4. **Test Different Types**: Try various file formats

### API Testing with cURL
```bash
# Test with text file
echo "Hello World" > test.txt
curl -X POST http://localhost:3000/api/fileanalyse \
  -F "upfile=@test.txt"

# Test with empty request (should fail)
curl -X POST http://localhost:3000/api/fileanalyse

# Test health endpoint
curl http://localhost:3000/api/health
```

### API Testing with JavaScript
```javascript
const formData = new FormData();
formData.append('upfile', fileInput.files[0]);

fetch('/api/fileanalyse', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🔍 Supported File Types

### Common Types
- **Text**: .txt, .md, .csv, .log
- **Images**: .jpg, .png, .gif, .svg, .webp
- **Documents**: .pdf, .doc, .docx, .rtf
- **Spreadsheets**: .xls, .xlsx, .csv
- **Archives**: .zip, .rar, .tar, .gz
- **Videos**: .mp4, .avi, .mov, .mkv
- **Audio**: .mp3, .wav, .flac, .ogg

### MIME Type Examples
```json
{
  "name": "document.pdf",
  "type": "application/pdf",
  "size": 1048576
}

{
  "name": "image.png", 
  "type": "image/png",
  "size": 524288
}

{
  "name": "data.json",
  "type": "application/json", 
  "size": 2048
}
```

## 🐛 Error Handling

### File Upload Errors
```json
{
  "error": "No file uploaded. Please select a file with the name \"upfile\"."
}

{
  "error": "File too large. Maximum size is 50MB."
}

{
  "error": "Unexpected field name. Use \"upfile\" as the field name."
}
```

### Server Errors
```json
{
  "error": "Internal server error while processing file"
}
```

## 📈 Additional Endpoints

### Health Check
```
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "File Metadata Microservice",
  "upload_limits": {
    "max_file_size": "50MB",
    "max_files": 1,
    "field_name": "upfile"
  }
}
```

### API Information
```
GET /api/info
```

**Response:** Complete API documentation

### Test Upload Form
```
GET /api/test-upload-form
```

**Response:** Simple HTML form for testing uploads

## 💾 File Storage

**Current Implementation:**
- **Memory Storage**: Files stored in RAM during processing
- **No Persistence**: Files not saved to disk
- **Automatic Cleanup**: Memory freed after response sent

**Production Considerations:**
- **File Size Limits**: Prevent memory exhaustion
- **Rate Limiting**: Control upload frequency
- **Virus Scanning**: Add security checks for production

## 🔒 Security Considerations

### Current Security
- **File Size Limits**: Prevents large file attacks
- **Memory Storage**: No persistent file storage
- **MIME Type Detection**: Automatic type detection

### Production Recommendations
- **File Type Validation**: Restrict allowed file types
- **Virus Scanning**: Scan uploaded files
- **Rate Limiting**: Prevent abuse
- **Authentication**: Add user authentication if needed

## 📝 Author

**trucvhc** - Data Engineer  
- GitHub: [@trucvhc](https://github.com/trucvhc)

Created for FreeCodeCamp Back End Development and APIs Certification

## 📄 License

MIT License
