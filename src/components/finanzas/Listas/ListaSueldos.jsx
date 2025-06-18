import { useEffect, useState } from "react";
import "./listaSueldos.css";

export default function ListaSueldos() {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/sueldomensual`;

  const [sueldos, setSueldos] = useState([]);

  const tasaUYU = 38.5; // 1 USD = 39.5 UYU
  const tasaMXN = 17.2; // 1 USD = 17.2 MXN

  const convertir = (valorUSD, tasa) => (valorUSD * tasa).toFixed(2);

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
            <th>Monto (USD)</th>
            <th>Monto (UYU)</th>
            <th>Monto (MXN)</th>
          </tr>
        </thead>
        <tbody>
          {sueldos.map((sueldo) => {
            const sueldoMensual = parseFloat(sueldo.sueldoMensual || 0);

            return (
              <tr key={sueldo.id}>
                <td data-label="Fecha de depósito">
                  {`${String(sueldo.diaDeCobro).padStart(2, "0")}/${String(sueldo.mes).padStart(2, "0")}/${sueldo.año}`}
                </td>
                <td data-label="Monto (USD)">${sueldoMensual.toFixed(2)}</td>
                <td data-label="Monto (UYU)">${convertir(sueldoMensual, tasaUYU)}</td>
                <td data-label="Monto (MXN)">${convertir(sueldoMensual, tasaMXN)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
