import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { useForm } from '../../hooks/useForm'
import { useParams } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { Spiner } from '../../hooks/Spiner'
import ReactTimeAgo from 'react-time-ago'
import { FormattedNumber, IntlProvider } from 'react-intl'


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
            <br></br>
            <form className="form-inline" onSubmit={getOrder}>
                <h6 className="mb-1">Seguimiento </h6>
                <br></br>
                <input type="number" name="order" className="form-control mr-sm-2" placeholder="seguimiento" required onChange={changed} />
                <button className="btn btn-primary" type="submit">Buscar</button>
            </form>
            <br></br>

            {loading && <Spiner></Spiner>}
            {error && <p>{error}</p>}

            {orderNume && (
                <div>
                    {orderNume.map((order, index) => (
                        <div key={index} className="card border-primary mb-3">
                            <div className="card-header">Orden #: {order.orderNumber}</div>
                            <div className="card-body text-primary">
                                <p className="card-text">Estado: {order.status}</p>

                                <IntlProvider locale="es" defaultLocale="es">
                                    <p className="card-text">
                                        Total: $<FormattedNumber value={order.totalPrice} style="currency" currency="CLP" />
                                    </p>
                                </IntlProvider>

                                <h4 className="card-title">Dirección de envío</h4>
                                <p className="card-text">Dirección: {order.shippingAddress && order.shippingAddress.direccion ? order.shippingAddress.direccion : 'N/A'}</p>
                                <p className="card-text">Número: {order.shippingAddress && order.shippingAddress.numero ? order.shippingAddress.numero : 'N/A'}</p>
                                <p className="card-text">Región: {order.shippingAddress && order.shippingAddress.region ? order.shippingAddress.region : 'N/A'}</p>
                                <p className="card-text">Ciudad: {order.shippingAddress && order.shippingAddress.ciudad ? order.shippingAddress.ciudad : 'N/A'}</p>
                                <p className="card-text">Comuna: {order.shippingAddress && order.shippingAddress.comuna ? order.shippingAddress.comuna : 'N/A'}</p>
                                <p className="card-text">Teléfono: {order.shippingAddress && order.shippingAddress.phone ? order.shippingAddress.phone : 'N/A'}</p>

                                <h4 className="card-title">Productos</h4>
                                {order.products.map((product, index) => (
                                    <div key={index} className="card border-secondary mb-3">
                                        <div className="card-header">Producto #{index + 1}</div>
                                        <div className="card-body text-secondary">
                                            <p className="card-text">Nombre: {product.product && product.product.name ? product.product.name : 'N/A'}</p>
                                            <IntlProvider locale="es" defaultLocale="es">
                                                <p className="card-text">
                                                    Precio unitario: $<FormattedNumber value={product.priceunitary ? product.priceunitary : 'N/A'} style="currency" currency="CLP" />
                                                </p>
                                            </IntlProvider>
                                            <p className="card-text">Cantidad: {product.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>

    )
}
