import ResumenFinanciero from './ResumenFinanciero/ResumenFinanciero';
import RegistroAhorro from './IngresoAhorro/RegistroAhorro';
import IngresoGasto from './IngresoGasto/IngresoGasto';
import Sueldo from './IngresoMensual/IngresoMensual';
import ListaSueldos from './Listas/ListaSueldos';

import ListaGastos from './Listas/ListaGastos';

export default function Finanzas() {
  return (
    <div>
      <ResumenFinanciero />
      {/* <RegistroAhorro /> */}
      <IngresoGasto />
      <Sueldo />

      <ListaGastos />
      <ListaSueldos />
    </div>
  );
}