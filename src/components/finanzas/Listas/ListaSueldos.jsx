import { useEffect, useState } from "react";
import "./listaSueldos.css";

export default function ListaSueldos() {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/sueldomensual`;

  const [sueldos, setSueldos] = useState([]);

  useEffect(() => {
    const fetchSueldos = async () => {
      try {
        const res = await fetch(api);
        const data = await res.json();
        if (res.ok) setSueldos(data.dataServerResult);
      } catch (error) {
        console.error("Error al obtener sueldos:", error);
      }
    };

    fetchSueldos();
  }, []);

  return (
    <div className="sueldos-lista">
      <h2 className="sueldos-titulo">Transferencias</h2>
      <table className="sueldos-tabla">
        <thead>
          <tr>
            <th>Fecha de depósito</th>
            <th>Monto</th>
            {/* <th>Uso Ticket Comida</th> */}
            {/* <th>Adelanto</th> */}
            {/* <th>Descuentos</th> */}
            {/* <th>Sueldo Líquido</th> */}
          </tr>
        </thead>
        <tbody>
          {sueldos.map((sueldo) => {
            const sueldoMensual = parseFloat(sueldo.sueldoMensual || 0);
            const descuentos = parseFloat(sueldo.descuentos || 0);
            const usoTicketComida = parseFloat(sueldo.usoTicketComida || 0);
            const adelanto = parseFloat(sueldo.adelanto || 0);
            const sueldoLiquido = sueldoMensual - descuentos;
            const ticketUnidad = 190;
            const cantidadTickets = usoTicketComida / ticketUnidad;

            return (
              <tr key={sueldo.id}>
                <td data-label="Fecha de depósito">
                  {`${String(sueldo.diaDeCobro).padStart(2, "0")}/${String(sueldo.mes).padStart(2, "0")}/${sueldo.año}`}
                </td>
                <td data-label="Monto">${sueldoMensual.toFixed(2)}</td>
                {/* <td data-label="Uso Ticket Comida">
                  ${usoTicketComida.toFixed(2)} ({cantidadTickets} ticket{cantidadTickets !== 1 ? "s" : ""})
                </td>
                <td data-label="Adelanto">${adelanto.toFixed(2)}</td>
                <td data-label="Descuentos">${descuentos.toFixed(2)}</td>
                <td data-label="Sueldo Líquido">${sueldoLiquido.toFixed(2)}</td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
