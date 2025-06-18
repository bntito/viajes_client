import { useEffect, useState } from "react";
import "./resumenFinanciero.css";

export default function ResumenFinanciero() {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const apiSueldos = `${hostServer}/api/sueldomensual`;
  const apiGastos = `${hostServer}/api/gasto`;
  const apiAhorro = `${hostServer}/api/ahorro`;

  const [sueldo, setSueldo] = useState(0);
  const [descuentos, setDescuentos] = useState(0);
  const [usoTicket, setUsoTicket] = useState(0);
  const [adelanto, setAdelanto] = useState(0);
  const [gastos, setGastos] = useState([]);
  const [ahorro, setAhorro] = useState(0);
  const [diasRestantes, setDiasRestantes] = useState(0);

  // Nueva moneda base: USD
  const tasaMXN = 17.3;
  const tasaUYU = 38.5;

  useEffect(() => {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const año = hoy.getFullYear();

    const fechaObjetivo = new Date("2025-07-06T00:00:00");
    const diferencia = fechaObjetivo - hoy;
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    setDiasRestantes(dias > 0 ? dias : 0);

    const fetchSueldos = async () => {
      try {
        const mesConDosDigitos = mes.toString().padStart(2, "0");
        const resSueldo = await fetch(`${apiSueldos}?mes=${mesConDosDigitos}&anio=${año}`);
        const dataSueldo = await resSueldo.json();

        const sueldosFiltrados = dataSueldo.dataServerResult.filter(
          (item) => item.mes === mesConDosDigitos && item.año === año
        );

        if (sueldosFiltrados.length > 0) {
          const totalSueldo = sueldosFiltrados.reduce((acc, item) => acc + parseFloat(item.sueldoMensual), 0);
          const totalAdelanto = sueldosFiltrados.reduce((acc, item) => acc + parseFloat(item.adelanto), 0);
          const totalDescuentos = sueldosFiltrados.reduce((acc, item) => acc + parseFloat(item.descuentos), 0);
          const totalTicket = sueldosFiltrados.reduce((acc, item) => acc + parseFloat(item.usoTicketComida), 0);

          // Supongamos que vienen en USD ahora
          setSueldo(totalSueldo);
          setAdelanto(totalAdelanto);
          setDescuentos(totalDescuentos);
          setUsoTicket(totalTicket);
        }
      } catch (error) {
        console.error("Error al cargar sueldos:", error);
      }
    };

    const fetchGastos = async () => {
      try {
        const resGastos = await fetch(`${apiGastos}?mes=${mes.toString().padStart(2, "0")}&anio=${año}`);
        const dataGastos = await resGastos.json();

        const gastosFiltrados = dataGastos.dataServerResult.filter((gasto) => {
          const fechaGasto = new Date(gasto.fecha);
          return fechaGasto.getMonth() + 1 === mes && fechaGasto.getFullYear() === año;
        });

        setGastos(gastosFiltrados);
      } catch (error) {
        console.error("Error al cargar gastos:", error);
      }
    };

    const fetchAhorros = async () => {
      try {
        const resAhorro = await fetch(apiAhorro);
        const dataAhorro = await resAhorro.json();

        const totalAhorro = dataAhorro.dataServerResult.reduce(
          (acc, item) => acc + parseFloat(item.monto),
          0
        );

        setAhorro(totalAhorro);
      } catch (error) {
        console.error("Error al cargar ahorros:", error);
      }
    };

    fetchSueldos();
    fetchGastos();
    fetchAhorros();
  }, []);

  const totalGastos = gastos.reduce((acc, compra) => {
    if (!compra.gastos) return acc;
    const sumaGastosCompra = compra.gastos.reduce(
      (subAcc, gasto) => subAcc + parseFloat(gasto.monto || 0),
      0
    );
    return acc + sumaGastosCompra;
  }, 0);

  const restante = sueldo - descuentos - adelanto - totalGastos;

  const convertir = (valor, tasa) => (valor * tasa).toFixed(2);

  return (
    <div className="resumen-financiero">
      <div className="dias-cobro">
        Días hasta el domingo 06 de julio:{" "}
        <strong className="dias-numero">{diasRestantes}</strong>
      </div>

      <div className="resumen-tabla">
        <div className="resumen-encabezado">
          <div className="columna">Concepto</div>
          <div className="columna">USD</div>
          <div className="columna">MXN</div>
          <div className="columna">UYU</div>
        </div>

        <div className="resumen-fila">
          <div className="columna">Saldo restante</div>
          <div className="columna">U$S {restante.toFixed(2)}</div>
          <div className="columna">$ {convertir(restante, tasaMXN)}</div>
          <div className="columna">$ {convertir(restante, tasaUYU)}</div>
        </div>

        <div className="resumen-fila">
          <div className="columna">Total gastado</div>
          <div className="columna">U$S {totalGastos.toFixed(2)}</div>
          <div className="columna">$ {convertir(totalGastos, tasaMXN)}</div>
          <div className="columna">$ {convertir(totalGastos, tasaUYU)}</div>
        </div>
      </div>
    </div>
  );
}
