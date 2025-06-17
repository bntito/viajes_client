import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import Swal from "sweetalert2";
import "./registroAhorro.css";

export default function RegistroAhorro() {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/ahorro`;

  const { createData } = useFetch(null);

  const [form, setForm] = useState({
    fecha: "",
    monto: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [año, mes, dia] = form.fecha.split("-");
    const nuevoRegistro = {
      fecha: form.fecha,
      monto: form.monto,
      dia,
      mes,
      año,
    };

    const res = await createData(api, nuevoRegistro);

    if (res) {
      Swal.fire({
        icon: "success",
        title: "Ahorro registrado",
        showConfirmButton: false,
        timer: 1000,
      });
      setForm({ fecha: "", monto: "" });
    } else {
      Swal.fire("Error", "No se pudo guardar el ahorro", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ahorro-form">
      <label>Ingreso de ahorro</label>
      <div className="input-group">
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="monto"
          placeholder="Monto"
          value={form.monto}
          onChange={handleChange}
          required
          min="0"
        />
      </div>
      <button type="submit">Guardar</button>
    </form>

  );
}
