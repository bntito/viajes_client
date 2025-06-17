import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import Swal from "sweetalert2";
import "./ingresoMensual.css";

export default function RegistroSueldoMensual() {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/sueldomensual`;

  const { createData } = useFetch(null);

  const [form, setForm] = useState({
    fechaCobro: "",
    sueldoMensual: "",
    descuentos: "",
    usoTicketComida: "",
    adelanto: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [año, mes, diaDeCobro] = form.fechaCobro.split("-");

    const nuevoRegistro = {
      sueldoMensual: form.sueldoMensual,
      diaDeCobro,
      descuentos: form.descuentos,
      usoTicketComida: Number(form.usoTicketComida) * 190,
      adelanto: form.adelanto,
      mes,
      año
    };

    const res = await createData(api, nuevoRegistro);

    if (res) {
      Swal.fire({
        icon: "success",
        title: "Registro guardado correctamente",
        showConfirmButton: false,
        timer: 1000,
      });

      setForm({
        fechaCobro: "",
        sueldoMensual: "",
        descuentos: "",
        usoTicketComida: "",
        adelanto: ""
      });
    } else {
      Swal.fire("Error", "No se pudo guardar el registro", "error");
    }
  };

  const totalTickets = Number(form.usoTicketComida) * 190;

  return (
    <div className="mensual-form">
      <h2 className="mensual-titulo">Registro Sueldo Mensual</h2>
      <form onSubmit={handleSubmit} className="mensual-grid">
        <label>
          Fecha de Cobro:
          <input
            type="date"
            name="fechaCobro"
            value={form.fechaCobro}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Sueldo Mensual:
          <input
            type="number"
            name="sueldoMensual"
            value={form.sueldoMensual}
            onChange={handleChange}
            required
            min="0"
          />
        </label>

        <label>
          Descuentos:
          <input
            type="number"
            name="descuentos"
            value={form.descuentos}
            onChange={handleChange}
            min="0"
          />
        </label>

        <label>
          Ticket Comida Usado:
          <input
            type="number"
            name="usoTicketComida"
            value={form.usoTicketComida}
            onChange={handleChange}
            min="0"
          />
          <span className="ticket-total">Total: ${totalTickets.toFixed(2)}</span>
        </label>

        <label>
          Adelanto:
          <input
            type="number"
            name="adelanto"
            value={form.adelanto}
            onChange={handleChange}
            min="0"
          />
        </label>

        <button type="submit" className="mensual-submit">Registrar</button>
      </form>
    </div>
  );
}
