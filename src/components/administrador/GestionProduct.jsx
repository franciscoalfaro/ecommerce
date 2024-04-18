import React from 'react';

export const GestionProduct = () => {

  return (
    <div className="container mt-4">
      <h2>Gestión de Productos</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Producto 1</td>
              <td>Descripción del Producto 1</td>
              <td>perfumería</td>
              <td>10</td>
              <td>
                <button className="btn btn-danger btn-sm me-2">Eliminar</button>
                <button className="btn btn-info btn-sm me-2">Editar</button>
                <button className="btn btn-info btn-sm">Stock</button>
              </td>
            </tr>
            <tr>
              <td>Producto 2</td>
              <td>Descripción del Producto 2</td>
              <td>perfumería</td>
              <td>5</td>
              <td>
                <button className="btn btn-danger btn-sm me-2">Eliminar</button>
                <button className="btn btn-info btn-sm me-2">Editar</button>
                <button className="btn btn-info btn-sm">Stock</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
