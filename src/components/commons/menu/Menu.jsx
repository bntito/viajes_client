import { Link } from 'react-router-dom';
import './menu.css';

const Menu = ({ viewMenu, menuview }) => {
  return (
    <>
      <button className="menu-toggle" onClick={menuview}>
        ☰
      </button>

      <nav className={`menu ${viewMenu ? 'menu-show' : ''}`}>
        <ul className="menu-list">
          <li className="menu-item">
            <Link to="/" className="menu-link" onClick={menuview}>
              <i className="menu-icon fas fa-home"></i>
              Inicio
            </Link>
          </li>
          <li className="menu-item" onClick={menuview}>
            <Link to="/horas_extras" className="menu-link">
              <i className=""></i>
              Horas Extras
            </Link> 
             <Link to="/horas_extras" className="menu-link">
              <i className=""></i>
              Movimientos
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Menu;
