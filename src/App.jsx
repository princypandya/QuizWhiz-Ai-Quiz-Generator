import {React,useState} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Components/Pages/Home';
import Quiz from './Components/Pages/Quiz';
import Signup from './Components/Pages/Signup';
import Login from './Components/Pages/Login';

const App =()=>{
  const [progress, setProgress] = useState(0)
  const Layout=()=>{
    const location=useLocation();
  }
    return (
      <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/Quiz" element={<Quiz/>} />
            <Route path="/Signup" element={<Signup/>} />
            <Route path="/Login" element={<Login/>} />
            {/* <Route path="" element={<1V1 />} />
            <Route path="" element={<Results />} />
            <Route path="" element={<Custom />} /> */}
          </Routes>
        </div>
        {location.pathname!=='/Signup' && location.pathname!=='/Login' && <Footer />}
      </div>
    </Router>
    );
}


export default App