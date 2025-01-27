const mysql = require('mysql2');  // Import mysql2 for MySQL database connection
const bcrypt = require('bcryptjs');  // For hashing passwords
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');  // Import JWT for token generation and verification

const app = express();
const port = 5000;

// MySQL Database connection for User Registration, Login, and Job Applications
const jobPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',  // Your MySQL password
  database: 'job',  // Using the 'job' database for all data
  waitForConnections: true,
  connectionLimit: 250,
  queueLimit: 0
});
const corsOptions = {
  origin: 'http://localhost:5173', // React frontend URL
  methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization',  // Allowed headers
};

// Secret key for JWT
const JWT_SECRET = 's8973485iuhweir87435';  // Use a secure, environment-variable-based secret in production

// Middleware setup
app.use(cors());
app.use(cors(corsOptions));
app.use(bodyParser.json());  // Parse JSON request body

// Setup multer for file uploads (Resumes)
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/resumes/';
    cb(null, folder);  // Specify the folder for resumes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate unique filename for each uploaded file
  }
});

const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('You can only upload PDF files!'), false);  // Only allow PDFs
    }
    cb(null, true);
  }
});
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/images/';
    cb(null, folder);  // Specify the folder for images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate unique filename for each uploaded file
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB file size limit for images
  fileFilter: (req, file, cb) => {
    const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
    const extname = path.extname(file.originalname).toLowerCase();

    if (!imageMimeTypes.includes(file.mimetype)) {
      return cb(new Error('You can only upload image files!'), false);  // Validate image MIME type
    }

    if (!['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(extname)) {
      return cb(new Error('You can only upload image files with the following extensions: .jpg, .jpeg, .png, .gif, .bmp'), false);  // Validate file extension
    }

    cb(null, true);  // If file is valid, proceed
  }
});

// Upload Image endpoint
app.post('/upload-image', imageUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded!' });
  }

  const imageUrl = '/uploads/images/' + req.file.filename;

  const query = 'INSERT INTO image_uploads (image_url) VALUES (?)';
  jobPool.query(query, [imageUrl], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to store image data!' });
    }

    res.json({ success: true, message: 'Image uploaded successfully!', imageUrl });
  });
});
// Upload Resume endpoint
app.post('/uploadResume', resumeUpload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No resume file uploaded!' });
  }

  const resumeUrl = '/uploads/resumes/' + req.file.filename;

  // Insert resume URL into the database
  const query = 'INSERT INTO resume_uploads (resume_url) VALUES (?)';
  jobPool.query(query, [resumeUrl], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to store resume data!' });
    }

    res.json({ success: true, message: 'Resume uploaded successfully!', resumeUrl });
  });
});

app.post('/submit', (req, res) => {
  const {
    name,
    email,
    phone,
    job_position,
    previousJobCTC,
    expectedCTC,
    resume,
    selfIntroductionVideo,
    portfolio,
    skills,
    yearsOfExperience,
    monthsOfExperience
  } = req.body;

  // Validate essential fields
  if (!name || !email || !phone || !job_position) {
    return res.status(400).json({ success: false, message: 'Name, email, phone, and job position are required!' });
  }

  // Log incoming data for debugging
  console.log('Received form data:', req.body);

  // Convert the resume and selfIntroductionVideo to JSON objects (if not already)
  const resumeJSON = resume ? JSON.stringify(resume) : null;  // Convert resume object to JSON string
  const selfIntroductionVideoJSON = selfIntroductionVideo ? JSON.stringify(selfIntroductionVideo) : null;  // Convert video object to JSON string
  const skillsJSON = skills ? JSON.stringify(skills) : null;  // Convert skills array to JSON string

  // Insert data into the database
  const query = 'INSERT INTO job_applications (name, email, phone, job_position, previousJobCTC, expectedCTC, resume, selfIntroductionVideo, portfolio, skills, yearsOfExperience, monthsOfExperience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  jobPool.query(query, [
    name, email, phone, job_position, previousJobCTC, expectedCTC,
    resumeJSON, selfIntroductionVideoJSON, portfolio, skillsJSON,
    yearsOfExperience, monthsOfExperience
  ], (err, results) => {
    if (err) {
      console.error('Database error:', err);  // Log error for debugging
      return res.status(500).json({ success: false, message: 'Failed to submit application!', error: err.message });
    }

    res.json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: results.insertId,  // Return application ID
    });
  });
});


// ** Admin Login Endpoint ** 
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }

  const adminUsername = 'AdMiN@job';
  const adminPassword = 'adminpassword'; // admin access

  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Admin login successful!',
      token,  // Send token to client
    });
  }

  res.status(400).json({ message: 'Invalid admin credentials!' });
});


const verifyAdminToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized!' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: Admins only!' });
    }

    req.admin = decoded;  // Attach decoded token to the request for further use
    next();
  });
};
app.post('/admin/logout', verifyAdminToken, (req, res) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized!' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: Admins only!' });
    }

    req.admin = decoded;  // Attach decoded token to the request for further use

    // Remove token from client-side storage
    res.clearCookie('adminToken');

    res.status(200).json({ message: 'Admin logged out successfully!', redirect: '/adminauth' });
  });
});
// Serve static files (resumes, videos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ** Admin Routes **

app.get('/admin/get-applications', verifyAdminToken, (req, res) => {
  const query = 'SELECT * FROM job_applications;';
  jobPool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error fetching applications' });
    }
    res.json({ success: true, applications: results });
  });
});

// Setup multer for video file uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/videos/';
    cb(null, folder);  // Specify the folder for videos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate unique filename for each uploaded file
  }
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit for videos
  fileFilter: (req, file, cb) => {
    const videoMimeTypes = ['video/mp4', 'video/avi', 'video/mkv', 'video/webm', 'video/mov'];
    const extname = path.extname(file.originalname).toLowerCase();

    if (!videoMimeTypes.includes(file.mimetype)) {
      return cb(new Error('You can only upload video files!'), false);  // Validate video MIME type
    }

    if (!['.mp4', '.avi', '.mkv', '.webm', '.mov'].includes(extname)) {
      return cb(new Error('You can only upload video files with the following extensions: .mp4, .avi, .mkv, .webm, .mov'), false);  // Validate file extension
    }

    cb(null, true);  // If file is valid, proceed
  }
});

// Upload Video endpoint
app.post('/upload-video', videoUpload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No video file uploaded!' });
  }

  const videoUrl = '/uploads/videos/' + req.file.filename;

  const query = 'INSERT INTO video_uploads (video_url) VALUES (?)';
  jobPool.query(query, [videoUrl], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to store video data!' });
    }

    res.json({ success: true, message: 'Video uploaded successfully!', videoUrl });
  });
});

// User Registration endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    jobPool.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email is already in use!' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      jobPool.query(insertQuery, [username, email, hashedPassword], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'An error occurred during registration!' });
        }

        const { insertId, created_at } = results;
        res.status(200).json({
          message: 'Registration successful!',
          user: { id: insertId, username, email, created_at },
        });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during registration!' });
  }
});

// User Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required!' });
  }

  jobPool.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      },
    });
  });
});
// In your backend (Node.js)
app.delete('/admin/delete-application/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM job_applications WHERE id = ?';
  jobPool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to delete application' });
    }

    if (results.affectedRows > 0) {
      res.json({ success: true, message: 'Application deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Application not found' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
