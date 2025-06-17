import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import Swal from "sweetalert2";
import "./registroHorasExtras.css";

import ListaHorasExtras from './ListaHorasExtras';

export default function RegistroHorasExtras() {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/horasextras`;

  const { createData } = useFetch(null);

  const [form, setForm] = useState({
    fecha: "",
    horasExtras: "",
    ciudad: true,
    tipoDia: "Semana",
    descripcion: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const [año, mes, dia] = form.fecha.split("-");
    const fechaFormateada = `${dia}-${mes}-${año}`;
  
    const nuevoRegistro = { ...form, fecha: fechaFormateada };
  
    const res = await createData(api, nuevoRegistro);
  
    if (res) {
      Swal.fire({
        icon: "success",
        title: "Registro guardado correctamente",
        showConfirmButton: false,
        timer: 1000,
      });
  
      setForm({
        fecha: "",
        horasExtras: "",
        ciudad: true,
        tipoDia: "Semana",
        descripcion: "",
      });
    } else {
      Swal.fire("Error", "No se pudo guardar el registro", "error");
    }
  };
  

  return (
    <div className="registro-form">
      <h2 className="registro-titulo">Registro Horas Extras</h2>
      <form onSubmit={handleSubmit}>
        <label className="registro-label">
          Fecha:
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="registro-input"
          />
        </label>

        <label className="registro-label horas-label">
          Horas Extras:
          <input
            type="number"
            name="horasExtras"
            value={form.horasExtras}
            onChange={handleChange}
            className="registro-input"
          />
        </label>

        <label className="registro-label check-label">
          ¿En Ciudad?
          <input
            type="checkbox"
            name="ciudad"
            checked={form.ciudad}
            onChange={handleChange}
            className="registro-check"
          />
        </label>

        <label className="registro-label">
          Tipo de Día:
          <select
            name="tipoDia"
            value={form.tipoDia}
            onChange={handleChange}
            className="registro-select"
          >
            <option value="Semana">Semana</option>
            <option value="Fin de Semana">Fin de Semana</option>
          </select>
        </label>

        <label className="registro-label">
          Descripción:
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="registro-textarea"
          />
        </label>

        <button type="submit" className="registro-btn">
          Registrar
        </button>
      </form>
    </div>
  );
}
