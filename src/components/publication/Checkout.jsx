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
        size: item.size,
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
          title: 'Orden generada correctamente, pronto recibiras una correo con el numero de orden',
          showConfirmButton: true,

        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('cart')
            setTimeout(() => { window.location.href = "/" });
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




  return (
    <div className="container">
      <main>
        <div className="py-5 text-center">
          <div className="d-block mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="72" height="57" fill="currentColor" className="bi bi-cart2" viewBox="0 0 16 16">
              <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
            </svg>
          </div>

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
  <ul className="list-group mb-3">
    {cart.map((item) => (
      <li className="list-group-item d-flex justify-content-between align-items-start" key={item._id}>
        <div>
          <h6 className="my-0">{item.name}</h6>
          <small className="text-muted">{item.description}</small>
          <div className="d-flex align-items-center mt-1">
            <label htmlFor={`quantity_${item._id}`} className="me-2">Cantidad:</label>
            <input type="number" id={`quantity_${item._id}`} className="form-control form-control-sm" value={item.quantity} onChange={(e) => updateQuantity(item._id, e.target.value)} />
          </div>
          <p className="mt-1">Talla: {item.size}</p>
          <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item._id)}>Eliminar</button>
        </div>
        {item.discountPercentage > 0 ? (
          <>
            <IntlProvider locale="es" defaultLocale="es">
              <p className="text-danger mb-0">
                <ins>$<FormattedNumber value={item.offerprice} style="currency" currency="CLP" /></ins>
                <span className="discount"> -{item.discountPercentage}%</span>
              </p>
            </IntlProvider>
            <IntlProvider locale="es" defaultLocale="es">
              <p className="text-muted mb-0">
                <del>$<FormattedNumber value={item.price} style="currency" currency="CLP" /></del>
              </p>
            </IntlProvider>
          </>
        ) : (
          <IntlProvider locale="es" defaultLocale="es">
            <p className="mb-0">$<FormattedNumber value={item.price} style="currency" currency="CLP" /></p>
          </IntlProvider>
        )}
      </li>
    ))}
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
