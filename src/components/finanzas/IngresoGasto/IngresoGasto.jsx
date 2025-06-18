import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import Swal from "sweetalert2";
import "./ingresoGasto.css";

export default function IngresoGasto() {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/gasto`;

  const { createData } = useFetch(null);

  const [fecha, setFecha] = useState("");
  const [articulos, setArticulos] = useState([{ descripcion: "", monto: "" }]);

  const tasaUYU = 38.5; // 1 USD = 38.5 UYU
  const tasaMXN = 17.2; // 1 USD = 17.2 MXN

  const convertir = (usd, tasa) => (usd * tasa).toFixed(2);

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
    setArticulos([...articulos, { descripcion: "", monto: "" }]);
  };

  const quitarArticulo = (index) => {
    const nuevosArticulos = articulos.filter((_, i) => i !== index);
    setArticulos(nuevosArticulos);
  };

  const total = articulos.reduce((acc, item) => {
    const montoNum = parseFloat(item.monto);
    return acc + (isNaN(montoNum) ? 0 : montoNum);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha) {
      Swal.fire("Error", "Debes ingresar la fecha", "error");
      return;
    }

    for (let i = 0; i < articulos.length; i++) {
      if (
        !articulos[i].descripcion.trim() ||
        !articulos[i].monto ||
        isNaN(parseFloat(articulos[i].monto))
      ) {
        Swal.fire(
          "Error",
          `Por favor completa la descripción y monto válido del artículo #${i + 1}`,
          "error"
        );
        return;
      }
    }

    const compraCompleta = {
      fecha,
      total,
      articulos: articulos.map((item) => ({
        descripcion: item.descripcion,
        monto: parseFloat(item.monto),
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
      setArticulos([{ descripcion: "", monto: "" }]);
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
          style={{ marginTop: "0.5rem" }}
          className="btn-add-art"
        >
          + Agregar artículo
        </button>

       <div className="gastos-total" style={{ textAlign: "right", marginTop: "0.5rem" }}>
  <div>Total USD: U$S {total.toFixed(2)}</div>
  <div>Total UYU: $ { (total * 39.5).toFixed(2) }</div>
  <div>Total MXN: $ { (total * 17.2).toFixed(2) }</div>
</div>

        <button
          type="submit"
          className="gastos-submit"
          style={{ marginTop: "1rem" }}
        >
          Agregar
        </button>
      </form>
    </div>
  );
}