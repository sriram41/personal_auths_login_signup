import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = ({ setIsAuthenticated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!name || !email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://personal-auths-login-signup.onrender.com/api/signup',
        {
          name,
          email,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Signup successful:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: response.data.userId,
        name: response.data.name
      }));
      setIsAuthenticated(true);
      
    } catch (err) {
      console.error('Signup error:', err);
      
      let errorMessage = 'Signup failed. Please try again.';
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || 
                      `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Check your connection.';
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
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address:</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password (min 6 characters):</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            disabled={loading}
          />
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
