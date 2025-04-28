import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthRoute from './components/AuthRoute';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth status on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <Router>
     
      <Routes>
        {/* Public routes */}
        <Route path="/about" element={<About />} />
        
        {/* Auth routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Signup setIsAuthenticated={setIsAuthenticated} />
            )
          } 
        />
        
        {/* Protected route */}
   
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;






// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useState } from 'react';
// import Navbar from './components/Navbar';

// import AuthRoute from './components/AuthRoute';
// import Home from './components/pages/Home';
// import About from './components/pages/About';
// import Login from './components/pages/Login';
// import Signup from './components/pages/Signup';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     localStorage.getItem('token') ? true : false
//   );

//   return (
//     <Router>
//       <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
//       <Routes>
//         <Route path="/about" element={<About />} />
//         <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
//         <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
//         <Route
//           path="/"
//           element={
//             <AuthRoute isAuthenticated={isAuthenticated}>
//               <Home />
//             </AuthRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
