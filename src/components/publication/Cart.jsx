import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { IntlProvider, FormattedNumber } from 'react-intl'
import { Global } from '../../helpers/Global';

export const Cart = () => {
  const { auth } = useAuth({});
  const { cart, removeFromCart, updateQuantity } = useCart();

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
  
  

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <h4>Productos Agregados</h4>
            <ul className="list-group">
              {cart.map((item) => (
                <li className="list-group-item" key={item._id}>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">

                      {item.images.length > 0 && (
                        <Link to={auth && auth._id ? `/auth/product/${item._id}` : `/product/${item._id}`}>
                          <img src={Global.url + 'product/media/' + item.images[0].filename} className="product-image" alt={item.name} />
                        </Link>
                      )}

                      <div>
                        <h5>{item.name}</h5>

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
                                $<FormattedNumber value={item.price} style="currency" currency="CLP" />
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

                        <div className="d-flex align-items-center">
                          <p className="mr-2">Cantidad</p>
                          <input type="number" className="form-control" min={1} value={item.quantity} onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}></input>
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-danger btn-remove" onClick={() => removeFromCart(item._id)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
            Precio Total: ${getTotalPrice()}
          </div>
        </div>
        <div className="text-center mt-4">
          {(parseFloat(getTotalPrice()) > 0 && cart.length > 0) && (
            auth && auth._id ? (
              <NavLink to="/auth/checkout" className="btn btn-primary btn-checkout">Siguiente</NavLink>
            ) : (
              <NavLink to="/checkout" className="btn btn-primary btn-checkout">Siguiente</NavLink>
            )
          )}
        </div>
      </div>
    </section>
  );
};
