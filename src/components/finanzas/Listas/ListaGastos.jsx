import React, { useEffect, useState } from "react";
import "./listaGastos.css";

export default function ListaGastos() {
  const [gastos, setGastos] = useState([]);
  const [detallesAbiertos, setDetallesAbiertos] = useState({});
  const [editandoGastoId, setEditandoGastoId] = useState(null);
  const [formEditar, setFormEditar] = useState({ fecha: "", total: "" });

  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/gasto`;

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

  const borrarGasto = async (id) => {
    const confirmacion = confirm("¿Estás seguro de que deseas borrar este gasto?");
    if (!confirmacion) return;

    try {
      const res = await fetch(`${api}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setGastos((prev) => prev.filter((gasto) => gasto.id !== id));
      } else {
        console.error("Error al borrar el gasto:", await res.text());
      }
    } catch (error) {
      console.error("Error al borrar el gasto:", error);
    }
  };

  const comenzarEdicion = (gasto) => {
    setEditandoGastoId(gasto.id);
    setFormEditar({ fecha: gasto.fecha, total: gasto.total });
  };

  const cancelarEdicion = () => {
    setEditandoGastoId(null);
    setFormEditar({ fecha: "", total: "" });
  };

  const guardarEdicion = async (id) => {
    try {
      const res = await fetch(`${api}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formEditar),
      });

      if (res.ok) {
        const updated = gastos.map((g) =>
          g.id === id ? { ...g, ...formEditar } : g
        );
        setGastos(updated);
        cancelarEdicion();
      } else {
        console.error("Error al editar el gasto:", await res.text());
      }
    } catch (error) {
      console.error("Error al editar el gasto:", error);
    }
  };

  return (
    <div className="gastos-lista">
      <h2 className="gastos-titulo">Listado de Compras</h2>
      <table className="gastos-tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto) => (
            <React.Fragment key={gasto.id}>
              <tr>
                <td data-label="Fecha">{gasto.fecha}</td>
                <td data-label="Total">${parseFloat(gasto.total).toFixed(2)}</td>
                <td data-label="Acciones">
                  <button onClick={() => toggleDetalles(gasto.id)}>
                    {detallesAbiertos[gasto.id] ? "Ocultar detalles" : "Ver detalles"}
                  </button>
                  <button onClick={() => comenzarEdicion(gasto)}>Editar</button>
                  <button onClick={() => borrarGasto(gasto.id)}>Borrar</button>
                </td>
              </tr>

              {editandoGastoId === gasto.id && (
                <tr>
                  <td colSpan="3">
                    <div className="fila-edicion">
                      <input
                        type="date"
                        value={formEditar.fecha}
                        onChange={(e) =>
                          setFormEditar((prev) => ({ ...prev, fecha: e.target.value }))
                        }
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={formEditar.total}
                        onChange={(e) =>
                          setFormEditar((prev) => ({ ...prev, total: e.target.value }))
                        }
                      />
                      <div className="botones-edicion">
                        <button onClick={() => guardarEdicion(gasto.id)}>Guardar</button>
                        <button onClick={cancelarEdicion}>Cancelar</button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {detallesAbiertos[gasto.id] && gasto.gastos?.length > 0 && (
                <tr>
                  <td colSpan="3">
                    <table className="articulos-detalle">
                      <thead>
                        <tr>
                          <th>Descripción artículo</th>
                          <th>Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gasto.gastos.map((articulo, idx) => (
                          <tr key={idx}>
                            <td>{articulo.descripcion}</td>
                            <td>${parseFloat(articulo.monto).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
