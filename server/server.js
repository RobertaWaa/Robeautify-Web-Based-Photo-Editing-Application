import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Necula123!', 
  database: 'robeautify', 
  waitForConnections: true,
  connectionLimit: 10
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  logger: true,
  debug: true
});

// Test endpoint
app.get('/', (req, res) => {
  res.send('Robeautify Backend Service is Running');
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and message are required fields' 
      });
    }

    const mailOptions = {
      from: `"Robeautify Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact: ${subject || 'No Subject'}`,
      text: `
        You've received a new message from the Robeautify contact form:
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject || 'Not specified'}
        
        Message:
        ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
        <hr>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Sent from Robeautify contact form</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully!' 
    });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later.'
    });
  }
});

// Email verification endpoint
app.post('/api/verify-email', async (req, res) => {
  try {
      const { token } = req.body;

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Update database
      const [updateResult] = await pool.query(
          'UPDATE users SET email_verified = TRUE WHERE id = ? AND verification_token = ?',
          [decoded.userId, token]
      );

      if (updateResult.affectedRows === 0) {
          return res.status(404).json({ 
              success: false, 
              error: 'User not found or token invalid' 
          });
      }

      // Get updated user data
      const [users] = await pool.query(
          'SELECT id, username, email, full_name as fullName, bio, profile_pic as profilePic, email_verified as emailVerified FROM users WHERE id = ?',
          [decoded.userId]
      );

      res.json({ 
          success: true,
          message: 'Email verified successfully',
          user: users[0]
      });

  } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ 
          success: false, 
          error: 'Failed to verify email' 
      });
  }
});

// User signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    const [existingEmail] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingEmail.length > 0) {
      return res.status(400).json({
        success: false,
        field: 'email',
        message: 'This email is already associated with an account.'
      });
    }

    // Hash password and create user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Generate auth token
    const token = jwt.sign(
      { userId: result.insertId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: result.insertId },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Store verification token in database
    await pool.query(
      'UPDATE users SET verification_token = ? WHERE id = ?',
      [verificationToken, result.insertId]
    );

    // Send verification email
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"Robeautify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Robeautify Account',
      html: `
        <h2>Welcome to Robeautify!</h2>
        <p>Thank you for creating an account. Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email Address</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create this account, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Return success response
    res.json({ 
      success: true,
      token,
      user: {
        id: result.insertId,
        name,
        email,
        fullName: name,
        bio: '',
        profilePic: 'default.jpg',
        emailVerified: false
      },
      message: 'Account created successfully! Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed due to server error'
    });
  }
});

