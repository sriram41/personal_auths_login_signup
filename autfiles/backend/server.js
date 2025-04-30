require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// CORS Configuration
// const allowedOrigins = [
//   'https://sriram-khandavilli-personal-auths-login-signup.vercel.app',
//   'http://localhost:3000'
// ];


const allowedOrigins = [
  'https://sriram-khandavilli-personal-auths-login-signup.vercel.app',
  'http://localhost:3000',
  'https://personal-auths-login-signup.onrender.com' // Add this if your frontend is hosted here
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://msri81130405:C0kRB0FnR9vIFddg@autfilescluster.1xaitny.mongodb.net/autfilesdatabase?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// User Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: 'autfilescollection' });

const User = mongoose.model('User', UserSchema);

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';


app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Enhanced validation with better error messages
    if (!name && !email && !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required (name, email, password)',
        received: req.body
      });
    }
    
    if (!name) {
      return res.status(400).json({ 
        success: false,
        message: 'Name is required' 
      });
    }
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }
    
    if (!password) {
      return res.status(400).json({ 
        success: false,
        message: 'Password is required' 
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword 
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN 
    });
    
    res.status(201).json({ 
      success: true,
      token, 
      userId: user._id, 
      name: user.name,
      message: 'User created successfully'
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});
// Routes
// app.post('/api/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
    
//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'All fields are required' 
//       });
//     }
    
//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'User already exists' 
//       });
//     }
    
//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);
    
//     // Create user
//     const user = new User({ 
//       name, 
//       email, 
//       password: hashedPassword 
//     });
    
//     await user.save();
    
//     // Generate token
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { 
//       expiresIn: JWT_EXPIRES_IN 
//     });
    
//     res.status(201).json({ 
//       success: true,
//       token, 
//       userId: user._id, 
//       name: user.name,
//       message: 'User created successfully'
//     });
    
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error' 
//     });
//   }
// });

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN 
    });
    
    res.json({ 
      success: true,
      token, 
      userId: user._id, 
      name: user.name,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ 
    success: true,
    message: 'This is protected data', 
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Authorization token required' 
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      success: false,
      message: 'CORS policy: Request not allowed' 
    });
  }
  
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});



// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const app = express();


// // Enhanced CORS configuration
// const allowedOrigins = [
//   'https://sriram-khandavilli-personal-auths-login-signup.vercel.app',
//   'http://localhost:3000' // For development
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // // Enhanced CORS configuration
// // const allowedOrigins = [
// //   'https://sriram-khandavilli-personal-auths-login-signup.vercel.app',
// //   'http://localhost:3000'
// // ];

// // app.use(cors({
// //   origin: function (origin, callback) {
// //     // Allow requests with no origin (like mobile apps or curl requests)
// //     if (!origin) return callback(null, true);
    
// //     if (allowedOrigins.indexOf(origin) !== -1) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error('Not allowed by CORS'));
// //     }
// //   },
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// app.use(express.json());

