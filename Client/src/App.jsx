import {React,useState,useEffect} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Components/Pages/Home';
import Quiz from './Components/Pages/Quiz';
import Signup from './Components/Pages/Signup';
import Login from './Components/Pages/Login';
import Results from './Components/Pages/Results';

const App =()=>{
  const [progress, setProgress] = useState(0)
  const Layout=()=>{
    const location=useLocation();
  }
  
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="" element={<Home />} />
              <Route path="/Quiz" element={
                <ProtectedRoute>
                  <Quiz/>
                </ProtectedRoute>
              } />
              <Route path="/Signup" element={<Signup/>} />
              <Route path="/Login" element={<Login/>} />
              <Route path="/Results" element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } />
              {/* <Route path="" element={<1V1 />} />
              <Route path="" element={<Custom />} /> */}
            </Routes>
          </div>
          {location.pathname!=='/Signup' && location.pathname!=='/Login' && <Footer />}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App