import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './components/Register';
import { AuthProvider } from './utils/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="container">
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;