app.post('/api/resend-verification', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ success: false });
    
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const [users] = await pool.query(
      'SELECT id, email FROM users WHERE id = ?',
      [decoded.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const user = users[0];
    const verificationToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Update verification token in database
    await pool.query(
      'UPDATE users SET verification_token = ? WHERE id = ?',
      [verificationToken, user.id]
    );

    // Send verification email
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"Robeautify" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Verify Your Robeautify Account',
      html: `
        <h2>Email Verification</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email Address</a>
        <p>This link will expire in 24 hours.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true,
      message: 'Verification email sent successfully' 
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to resend verification email' 
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Make sure this says 'email' not 'emailOrUsername'

    console.log('Received login request:', req.body); // Add this for debugging

    if (!email || !password) {
      console.log('Missing fields - email:', email, 'password:', password); // Debug log
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' // Update this message
      });
    }
    
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false,
        field: 'email',
        message: 'No account found with this email' 
      });
    }

    const user = users[0];
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return res.status(401).json({ 
        success: false,
        field: 'password',
        message: 'Incorrect password'
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        fullName: user.full_name,
        bio: user.bio,
        profilePic: user.profile_pic,
        emailVerified: user.email_verified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'An error occurred. Please try again later.' 
    });
  }
});

app.post('/api/verify-token', async (req, res) => {
  try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ success: false });
      
      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ success: false });

      const decoded = jwt.verify(token, JWT_SECRET);
      
      const [users] = await pool.query(
          'SELECT id, username, email, full_name, bio, profile_pic, email_verified FROM users WHERE id = ?', 
          [decoded.userId]
      );
      
      if (users.length === 0) return res.status(404).json({ success: false });

      res.json({ 
          success: true,
          user: {
              id: users[0].id,
              username: users[0].username,
              email: users[0].email,
              fullName: users[0].full_name,
              bio: users[0].bio,
              profilePic: users[0].profile_pic,
              emailVerified: users[0].email_verified
          }
      });
  } catch (error) {
      console.error('Verify token error:', error);
      res.status(500).json({ success: false });
  }
});

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/google-auth', async (req, res) => {
  try {
    const { credential } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    
    
    // Debugging - afișează datele primite de la Google
    console.log('Google Payload:', {
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    });
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || payload.given_name;

    // Verifică dacă utilizatorul există sau creează-l
    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [payload.email]
    );

    let user;
    if (existingUser.length > 0) {
      // Actualizăm datele dacă Google le-a modificat
      await pool.query(
        'UPDATE users SET full_name = ?, profile_pic = ? WHERE id = ?',
        [name, payload.picture, existingUser[0].id]
      );
      user = existingUser[0];
    } else {
      // Creăm cont nou
      const [result] = await pool.query(
        'INSERT INTO users (full_name, email, google_id, profile_pic, email_verified) VALUES (?, ?, ?, ?, TRUE)',
        [name, email, googleId, payload.picture]
      );
      
      const [newUser] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      );
      user = newUser[0];
    }

    // Generăm token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        profilePic: user.profile_pic || payload.picture,
        emailVerified: true
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Authentication failed',
      details: error.message 
    });
  }
});




// Forgot Password
app.post('/api/forgot-password', async (req, res) => {
  try {
      const { email } = req.body;

      if (!email) {
          return res.status(400).json({ 
              success: false, 
              error: 'Email is required' 
          });
      }

      const [users] = await pool.query(
          'SELECT id, email FROM users WHERE email = ?',
          [email]
      );

      if (users.length === 0) {
          return res.status(404).json({ 
              success: false, 
              error: 'No account associated with this email' 
          });
      }

      const user = users[0];
      const resetToken = jwt.sign(
          { userId: user.id },
          JWT_SECRET,
          { expiresIn: '1h' }
      );

      // Update token in database
      await pool.query(
          'UPDATE users SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?',
          [resetToken, user.id]
      );

      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
      
      const mailOptions = {
          from: `"Robeautify" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Robeautify Password Reset',
          html: `
              <h2>Password Reset Request</h2>
              <p>You requested a password reset for your Robeautify account.</p>
              <p>Click the link below to set a new password:</p>
              <a href="${resetLink}">${resetLink}</a>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this password reset, please ignore this email.</p>
          `
      };

      await transporter.sendMail(mailOptions);

      res.json({ 
          success: true,
          message: 'Password reset instructions have been sent to your email!'
      });
  } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ 
          success: false, 
          error: 'An error occurred. Please try again.' 
      });
  }
});

// Reset Password
app.post('/api/reset-password', async (req, res) => {
  try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
          return res.status(400).json({ 
              success: false, 
              error: 'Token and new password are required' 
          });
      }

      // Verify token
      let decoded;
      try {
          decoded = jwt.verify(token, JWT_SECRET);
      } catch (err) {
          return res.status(400).json({ 
              success: false, 
              error: 'Invalid or expired token' 
          });
      }

      // Verify token exists in database and hasn't expired
      const [users] = await pool.query(
          'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
          [token]
      );

      if (users.length === 0) {
          return res.status(400).json({ 
              success: false, 
              error: 'Invalid or expired token' 
          });
      }

      const userId = users[0].id;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset token
      await pool.query(
          'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
          [hashedPassword, userId]
      );

      res.json({ 
          success: true,
          message: 'Password has been reset successfully!'
      });
  } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ 
          success: false, 
          error: 'An error occurred while resetting your password' 
      });
  }
});

