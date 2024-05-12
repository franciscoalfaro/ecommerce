import React, { useEffect, useState } from 'react'
import { ComisionTransaccion } from './ComisionTransaccion'
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { FormattedNumber, IntlProvider } from 'react-intl';
import { Spiner } from '../../hooks/Spiner';

export const Orders = () => {
  const { auth } = useAuth({});
  const [order, setOrder] = useState([])
  const [orderNume, setOrderNume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    obtenerOrdenes()
  }, [])


  const obtenerOrdenes = async () => {
    try {
      const request = await fetch(Global.url + 'order/list', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }

      })
      const data = await request.json()

      if (data.status === "success") {
        setOrder(data.order)

      } else {
        console.log('code', data.message)
      }

    } catch (error) {
      console.log('code', error)

    }

  }


  const handleAddressClick = (order) => {
    getOrder(order)

  };


  const getOrder = async (order) => {

    let numeroOrder = order.orderNumber
    setError(null);

    // Validar que numeroOrder no sea null ni undefined
    if (!numeroOrder) {
      setError('Ingrese un número de orden válido')
      return
    }

    setLoading(true)

    try {
      const request = await fetch(Global.url + 'order/orderNum/' + numeroOrder, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })

      const data = await request.json()

      if (data.status === 'success') {
        setOrderNume(data.order);

      } else {
        setError('Error al obtener el número de orden')
      }
    } catch (error) {
      setError('Error de red al obtener el número de orden')
    } finally {
      setLoading(false)
    }


  }




  return (
    <>
      <div className="container mt-4">
        <h2>Mis ultimas compras</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Numero de orden</th>
                <th>Estado</th>
                <th>Boleta</th>
                <th>Mas</th>
              </tr>
            </thead>
            <tbody>
              {order.map((order, index) => (
                <tr key={index}>
                  <td>{order.orderNumber}</td>
                  <td className="card-text">{order.status === 'pending' ? 'Pendiente' : order.status === 'shipped' ? 'Enviado' : order.status === 'delivered' ? 'Entregado' : order.status === 'canceled' ? 'Cancelado' : order.status}</td>
                  <td>
                    <button className="btn btn-info btn-sm">Descargar Boleta</button>
                  </td>
                  <td>
                    <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleAddressClick(order)} data-toggle="modal" data-target="#exampleModal"> Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {loading && <Spiner></Spiner>}
      {error && <p>{error}</p>}

      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Detalle de Orden</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {orderNume && (
              <div>
                {orderNume.map((order, index) => (
                  <div className="modal-body" key={index}>
                    <p>Numero de orden: {order.orderNumber}</p>
                    <p><strong>Estado:</strong> {order.status === 'pending' ? 'Pendiente' : order.status === 'shipped' ? 'Enviado' : order.status === 'delivered' ? 'Entregado' : order.status === 'canceled' ? 'Cancelado' : order.status}</p>
                    <IntlProvider locale="es" defaultLocale="es">
                      <p className="card-text">
                        <strong>Total: $<FormattedNumber value={order.totalPrice} style="currency" currency="CLP" /></strong>
                      </p>
                    </IntlProvider>
                    <hr className="bg-white"></hr>
                    <p><strong>Dirección de envío</strong></p>
                    <p className="card-text">Dirección: {order.shippingAddress.direccion}</p>
                    <p className="card-text">Número: {order.shippingAddress.numero}</p>
                    <p className="card-text">Región: {order.shippingAddress.region}</p>
                    <p className="card-text">Ciudad: {order.shippingAddress.ciudad}</p>
                    <p className="card-text">Comuna: {order.shippingAddress.comuna}</p>
                    <p className="card-text">Teléfono: {order.shippingAddress.phone}</p>
                    <hr className="bg-white"></hr>
                    <p><strong>Productos</strong></p>
                    {order.products.map((product, index) => (
                      <div className="card bg-warning mt-3" key={index}>
                        <div className="card-body">
                          <h6 className="card-title">Producto #{index + 1}</h6>
                          <p className="card-text">Nombre: {product.product.name}</p>

                          <IntlProvider locale="es" defaultLocale="es">
                            <p className="card-text">
                              Precio unitario: $<FormattedNumber value={product.priceunitary} style="currency" currency="CLP" />
                            </p>
                          </IntlProvider>

                          <p className="card-text">Cantidad: {product.quantity}</p>
                          <p className="card-text">Talla: {product.size ?? 'Sin tamaño'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>






    </>

  )
}
