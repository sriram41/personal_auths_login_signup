import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
                      'https://personal-auths-login-signup.onrender.com';

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/signup`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          userId: response.data.userId,
          name: response.data.name
        }));
        
        setIsAuthenticated(true);
        navigate('/');
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      
      let errorMessage = 'Signup failed. Please try again.';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (err.message === 'Network Error') {
        errorMessage = `Cannot connect to server at ${API_BASE_URL}`;
      } else if (err.response) {
        errorMessage = err.response.data?.message || 
                      `Server error: ${err.response.status}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1 className="signup-title">Sign Up</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label className="form-label">Full Name:</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address:</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            disabled={loading}
          />
          <small className="password-hint">(Minimum 6 characters)</small>
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        
        <div className="login-prompt">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;



// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../../styles/auth.css';

// const Signup = ({ setIsAuthenticated }) => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       setLoading(true);
//       setError('');

//       // Basic client-side validation
//       if (!name || !email || !password) {
//         setError('All fields are required');
//         setLoading(false);
//         return;
//       }

//       if (password.length < 6) {
//         setError('Password must be at least 6 characters');
//         setLoading(false);
//         return;
//       }
  
//       try {
//         console.log('Sending signup request...', { name, email, password });
//         const response = await axios.post('http://localhost:5000/api/signup', {
//           name,
//           email,
//           password
//         });
        
//         console.log('Signup response:', response.data);
        
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('user', JSON.stringify({
//           userId: response.data.userId,
//           name: response.data.name
//         }));
//         setIsAuthenticated(true);
//         navigate('/');
//       } catch (err) {
//         console.error('Signup error:', err);
//         const errorMessage = err.response?.data?.message || 
//                            err.message || 
//                            'Signup failed';
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     return (
//       <div className="auth-container">
//         <form className="auth-form" onSubmit={handleSubmit}>
//           <h1 className="auth-title">Signup</h1>
//           {error && <p className="error-message">{error}</p>}
//           <div className="form-group">
//             <label className="form-label">Name:</label>
//             <input
//               type="text"
//               className="form-input"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               disabled={loading}
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Email:</label>
//             <input
//               type="email"
//               className="form-input"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               disabled={loading}
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Password (min 6 characters):</label>
//             <input
//               type="password"
//               className="form-input"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               minLength="6"
//               disabled={loading}
//             />
//           </div>
//           <button 
//             type="submit" 
//             className="submit-btn"
//             disabled={loading}
//           >
//             {loading ? 'Creating account...' : 'Signup'}
//           </button>
//           <p className="login-link">
//             Already have an account? <a href="/login">Login</a>
//           </p>
//         </form>
//       </div>
//     );
// };

// export default Signup;




// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import '../../styles/auth.css';


// // const Signup = ({ setIsAuthenticated }) => {
// //     const [name, setName] = useState('');
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [error, setError] = useState('');
// //     const navigate = useNavigate();
  
// //     const handleSubmit = async (e) => {
// //       e.preventDefault();
// //       try {
// //         const response = await axios.post('https://your-render-backend-url.onrender.com/api/signup', {
// //           name,
// //           email,
// //           password
// //         });
        
// //         localStorage.setItem('token', response.data.token);
// //         localStorage.setItem('user', JSON.stringify({
// //           userId: response.data.userId,
// //           name: response.data.name
// //         }));
// //         setIsAuthenticated(true);
// //         navigate('/');
// //       } catch (err) {
// //         setError(err.response?.data?.message || 'Signup failed');
// //       }
// //     };
  
  
// //   return (
// //     <div className="auth-container">
// //       <form className="auth-form" onSubmit={handleSubmit}>
// //         <h1 className="auth-title">Signup</h1>
// //         {error && <p className="error-message">{error}</p>}
// //         <div className="form-group">
// //           <label className="form-label">Name:</label>
// //           <input
// //             type="text"
// //             className="form-input"
// //             value={name}
// //             onChange={(e) => setName(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <div className="form-group">
// //           <label className="form-label">Email:</label>
// //           <input
// //             type="email"
// //             className="form-input"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <div className="form-group">
// //           <label className="form-label">Password:</label>
// //           <input
// //             type="password"
// //             className="form-input"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <button type="submit" className="submit-btn">Signup</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Signup;
