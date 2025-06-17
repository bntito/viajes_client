import Home from '../components/commons/home/Home';
import Finanzas from '../components/finanzas/Finanzas.jsx';
import HorasExtras from '../components/laboral/HorasExtras';

const routes = [
  {
    path: '/',
    element: <Finanzas />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/horas_extras',
    element: <HorasExtras />
  }
];

export default routes;