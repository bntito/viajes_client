import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routes from './routes/Index';
import Header from './components/commons/header/Header';
import Footer from './components/commons/footer/Footer';
import Menu from './components/commons/menu/Menu';

import './App.css';

const Bitácora = () => {
  const [viewMenu, setViewMenu] = useState(false);

  const menuview = () => {
    setViewMenu(!viewMenu);
  };

  return (
    <Router>
      <main className="bitacora-app">
        {/* <Header /> */}
        <div className='conteiner-general'>

          {/* <Menu viewMenu={viewMenu} menuview={menuview} /> */}
        
          <div className="bitacora-content">
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </div>
        </div>
        <Footer />
      </main>
    </Router>
  );
}

export default Bitácora;
