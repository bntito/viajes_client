import React, { useEffect, useState } from "react";
import "./listaGastos.css";

export default function ListaGastos() {
  const [gastos, setGastos] = useState([]);
  const [detallesAbiertos, setDetallesAbiertos] = useState({});

  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/gasto`;

  const tasaUYU = 38.5; // 1 USD = 38.5 UYU
  const tasaMXN = 17.2; // 1 USD = 17.2 MXN

  const convertir = (valorUSD, tasa) => (valorUSD * tasa).toFixed(2);

  // Función para formatear fecha a dd/mm/AAAA
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    if (isNaN(fecha)) return fechaStr; // si no es fecha válida, devuelvo el original

    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
  };

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const res = await fetch(api);
        const data = await res.json();
        setGastos(data.dataServerResult);
      } catch (error) {
        console.error("Error al obtener los gastos:", error);
      }
    };

    fetchGastos();
  }, []);

  const toggleDetalles = (id) => {
    setDetallesAbiertos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="gastos-lista">
      <h2 className="gastos-titulo">Listado de Compras</h2>
      <table className="gastos-tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total (USD)</th>
            <th>Total (UYU)</th>
            <th>Total (MXN)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto) => {
            const totalUSD = parseFloat(gasto.total);

            return (
              <React.Fragment key={gasto.id}>
                <tr>
                  <td data-label="Fecha">{formatearFecha(gasto.fecha)}</td>
                  <td data-label="Total USD">${totalUSD.toFixed(2)}</td>
                  <td data-label="Total UYU">${convertir(totalUSD, tasaUYU)}</td>
                  <td data-label="Total MXN">${convertir(totalUSD, tasaMXN)}</td>
                  <td data-label="Acciones">
                    <button onClick={() => toggleDetalles(gasto.id)}>
                      {detallesAbiertos[gasto.id] ? "Ocultar detalles" : "Ver detalles"}
                    </button>
                  </td>
                </tr>

                {detallesAbiertos[gasto.id] && gasto.gastos?.length > 0 && (
                  <tr>
                    <td colSpan="5">
                      <table className="articulos-detalle">
                        <thead>
                          <tr>
                            <th>Descripción artículo</th>
                            <th>USD</th>
                            <th>UYU</th>
                            <th>MXN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gasto.gastos.map((articulo, idx) => {
                            const montoUSD = parseFloat(articulo.monto);
                            return (
                              <tr key={idx}>
                                <td>{articulo.descripcion}</td>
                                <td>${montoUSD.toFixed(2)}</td>
                                <td>${convertir(montoUSD, tasaUYU)}</td>
                                <td>${convertir(montoUSD, tasaMXN)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
