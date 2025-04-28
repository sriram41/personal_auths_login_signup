import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();
    
    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('user');
    //     setIsAuthenticated(false);
    //     navigate('/login');
    // };

    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      // No need to navigate - the router will redirect automatically
    };
  
  return (
      <nav className="navbar">
      <ul className="nav-list">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/about" className="nav-link">About</Link></li>
        {!isAuthenticated ? (
            <>
            <li><Link to="/login" className="nav-link">Login</Link></li>
            <li><Link to="/signup" className="nav-link">Signup</Link></li>
          </>
        ) : (
            <li>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};


export default Navbar;