// // MongoDB Connection
// const MONGODB_URI = process.env.MONGODB_URI;
// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   retryWrites: true,
//   w: 'majority'
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => {
//   console.error('MongoDB connection error:', err);
//   process.exit(1);
// });

// // User Model
// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// }, { collection: 'autfilescollection' });

// const User = mongoose.model('User', UserSchema);

// const JWT_SECRET = process.env.JWT_SECRET;

// // Routes
// app.post('/api/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
    
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
    
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
    
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();
    
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
//     res.status(201).json({ 
//       token, 
//       userId: user._id, 
//       name: user.name,
//       message: 'User created successfully'
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }
    
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
    
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
    
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
//     res.json({ 
//       token, 
//       userId: user._id, 
//       name: user.name,
//       message: 'Login successful'
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.get('/api/protected', authenticateToken, (req, res) => {
//   res.json({ 
//     message: 'This is protected data', 
//     user: req.user,
//     timestamp: new Date().toISOString()
//   });
// });

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
  
//   if (!token) {
//     return res.status(401).json({ message: 'Authorization token required' });
//   }
  
//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }
//     req.user = user;
//     next();
//   });
// }

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
// });












// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// const MONGODB_URI = process.env.MONGODB_URI || 
//   'mongodb+srv://msri81130405:C0kRB0FnR9vIFddg@autfilescluster.1xaitny.mongodb.net/autfilesdatabase?retryWrites=true&w=majority';

// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   retryWrites: true,
//   w: 'majority'
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => {
//   console.error('MongoDB connection error:', err);
//   process.exit(1); // Exit process on connection failure
// });

// // User Model
// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// }, { collection: 'autfilescollection' }); // Explicit collection name

// const User = mongoose.model('User', UserSchema);

// // JWT Secret - Should be in .env file
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// // Routes
// app.post('/api/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
    
//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
    
//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
    
//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);
    
//     // Create user
//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();
    
//     // Generate token
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
//     res.status(201).json({ 
//       token, 
//       userId: user._id, 
//       name: user.name,
//       message: 'User created successfully'
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // Validation
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }
    
//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
    
//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
    
//     // Generate token
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
//     res.json({ 
//       token, 
//       userId: user._id, 
//       name: user.name,
//       message: 'Login successful'
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Protected route example
// app.get('/api/protected', authenticateToken, (req, res) => {
//   res.json({ 
//     message: 'This is protected data', 
//     user: req.user,
//     timestamp: new Date().toISOString()
//   });
// });

// // Middleware to authenticate token
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
  
//   if (!token) {
//     return res.status(401).json({ message: 'Authorization token required' });
//   }
  
//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }
//     req.user = user;
//     next();
//   });
// }

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something broke!' });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`MongoDB connected to: autfilesdatabase.autfilescollection`);
// });



// // require('dotenv').config();
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');

// // const app = express();

// // // Middleware
// // app.use(cors());
// // app.use(express.json());

// // // MongoDB Connection
// // mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://msri81130405:C0kRB0FnR9vIFddg@autfilescluster.1xaitny.mongodb.net/', {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true
// //   })
// //   .then(() => console.log('Connected to MongoDB'))
// //   .catch(err => console.error('MongoDB connection error:', err));

// // // User Model
// // const UserSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   password: { type: String, required: true }
// // });

// // const User = mongoose.model('User', UserSchema);

// // // JWT Secret
// // const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// // // Routes
// // app.post('/api/signup', async (req, res) => {
// //   try {
// //     const { name, email, password } = req.body;
    
// //     // Check if user exists
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ message: 'User already exists' });
// //     }
    
// //     // Hash password
// //     const hashedPassword = await bcrypt.hash(password, 10);
    
// //     // Create user
// //     const user = new User({ name, email, password: hashedPassword });
// //     await user.save();
    
// //     // Generate token
// //     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
// //     res.status(201).json({ token, userId: user._id, name: user.name });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // app.post('/api/login', async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
    
// //     // Find user
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(400).json({ message: 'Invalid credentials' });
// //     }
    
// //     // Check password
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: 'Invalid credentials' });
// //     }
    
// //     // Generate token
// //     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
// //     res.json({ token, userId: user._id, name: user.name });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Protected route example
// // app.get('/api/protected', authenticateToken, (req, res) => {
// //   res.json({ message: 'This is protected data', user: req.user });
// // });

// // // Middleware to authenticate token
// // function authenticateToken(req, res, next) {
// //   const authHeader = req.headers['authorization'];
// //   const token = authHeader && authHeader.split(' ')[1];
  
// //   if (!token) return res.sendStatus(401);
  
// //   jwt.verify(token, JWT_SECRET, (err, user) => {
// //     if (err) return res.sendStatus(403);
// //     req.user = user;
// //     next();
// //   });
// // }

// // // Start server
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
