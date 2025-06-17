import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import Swal from "sweetalert2";
import "./listaHorasExtras.css";

export default function TablaHorasExtras() {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/horasextras`;
  const { dataServer, getData, deleteData, updateData } = useFetch();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [registroEdicion, setRegistroEdicion] = useState(null);
  
  useEffect(() => {
    if (!dataServer) getData(api);
  }, [getData, api, dataServer]);

  const handleDelete = async (id) => {
    const response = await deleteData(`${api}/${id}`);
    if (response) {
      Swal.fire({
        icon: "success",
        title: "Registro eliminado correctamente",
        showConfirmButton: false,
        timer: 1000,
      });
      getData(api); // Recargar datos
    } else {
      Swal.fire("Error", "No se pudo eliminar el registro", "error");
    }
  };

  const handleEdit = (registro) => {
    setRegistroEdicion(registro);
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await updateData(`${api}/${registroEdicion.id}`, registroEdicion);
    if (response) {
      Swal.fire({
        icon: "success",
        title: "Registro actualizado correctamente",
        showConfirmButton: false,
        timer: 1000,
      });
      setModalOpen(false);
      getData(api); // Recargar datos
    } else {
      Swal.fire("Error", "No se pudo actualizar el registro", "error");
    }
  };

  const renderTabla = () => {
    const registros = dataServer?.dataServerResult.dataServerResult || [];
    if (registros.length > 0) {
      return registros.map((registro) => (
        <tr key={registro.id}>
          <td>{registro.fecha || 'No disponible'}</td>
          <td>{registro.horasExtras || 'No'}</td>
          <td>{registro.ciudad ? 'Sí' : 'No'}</td>
          <td>{registro.tipoDia}</td>
          <td>{registro.descripcion || 'Sin descripción'}</td>
          <td>
            <button className="btn-editar" onClick={() => handleEdit(registro)}>✏️</button>
            <button className="btn-borrar" onClick={() => handleDelete(registro.id)}>🗑️</button>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan="6" style={{ textAlign: 'center' }}>
            No se encontraron registros.
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="tabla-container">
      <h2 className="tabla-titulo">Registros de Horas Extras</h2>
      {dataServer?.status === 200 ? (
        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Horas</th>
              <th>Ciudad</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>{renderTabla()}</tbody>
        </table>
      ) : (
        <p>No se pudieron cargar los registros o no hay datos.</p>
      )}

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h3>Editar Registro</h3>
            <form onSubmit={handleUpdate}>
              <label>
                Fecha:
                <input
                  type="date"
                  value={registroEdicion.fecha}
                  onChange={(e) => setRegistroEdicion({ ...registroEdicion, fecha: e.target.value })}
                />
              </label>
              <label>
                Horas Extras:
                <input
                  type="number"
                  value={registroEdicion.horasExtras}
                  onChange={(e) => setRegistroEdicion({ ...registroEdicion, horasExtras: e.target.value })}
                />
              </label>
              <label>
                Ciudad:
                <input
                  type="checkbox"
                  checked={registroEdicion.ciudad}
                  onChange={(e) => setRegistroEdicion({ ...registroEdicion, ciudad: e.target.checked })}
                />
              </label>
              <label>
                Tipo de Día:
                <select
                  value={registroEdicion.tipoDia}
                  onChange={(e) => setRegistroEdicion({ ...registroEdicion, tipoDia: e.target.value })}
                >
                  <option value="Semana">Semana</option>
                  <option value="Fin de Semana">Fin de Semana</option>
                </select>
              </label>
              <label>
                Descripción:
                <textarea
                  value={registroEdicion.descripcion}
                  onChange={(e) => setRegistroEdicion({ ...registroEdicion, descripcion: e.target.value })}
                />
              </label>
              <button type="submit">Actualizar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
