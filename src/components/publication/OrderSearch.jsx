import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { useForm } from '../../hooks/useForm'
import { useParams } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { Spiner } from '../../hooks/Spiner'
import ReactTimeAgo from 'react-time-ago'


export const OrderSearch = () => {

    const { auth } = useAuth({})
    const [orderNume, setOrderNume] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { form, changed } = useForm({})

    const getOrder = async (e) => {
        e.preventDefault()

        let numeroOrder = form.order

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
                                <p className="card-text">Status: {order.status}</p>
                                <p className="card-text">Total: ${order.totalPrice}</p>

                                <h4 className="card-title">Dirección de envío</h4>
                                <p className="card-text">Dirección: {order.shippingAddress.direccion}</p>
                                <p className="card-text">Número: {order.shippingAddress.numero}</p>
                                <p className="card-text">Región: {order.shippingAddress.region}</p>
                                <p className="card-text">Ciudad: {order.shippingAddress.cuidad}</p>
                                <p className="card-text">Comuna: {order.shippingAddress.comuna}</p>
                                <p className="card-text">Teléfono: {order.shippingAddress.phone}</p>

                                <h4 className="card-title">Productos</h4>
                                {order.products.map((product, index) => (
                                    <div key={index} className="card border-secondary mb-3">
                                        <div className="card-header">Producto #{index + 1}</div>
                                        <div className="card-body text-secondary">
                                            <p className="card-text">Nombre: {product.product.name}</p>
                                            <p className="card-text">Precio unitario: ${product.priceunitary}</p>
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
