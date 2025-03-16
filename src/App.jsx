import {React,useState} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Components/Pages/Home';

const App =()=>{
  const [progress, setProgress] = useState(0)

    return (
      <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="" element={<Home />} />
            {/* <Route path="" element={<1V1 />} />
            <Route path="" element={<Results />} />
            <Route path="" element={<Custom />} /> */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    );
}


export default App