import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { useForm } from '../../hooks/useForm'
import { useParams } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { Spiner } from '../../hooks/Spiner'
import ReactTimeAgo from 'react-time-ago'
import { FormattedNumber } from 'react-intl'


export const OrderSearch = () => {

    const { auth } = useAuth({})
    const [orderNume, setOrderNume] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { form, changed } = useForm({})

    const getOrder = async (e) => {
        e.preventDefault()

        let numeroOrder = form.order
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
                console.log(data.order)
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

            <div className="container">
                <div className="row">
                    <div className="col">
                        <br />
                        <form className="form-inline" onSubmit={getOrder}>
                            <h6 className="mb-1">Seguimiento </h6>
                            <br />
                            <input type="number" name="order" className="form-control mr-sm-2" placeholder="Seguimiento" required onChange={changed} />
                            <button className="btn btn-primary" type="submit">Buscar</button>
                        </form>
                        <br />

                    </div>
                    <div className="w-100">
                        {loading && <Spiner></Spiner>}
                        {error && <p>{error}</p>}

                        {orderNume && (
                            <div class="container mt-5">
                                {orderNume.map((order, index) => (
                                    <div className="row" key={index}>
                                        <div className="col-md-6">
                                            <div className="card mb-3">
                                                <div className="card-header bg-primary text-white">
                                                    Detalle de Orden {order.orderNumber}
                                                </div>
                                                <div className="card-body">
                                                    <p><strong>Estado:</strong>{order.status === 'pending' ? 'Pendiente' : order.status === 'shipped' ? 'Enviado' : order.status === 'delivered' ? 'Entregado' : order.status === 'canceled' ? 'Cancelado' : order.status}</p>
                                                    <p>
                                                        <strong>Total: $<FormattedNumber value={order.totalPrice} style="currency" currency="CLP" /></strong>
                                                    </p>

                                                    <hr></hr>
                                                    <p><strong>Dirección de envío</strong></p>
                                                    <p >Dirección: {order.shippingAddress && order.shippingAddress.direccion ? order.shippingAddress.direccion : 'N/A'}</p>
                                                    <p >Número: {order.shippingAddress && order.shippingAddress.numero ? order.shippingAddress.numero : 'N/A'}</p>
                                                    <p >Región: {order.shippingAddress && order.shippingAddress.region ? order.shippingAddress.region : 'N/A'}</p>
                                                    <p >Ciudad: {order.shippingAddress && order.shippingAddress.ciudad ? order.shippingAddress.ciudad : 'N/A'}</p>
                                                    <p >Comuna: {order.shippingAddress && order.shippingAddress.comuna ? order.shippingAddress.comuna : 'N/A'}</p>
                                                    <p >Teléfono: {order.shippingAddress && order.shippingAddress.phone ? order.shippingAddress.phone : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="card">
                                                <div className="card-header bg-secondary text-white">
                                                    Productos
                                                </div>
                                                <div className="card-body">
                                                    {order.products.map((product, index) => (
                                                        <div className="card mb-3">
                                                            <div className="card-body">
                                                                <h6 className="card-title">Producto #1</h6>
                                                                <p className="card-text">Nombre: {product.product && product.product.name ? product.product.name : 'N/A'}</p>
                                                                <p className="card-text">
                                                                    Precio unitario: $<FormattedNumber value={product.priceunitary ? product.priceunitary : 'N/A'} style="currency" currency="CLP" />
                                                                </p>
                                                                <p className="card-text">Cantidad: {product.quantity}</p>
                                                                <p className="card-text">Talla: {product.size ?? 'Sin tamaño'}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
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