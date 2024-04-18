import React from 'react';

export const GestionProduct = () => {

  return (
    <>
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
                  <button className="btn btn-info btn-sm" data-toggle="modal" data-target="#exampleModal">Crear Stock</button>

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
                  <button className="btn btn-info btn-sm" data-toggle="modal" data-target="#exampleModal">Crear Stock</button>

                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* abrir modal de creación de crear stock */}

      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Crear Stock</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3 row">
                  <label htmlFor="nombreProducto" className="col-sm-4 col-form-label"></label>
                  <div className="col-sm-12">
                    <div className="input-group">
                      <span className="input-group-text">Nombre del Producto</span>
                      <input type="text" className="form-control" id="nombreProducto" readOnly defaultValue="Producto 1" />
                    </div>
                  </div>
                </div>

                <div className="mb-3 row">
                  <label htmlFor="stock" className="col-sm-4 col-form-label"></label>
                  <div className="col-sm-12">
                    <div className="input-group">
                      <span className="input-group-text">stock</span>
                      <input type="number" name='stock' className="form-control" id="stock" defaultValue="0" />
                    </div>
                  </div>
                </div>

                <div className="mb-3 row">
                  <label htmlFor="stock" className="col-sm-4 col-form-label"></label>
                  <div className="col-sm-12">
                    <div className="input-group">
                      <span className="input-group-text">ubicacion</span>
                      <input type="number" name='ubicacion' className="form-control" id="ubicacion" defaultValue="bodega" />
                    </div>
                  </div>
                </div>

              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
              <button type="submit" className="btn btn-primary">Crear Categoría</button>
            </div>
          </div>
        </div>
      </div>



    </>



  );
};
