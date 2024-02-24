import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { trabajos } from '../data/chile';

export const Checkout = () => {
  const { auth } = useAuth({});

  const [proyecto, setProyecto] = useState({});
  const params = useParams();
  const [showTransferArea, setShowTransferArea] = useState(false);

  useEffect(() => {
    let proyecto = trabajos.filter(trabajo => trabajo.id === params.id);
    setProyecto(proyecto[0]);
  }, [params.id]);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');

  useEffect(() => {
    if (selectedRegion) {
      const region = trabajos.find(region => region.name === selectedRegion);
      const communes = region ? region.communes : [];
      setSelectedCommune(communes);
    }
  }, [selectedRegion]);





  return (
    <div className="container">
      <main>
        <div className="py-5 text-center">
          <img className="d-block mx-auto mb-4" src="../../../src/assets/img/cart2.svg" alt="" width="72" height="57" />
          <h2>Confirmar Compra</h2>
        </div>

        <div className="row g-5">
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              {auth && auth._id ? (
                <span className="text-primary"><NavLink to={'/auth/cart/'}>Mi Carro</NavLink></span>
              ) : (
                <span className="text-primary"><NavLink to={'/cart/'}>Mi Carro</NavLink></span>
              )}
              <span className="badge bg-primary rounded-pill">3</span>
            </h4>

            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Product name</h6>
                  <small className="text-body-secondary">Brief description</small>
                </div>
                <span className="text-body-secondary">$12</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Second product</h6>
                  <small className="text-body-secondary">Brief description</small>
                </div>
                <span className="text-body-secondary">$8</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Third item</h6>
                  <small className="text-body-secondary">Brief description</small>
                </div>
                <span className="text-body-secondary">$5</span>
              </li>
              <li className="list-group-item d-flex justify-content-between bg-body-tertiary">
                <div className="text-success">
                  <h6 className="my-0">Promo code</h6>
                  <small>EXAMPLECODE</small>
                </div>
                <span className="text-success">−$0</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (CLP)</span>
                <strong>$20</strong>
              </li>
            </ul>

            <form className="card p-2">
              <div className="input-group">
                <label htmlFor='promecode'></label>
                <input type="text" className="form-control" placeholder="Promo code" />
                <button type="submit" className="btn btn-secondary">Redeem</button>
              </div>
            </form>
          </div>


          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Direccion de envio</h4>
            <form className="needs-validation" noValidate="">
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">Nombre</label>
                  <input type="text" className="form-control" id="firstName" placeholder="" defaultValue="" required="" />
                  <div className="invalid-feedback">
                    Valid first name is required.
                  </div>
                </div>

                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">Apellido</label>
                  <input type="text" className="form-control" id="lastName" placeholder="" defaultValue="" required="" />
                  <div className="invalid-feedback">
                    Valid last name is required.
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="email" className="form-label">Email <span className="text-body-secondary"></span></label>
                  <input type="email" className="form-control" id="email" placeholder="you@email.com" />
                  <div className="invalid-feedback">
                    Please enter a valid email address for shipping updates.
                  </div>
                </div>

                <div className="col-8">
                  <label htmlFor="address" className="form-label">Direccion</label>
                  <input type="text" className="form-control" id="address" placeholder="1234 Main St" required="" />
                  <div className="invalid-feedback">
                    Please enter your shipping address.
                  </div>
                </div>
                <div className="col-4">
                  <label htmlFor="address2" className="form-label">numero<span
                    className="text-body-secondary"></span></label>
                  <input type="text" className="form-control" id="address2" placeholder="123456" />
                </div>

                <div className="col-md-5">
                  <label htmlFor="country" className="form-label">Region</label>
                  <select className="form-select" id="country" required="" onChange={(e) => setSelectedRegion(e.target.value)}>
                    <option defaultValue="">Seleciona...</option>
                    {trabajos.map(pais => (
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
                    {trabajos.map(pais => (
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
                  <label htmlFor="zip" className="form-label">Codigo postal</label>
                  <input type="text" className="form-control" id="zip" placeholder="" required="" />
                  <div className="invalid-feedback">
                    Zip code required.
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              <h4 className="mb-3">Payment</h4>

              <div className="my-3">
                <div className="form-check">
                  <input id="Transferencia" name="paymentMethod" type="radio" className="form-check-input" defaultChecked="" required="" onChange={() => setShowTransferArea(true)} />
                  <label className="form-check-label" htmlFor="credit">Transferencia</label>
                </div>
                <div className="form-check">
                  <input id="debit" name="paymentMethod" type="radio" className="form-check-input" required="" onChange={() => setShowTransferArea(false)}/>
                  <label className="form-check-label" htmlFor="debit">Mercado Pago</label>
                </div>
                <div className="form-check">
                  <input id="paypal" name="paymentMethod" type="radio" className="form-check-input" required="" onChange={() => setShowTransferArea(false)}/>
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

              <button className="w-100 btn btn-primary btn-lg" type="submit">Continue to checkout</button>
            </form>
          </div>
        </div>
      </main>
      <br></br>
    </div>
    
  )
}
