import React from 'react'
import { NavLink } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export const Cart = () => {
  const { auth } = useAuth({})

  return (
    <section>
      <div className="container">
        <h2>Carrito de Compra</h2>
        <div className="row">
          <div className="col-md-8">
            <h4>Productos Agregados</h4>
            <ul className="list-group">

              <li className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <img src="assets/img/image1.jpg" alt="Nombre del Producto" className="product-image"></img>
                    <div>
                      <h5>Nombre del Producto</h5>
                      <p>Precio: $XX.XX</p>
                      <div className="d-flex align-items-center">
                        <p className="mr-2">Cantidad:</p>
                        <input type="number" className="form-control" defaultValue="1"></input>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-danger btn-remove">Eliminar</button>
                </div>
              </li>
              <li className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <img src="assets/img/image2.jpg" alt="Nombre del Producto" className="product-image"></img>
                    <div>
                      <h5>Nombre del Producto</h5>
                      <p>Precio: $XX.XX</p>
                      <div className="d-flex align-items-center">
                        <p className="mr-2">Cantidad:</p>
                        <input type="number" className="form-control" defaultValue="1"></input>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-danger btn-remove">Eliminar</button>
                </div>
              </li>
            </ul>

          </div>

        </div>
        <div className="text-center mt-4">

          {auth && auth._id ? (
            <NavLink to="/auth/checkout" className="btn btn-primary btn-checkout">Siguiente</NavLink>
          ) : (
            <NavLink to="/checkout" className="btn btn-primary btn-checkout">Siguiente</NavLink>
          )}


        </div>
      </div>
    </section>
  )
}
