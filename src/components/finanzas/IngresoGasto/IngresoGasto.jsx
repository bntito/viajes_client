import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import Swal from "sweetalert2";
import "./ingresoGasto.css";

export default function IngresoGasto() {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/gasto`;

  const { createData } = useFetch(null);

  const [fecha, setFecha] = useState("");
  const [articulos, setArticulos] = useState([
    { descripcion: "", monto: "", moneda: "USD" },
  ]);

  const tasas = {
    USD: 1,
    UYU: 39.5,
    MXN: 17.2,
  };

  const convertirAMonedaBase = (monto, moneda) =>
    parseFloat(monto) / tasas[moneda];

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
  };

  const handleArticuloChange = (index, e) => {
    const { name, value } = e.target;
    const nuevosArticulos = [...articulos];
    nuevosArticulos[index][name] = value;
    setArticulos(nuevosArticulos);
  };

  const agregarArticulo = () => {
    setArticulos([...articulos, { descripcion: "", monto: "", moneda: "USD" }]);
  };

  const quitarArticulo = (index) => {
    setArticulos(articulos.filter((_, i) => i !== index));
  };

  const totalUSD = articulos.reduce((acc, item) => {
    const monto = parseFloat(item.monto);
    if (isNaN(monto)) return acc;
    return acc + convertirAMonedaBase(monto, item.moneda);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha) {
      Swal.fire("Error", "Debes ingresar la fecha", "error");
      return;
    }

    for (let i = 0; i < articulos.length; i++) {
      const { descripcion, monto } = articulos[i];
      if (!descripcion.trim() || !monto || isNaN(parseFloat(monto))) {
        Swal.fire(
          "Error",
          `Completa la descripción y un monto válido para el artículo #${i + 1}`,
          "error"
        );
        return;
      }
    }

    const compraCompleta = {
      fecha,
      total: totalUSD,
      articulos: articulos.map((item) => ({
        descripcion: item.descripcion,
        monto: convertirAMonedaBase(parseFloat(item.monto), item.moneda), // convertidos a USD
      })),
    };

    try {
      const res = await createData(api, compraCompleta);
      if (!res) throw new Error("Error guardando la compra");

      Swal.fire({
        icon: "success",
        title: "Compra guardada correctamente",
        showConfirmButton: false,
        timer: 1500,
      });

      setFecha("");
      setArticulos([{ descripcion: "", monto: "", moneda: "USD" }]);
    } catch {
      Swal.fire("Error", "No se pudo guardar la compra", "error");
    }
  };

  return (
    <div className="gastos-form">
      <h2 className="gastos-titulo-bis">Nuevo Gasto</h2>
      <form onSubmit={handleSubmit} className="gastos-grid">
        <label>
          Fecha:
          <input
            type="date"
            name="fecha"
            value={fecha}
            onChange={handleFechaChange}
            required
          />
        </label>

        {articulos.map((articulo, index) => (
          <div
            key={index}
            className="articulo-row"
            style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          >
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={articulo.descripcion}
              onChange={(e) => handleArticuloChange(index, e)}
              required
              style={{ flex: 3 }}
            />
            <input
              type="number"
              name="monto"
              placeholder="Monto"
              value={articulo.monto}
              onChange={(e) => handleArticuloChange(index, e)}
              required
              min="0"
              step="0.01"
              style={{ flex: 1 }}
            />
            <select
              name="moneda"
              value={articulo.moneda}
              onChange={(e) => handleArticuloChange(index, e)}
              style={{ flex: 1 }}
            >
              <option value="USD">USD</option>
              <option value="UYU">UYU</option>
              <option value="MXN">MXN</option>
            </select>
            {articulos.length > 1 && (
              <button
                type="button"
                onClick={() => quitarArticulo(index)}
                style={{ flex: "0 0 auto" }}
              >
                &times;
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={agregarArticulo}
          className="btn-add-art"
          style={{ marginTop: "0.5rem" }}
        >
          + Agregar artículo
        </button>

        <div className="gastos-total">
          <div className="total-row">
            <span><strong>Total USD:</strong></span>
            <span>U$S {totalUSD.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span><strong>Total UYU:</strong></span>
            <span>$ { (totalUSD * tasas.UYU).toFixed(2) }</span>
          </div>
          <div className="total-row">
            <span><strong>Total MXN:</strong></span>
            <span>$ { (totalUSD * tasas.MXN).toFixed(2) }</span>
          </div>
        </div>

        <button type="submit" className="gastos-submit" style={{ marginTop: "1rem" }}>
          Agregar
        </button>
      </form>
    </div>
  );
}
