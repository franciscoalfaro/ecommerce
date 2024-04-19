import React, { useEffect, useState } from 'react'
import useCart from '../../hooks/useCart';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { FormattedNumber, IntlProvider } from 'react-intl';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { regiones } from '../data/chile';
import { Global } from '../../helpers/Global';
import { Spiner } from '../../hooks/Spiner';


export const CheckoutRegister = () => {

    const { auth } = useAuth({});
    const { form, changed } = useForm({})
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    //funcionamiento del carrito 
    const { cart, removeFromCart, updateQuantity, totalItems } = useCart();
    const [newOrden, setNewOrden] = useState([])

    //metodo de pago
    const [showTransferArea, setShowTransferArea] = useState(false);


    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [address, setAddress] = useState([]);


    const getTotalPrice = () => {
        let totalPrice = 0;

        cart.forEach(item => {
            if (item.offerprice && item.offerprice !== "0") {
                totalPrice += item.quantity * parseFloat(item.offerprice);
            } else if (item.price) {
                totalPrice += item.quantity * parseFloat(item.price);
            }
        });

        return totalPrice.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    };



    const generarOrden = async (e) => {
        e.preventDefault();
        setLoading(true);
        let newOrden = {
            ...form, // Copiar las propiedades existentes del objeto form

            products: cart.map(item => ({
                product: item._id,
                quantity: item.quantity,
                priceunitary: item.offerprice && parseFloat(item.offerprice) > 0 ? item.offerprice : item.price
            }))
        };

        try {
            const request = await fetch(Global.url + 'order/create', {
                method: "POST",
                body: JSON.stringify(newOrden),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }

            })
            const data = await request.json()
            if (data.status === 'success') {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Orden generada correctamente, pronto recibiras una correo con el numero de orden',
                    showConfirmButton: true,


                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/auth/order');
                        localStorage.removeItem('cart')
                        setNewOrden(data)
                    }
                });

            } else if (data.status === 'error') {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: data.message,
                    showConfirmButton: true,

                })
                setLoading(false);

            }

        } catch (error) {
            console.log('code', error)

        }



    }


    const nextPage = () => {
        let next = page + 1;
        setPage(next);

    }
    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    }



    useEffect(() => {
        MyAddress(page);
    }, [page]);


    const MyAddress = async () => {
        try {
            const request = await fetch(Global.url + 'address/list/' + nextPage, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            });
            const data = await request.json();
            console.log('my address check out', data.address)

            if (data.status === 'success') {
                setAddress(data.address);
                setTotalPages(data.totalPages)
            } else {
                setAddress([]);
            }


        } catch (error) {
            console.log('code', error)

        }
    }


    return (
        <>
            <h6>Bienvenido {auth.name}</h6>

            <form onSubmit={generarOrden}>

                <div className="row g-5">
                    <div className="col-md-5 col-lg-4 order-md-last">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            {auth && auth._id ? (
                                <span className="text-primary"><NavLink to={'/auth/cart/'}>Mi Carro</NavLink></span>
                            ) : (
                                <span className="text-primary"><NavLink to={'/cart/'}>Mi Carro</NavLink></span>
                            )}
                            <span className="badge bg-primary rounded-pill">{totalItems}</span>
                        </h4>



                        <ul className="list-group mb-3" >
                            {cart.map((item) => (
                                <li className="list-group-item d-flex justify-content-between lh-sm" key={item._id} onChange={changed}>
                                    <div>
                                        <h6 className="my-0">{item.name}</h6>
                                        <small className="text-body-secondary">{item.description}</small>
                                        <p onChange={changed}>cantidad {item.quantity}</p>
                                        <button className="btn btn-danger btn-remove" onClick={() => removeFromCart(item._id)}>Eliminar</button>
                                    </div>
                                    {item.discountPercentage > 0 ? (
                                        <>
                                            <IntlProvider locale="es" defaultLocale="es">
                                                <p className="card-text">
                                                    <ins>$<FormattedNumber value={item.offerprice} style="currency" currency="CLP" /></ins>
                                                    <span className="discount"> -{item.discountPercentage}%</span>
                                                </p>
                                            </IntlProvider>
                                            <del>
                                                <IntlProvider locale="es" defaultLocale="es">
                                                    <p className="card-text">
                                                        $<FormattedNumber value={item.price} style="currency" currency="CLP" onChange={changed} />
                                                    </p>
                                                </IntlProvider>
                                            </del>

                                        </>
                                    ) : (

                                        <IntlProvider locale="es" defaultLocale="es">
                                            <p className="card-text">
                                                $<FormattedNumber value={item.price} style="currency" currency="CLP" />
                                            </p>
                                        </IntlProvider>

                                    )}

                                </li>


                            ))}

                            {/* 
    <li className="list-group-item d-flex justify-content-between bg-body-tertiary">
      <div className="text-success">
        <h6 className="my-0">Promo code</h6>
        <small>EXAMPLECODE</small>
      </div>
      <span className="text-success">−$0</span>
    </li>
   
    <form className="card p-2">
      <div className="input-group">
        <label htmlFor='promecode'></label>
        <input type="text" className="form-control" placeholder="Promo code" />
        <button type="submit" className="btn btn-secondary">Aplicar</button>
      </div>
    </form>
  */}

                            <li className="list-group-item d-flex justify-content-between">
                                <span>Precio Total: </span>
                                <strong>${getTotalPrice()}</strong>
                            </li>
                        </ul>
                    </div>


                    <div className="col-md-7 col-lg-8">
                        <h4 className="mb-3">Selecciona direccion de envio</h4>

                        <div className="row g-3">


                            <div className="col-sm-6">
                                {address && address.length > 0 ? (
                                    address.map((addr, index) => (
                                        <div key={addr._id} className="address-container">
                                            <input type="radio" key={addr._id} name="shippingAddress" value={addr._id} onChange={changed}></input>
                                            <label htmlFor="html">{addr.nombre}</label>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        Sin direcciones, agrega una nueva antes de continuar
                                        <Link to='/auth/perfil'>Agregar una direccion</Link>
                                    </div>
                                )}
                            </div>





                        </div>

                        <hr className="my-4" />

                        <h4 className="mb-3">Metodos de pago</h4>

                        <div className="my-3">
                            <div className="form-check">
                                <input id="Transferencia" name="paymentMethod" type="radio" className="form-check-input" defaultChecked="" required="" onChange={() => setShowTransferArea(true)} />
                                <label className="form-check-label" htmlFor="credit">Transferencia</label>
                            </div>
                            <div className="form-check">
                                <input id="debit" name="paymentMethod" type="radio" className="form-check-input" required="" onChange={() => setShowTransferArea(false)} />
                                <label className="form-check-label" htmlFor="debit">Mercado Pago</label>
                            </div>
                            <div className="form-check">
                                <input id="paypal" name="paymentMethod" type="radio" className="form-check-input" required="" onChange={() => setShowTransferArea(false)} />
                                <label className="form-check-label" htmlFor="paypal">PayPal</label>
                            </div>
                        </div>

                        <div className="row gy-3">
                            {showTransferArea && (
                                <div className="col-md-6" id='transferenciaHidden'>
                                    <label htmlFor="cc-name" className="form-label">Datos de transferencia</label>
                                    <p></p>
                                    <p>Banco Estado</p>
                                    <p>Cuenta Corriente: </p>
                                    <p>Rut: </p>
                                    <p>correo: </p>
                                </div>
                            )}
                        </div>

                        <hr className="my-4" />

                        {loading ? (
                            <Spiner></Spiner>
                        ) : (
                            <div className="text-center">
                                <button className="w-100 btn btn-primary btn-lg" type="submit">Confirmar compra</button>
                            </div>
                        )}

                    </div>


                </div>
            </form>
        </>
    )
}
