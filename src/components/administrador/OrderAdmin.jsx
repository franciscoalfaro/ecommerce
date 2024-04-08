import React from 'react';

export const OrderAdmin = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <h4>Estados de Envío</h4>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
              Envío 1
              <span className="badge bg-primary">En Proceso</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
              Envío 2
              <span className="badge bg-success">Enviado</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
              Envío 3
              <span className="badge bg-danger">Entregado</span>
            </li>
          </ul>
        </div>
        <div className="col-md-6">
          <h4>Actualizar Estado de Envío</h4>
          <form>
            <div className="mb-3">
              <label htmlFor="estadoEnvio" className="form-label">Seleccionar Envío</label>
              <select className="form-select" id="estadoEnvio">
                <option>Envío 1</option>
                <option>Envío 2</option>
                <option>Envío 3</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="nuevoEstado" className="form-label">Nuevo Estado</label>
              <select className="form-select" id="nuevoEstado">
                <option>En Proceso</option>
                <option>Enviado</option>
                <option>Entregado</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Actualizar Estado</button>
          </form>
        </div>
      </div>
    </div>
  );
};