// Profile management
app.post('/api/update-profile', upload.single('profilePic'), async (req, res) => {
  try {
    const { username, email, fullName, bio, newPassword } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authorization token required' 
      });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check if new username is available
      if (username) {
        const [existingUsername] = await connection.query(
          'SELECT id FROM users WHERE username = ? AND id != ?',
          [username, userId]
        );
        
        if (existingUsername.length > 0) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            error: 'Username already taken'
          });
        }
      }

      // Check if new email is available
      if (email) {
        const [existingEmail] = await connection.query(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, userId]
        );
        
        if (existingEmail.length > 0) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            error: 'Email already in use'
          });
        }
      }

      // Build update query
      const updates = {
        ...(username && { username }),
        ...(email && { email, email_verified: false }), // Reset verification if email changed
        ...(fullName && { full_name: fullName }),
        ...(bio && { bio })
      };

      if (Object.keys(updates).length > 0) {
        await connection.query(
          'UPDATE users SET ? WHERE id = ?',
          [updates, userId]
        );
      }

      if (newPassword) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await connection.query(
          'UPDATE users SET password_hash = ? WHERE id = ?',
          [hashedPassword, userId]
        );
      }

      if (req.file) {
        await connection.query(
          'UPDATE users SET profile_pic = ? WHERE id = ?',
          [req.file.filename, userId]
        );
      }

      await connection.commit();

      // Get updated user data
      const [users] = await pool.query(
        'SELECT id, username, email, full_name as fullName, bio, profile_pic as profilePic, email_verified as emailVerified FROM users WHERE id = ?',
        [userId]
      );

      res.json({ 
        success: true,
        user: users[0]
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Profile update failed' 
    });
  }
});


app.get('/api/check-username', async (req, res) => {
  try {
      const { username } = req.query;
      
      if (!username || username.length < 3) {
          return res.json({ available: false });
      }

      const [existing] = await pool.query(
          'SELECT id FROM users WHERE username = ?', 
          [username]
      );
      
      res.json({ available: existing.length === 0 });
  } catch (error) {
      console.error('Username check error:', error);
      res.status(500).json({ available: false });
  }
});


// Add this to your server.js file

// Create table for user photos if it doesn't exist
const createPhotosTable = async () => {
  try {
      await pool.query(`
          CREATE TABLE IF NOT EXISTS user_photos (
              id INT AUTO_INCREMENT PRIMARY KEY,
              user_id INT NOT NULL,
              filename VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
      `);
      console.log('User photos table created or already exists');
  } catch (error) {
      console.error('Error creating user_photos table:', error);
  }
};

createPhotosTable();

const createProjectsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('User projects table created or already exists');
  } catch (error) {
    console.error('Error creating user_projects table:', error);
  }
};

createProjectsTable();


// GET user photos endpoint
app.get('/api/user-photos', async (req, res) => {
  console.log('User photos endpoint hit'); // Debug log
  try {
      const userId = req.query.userId;
      
      if (!userId) {
          return res.status(400).json({ 
              success: false, 
              error: 'User ID is required' 
          });
      }

      const [photos] = await pool.query(
          'SELECT id, filename FROM user_photos WHERE user_id = ? ORDER BY created_at DESC',
          [userId]
      );
      
      console.log('Photos found:', photos); // Debug log
      
      res.json({ 
          success: true, 
          photos: photos.map(photo => ({
              id: photo.id,
              filename: photo.filename,
              url: `/uploads/${photo.filename}`
          }))
      });
  } catch (error) {
      console.error('Error fetching user photos:', error);
      res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch photos' 
      });
  }
});

// Endpoint to save edited photo
app.post('/api/save-photo', upload.single('photo'), async (req, res) => {
  try {
    const { userId, metadata } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Photo file is required' 
      });
    }

    // Save to database
    const [result] = await pool.query(
      'INSERT INTO user_projects (user_id, filename, metadata) VALUES (?, ?, ?)',
      [userId, req.file.filename, metadata]
    );

    res.json({ 
      success: true,
      project: {
        id: result.insertId,
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        metadata: JSON.parse(metadata)
      }
    });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save project' 
    });
  }
});

// Start server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}`);
});