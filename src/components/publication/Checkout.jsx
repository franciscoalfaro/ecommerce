import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { regiones } from '../data/chile';
import useCart from '../../hooks/useCart';
import { FormattedNumber, IntlProvider } from 'react-intl';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { CheckoutRegister } from './CheckoutRegister';
import { Spiner } from '../../hooks/Spiner';

export const Checkout = () => {
  const { auth } = useAuth({});
  const { form, changed } = useForm({})
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  //funcionamiento del carrito 
  const { cart, removeFromCart, updateQuantity, totalItems } = useCart();

  const [newOrden, setNewOrden] = useState([])

  //funcionamiento de seleccion de region
  const [regionChile, setRegionChile] = useState({});
  const params = useParams();
  const [showTransferArea, setShowTransferArea] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');

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

  //selecion de region comuna 
  useEffect(() => {
    let regionChile = regiones.filter(trabajo => trabajo.id === params.id);
    setRegionChile(regionChile[0]);
  }, [params.id]);


  useEffect(() => {
    if (selectedRegion) {
      const region = regiones.find(region => region.name === selectedRegion);
      const communes = region ? region.communes : [];
      setSelectedCommune(communes);
    }
  }, [selectedRegion]);

  const generarOrden = async (e) => {
    e.preventDefault();
    setLoading(true);
    let newOrden = {
      ...form, // Copiar las propiedades existentes del objeto form
      comuna: selectedCommune,
      region: selectedRegion,
      products: cart.map(item => ({
        product: item._id,
        quantity: item.quantity,
        priceunitary: item.offerprice && parseFloat(item.offerprice) > 0 ? item.offerprice : item.price
      }))
    };

    try {
      const request = await fetch(Global.url + 'order/createguest', {
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
          title: 'Orden generada correctamente, pronto recibirar una correo con el numero de orden',
          showConfirmButton: true,

        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('cart')
            navigate('/');
            setNewOrden(data)
          }
        });
      } else if(data.status === 'error') {
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




  return (
    <div className="container">
      <main>
        <div className="py-5 text-center">
          <img className="d-block mx-auto mb-4" src="../../../src/assets/img/cart2.svg" alt="" width="72" height="57" />
          <h2>Confirmar Compra</h2>
        </div>

        {auth && auth._id ? (
          <CheckoutRegister></CheckoutRegister>
        ) : (
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
                <h4 className="mb-3">Direccion de envio</h4>

                <div className="row g-3">

                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label">Nombre</label>
                    <input type="text" className="form-control" name="name" id="firstName" placeholder="" defaultValue="" required="" onChange={changed} />
                    <div className="invalid-feedback">
                      Valid first name is required.
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">Apellido</label>
                    <input type="text" className="form-control" name="surname" id="lastName" placeholder="" defaultValue="" required="" onChange={changed} />
                    <div className="invalid-feedback">
                      Valid last name is required.
                    </div>
                  </div>

                  <div className="col-8">
                    <label htmlFor="email" className="form-label">Email <span className="text-body-secondary"></span></label>
                    <input type="email" className="form-control" name="email" id="email" placeholder="you@email.com" onChange={changed} />
                    <div className="invalid-feedback">
                      Please enter a valid email address for shipping updates.
                    </div>
                  </div>

                  <div className="col-4">
                    <label htmlFor="phone" className="form-label">Telefono<span
                      className="text-body-secondary"></span></label>
                    <input type="text" className="form-control" name='phone' id="phone" placeholder="+56" onChange={changed} />
                  </div>

                  <div className="col-8">
                    <label htmlFor="address" className="form-label">Direccion</label>
                    <input type="text" className="form-control" name="direccion" id="address" placeholder="1234 Main St" required="" onChange={changed} />
                    <div className="invalid-feedback">
                      Please enter your shipping address.
                    </div>
                  </div>
                  <div className="col-4">
                    <label htmlFor="numero" className="form-label">numero<span
                      className="text-body-secondary"></span></label>
                    <input type="text" className="form-control" name='numero' id="address2" placeholder="123456" onChange={changed} />
                  </div>


                  <div className="col-md-5">
                    <label htmlFor="country" className="form-label">Region</label>
                    <select className="form-select" id="country" name='pais' required="" onChange={(e) => setSelectedRegion(e.target.value)}>
                      <option defaultValue="" onChange={changed}>Seleciona...</option>
                      {regiones.map(pais => (
                        <optgroup label={pais.name} key={pais.name}>
                          {pais.regions.map(region => (
                            <option key={region.name}>{region.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Please select a valid country.
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="state" className="form-label">Comuna</label>
                    <select className="form-select" id="state" required="" onChange={(e) => setSelectedCommune(e.target.value)}>
                      <option defaultValue="">Seleciona...</option>
                      {regiones.map(pais => (
                        pais.regions.map(region => (
                          region.name === selectedRegion &&
                          region.communes.map(commune => (
                            <option key={commune.name}>{commune.name}</option>
                          ))
                        ))
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Please provide a valid state.
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="ciudad" className="form-label">Ciudad</label>
                    <input type="text" className="form-control" id="ciudad" placeholder="" name='ciudad' required="" onChange={changed} />
                    <div className="invalid-feedback">
                      ciudad required
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="zip" className="form-label">Codigo postal</label>
                    <input type="text" className="form-control" id="zip" placeholder="" name='codigoPostal' required="" onChange={changed} />
                    <div className="invalid-feedback">
                      Zip code required.
                    </div>
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
        )}




      </main>
      <br></br>
    </div>

  )
}
