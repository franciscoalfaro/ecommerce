import React from 'react';

export const ProductAdmin = () => {
  return (
    <div className="container mt-4">
      <h4>Crear Nuevo Producto</h4>
      <form>
        <div className="mb-3">
          <label htmlFor="nombreProducto" className="form-label">Nombre del Producto</label>
          <input type="text" className="form-control" id="nombreProducto" placeholder="Ingrese el nombre del producto"></input>
        </div>
        <div className="mb-3">
          <label htmlFor="descripcionProducto" className="form-label">Descripción del Producto</label>
          <textarea className="form-control" id="descripcionProducto" rows="3" placeholder="Ingrese la descripción del producto"></textarea>
        </div>
        <div className="mb-3 d-flex align-items-center">
          <label htmlFor="crearcategoria" className="form-label me-2">Crear nueva Categoría</label>
          <i className="bi bi-plus-circle" data-toggle="modal" data-target="#exampleModal" style={{ cursor: 'pointer' }}></i>
        </div>
        <div className="mb-3">
          <label htmlFor="categoriaProducto" className="form-label">Categoría del Producto</label>
          <select className="form-select" id="categoriaProducto">
            <option defaultValue="Seleccione una categoría">Seleccione una categoría</option>
            <option>Cuidado de la Piel</option>
            <option>Cuidado del Cabello</option>
            <option>Maquillaje</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="stockProducto" className="form-label">Stock Disponible</label>
          <input type="number" className="form-control" id="stockProducto" placeholder="Ingrese el stock disponible"></input>
        </div>
        <div className="mb-3">
          <label htmlFor="imagenProducto" className="form-label">Imagen del Producto</label>
          <input type="file" className="form-control" id="imagenProducto" multiple></input>
        </div>
        <button type="submit" className="btn btn-primary">Subir Producto</button>
      </form>

      <br></br>

      {/* abrir modal de creación de categoría */}

      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel" >Crear Categoria</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="nombreCategoria" className="form-label">Nombre de la Categoría</label>
                  <input type="text" className="form-control" id="nombreCategoria" placeholder="Ingrese el nombre de la categoría"></input>
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


    </div>
  );
};
