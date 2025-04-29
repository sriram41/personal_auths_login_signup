import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/login`, 
        {
          email,
          password
        }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: response.data.userId,
        name: response.data.name
      }));
      setIsAuthenticated(true);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Login</h1>
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label className="form-label">Email:</label>
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
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <Link to="/signup" className="signup-link">
          Don't have an account? Sign up
        </Link>
      </form>
    </div>
  );
};

export default Login;






// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import './Login.css';

// const Login = ({ setIsAuthenticated }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await axios.post('http://localhost:5000/api/login', {
//         email,
//         password
//       });

//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify({
//         userId: response.data.userId,
//         name: response.data.name
//       }));
//       setIsAuthenticated(true);
      
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form className="login-form" onSubmit={handleSubmit}>
//         <h1 className="login-title">Login</h1>
//         {error && <p className="error-message">{error}</p>}
        
//         <div className="form-group">
//           <label className="form-label">Email:</label>
//           <input
//             type="email"
//             className="form-input"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             disabled={loading}
//           />
//         </div>
        
//         <div className="form-group">
//           <label className="form-label">Password:</label>
//           <input
//             type="password"
//             className="form-input"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             disabled={loading}
//           />
//         </div>
        
//         <button 
//           type="submit" 
//           className="submit-btn"
//           disabled={loading}
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>

//         <Link to="/signup" className="signup-link">
//           Don't have an account? Sign up
//         </Link>
//       </form>
//     </div>
//   );
// };

// export default Login;



// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // // import './Login.css';

// // const Login = ({ setIsAuthenticated }) => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');
    
// //     try {
// //       // API call to your backend login endpoint
// //       const response = await axios.post('http://localhost:5000/api/login', {
// //         email,
// //         password
// //       });

// //       // Store token and update auth state (THIS IS THE CRUCIAL PART)
// //       localStorage.setItem('token', response.data.token);
// //       localStorage.setItem('user', JSON.stringify({
// //         userId: response.data.userId,
// //         name: response.data.name
// //       }));
// //       setIsAuthenticated(true);
      
// //       // The protected route will automatically redirect to home
// //       // No need for manual navigation
// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Login failed');
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="auth-container">
// //       <form className="auth-form" onSubmit={handleSubmit}>
// //         <h1 className="auth-title">Login</h1>
// //         {error && <p className="error-message">{error}</p>}
        
// //         <div className="form-group">
// //           <label className="form-label">Email:</label>
// //           <input
// //             type="email"
// //             className="form-input"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             required
// //             disabled={loading}
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
// //             disabled={loading}
// //           />
// //         </div>
        
// //         <button 
// //           type="submit" 
// //           className="submit-btn"
// //           disabled={loading}
// //         >
// //           {loading ? 'Logging in...' : 'Login'}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Login;


// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import '../../styles/auth.css';


// // const Login = ({ setIsAuthenticated }) => {
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [error, setError] = useState('');
// //     const navigate = useNavigate();
  
// //     const handleSubmit = async (e) => {
// //       e.preventDefault();
// //       try {
// //         const response = await axios.post('https://your-render-backend-url.onrender.com/api/login', {
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
// //         setError(err.response?.data?.message || 'Login failed');
// //       }
// //     };
  
  
// //   return (
// //     <div className="auth-container">
// //       <form className="auth-form" onSubmit={handleSubmit}>
// //         <h1 className="auth-title">Login</h1>
// //         {error && <p className="error-message">{error}</p>}
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
// //         <button type="submit" className="submit-btn">Login</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Login;
