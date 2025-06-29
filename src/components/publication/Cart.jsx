import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { IntlProvider, FormattedNumber } from 'react-intl';
import { Global } from '../../helpers/Global';

export const Cart = () => {
  const { auth } = useAuth();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, isLoading } = useCart();

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('es-CL', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    });
  };

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="mb-4">
            <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: 'var(--gray-400)' }}></i>
          </div>
          <h3 className="mb-3">Tu carrito está vacío</h3>
          <p className="text-muted mb-4">¡Agrega algunos productos para comenzar!</p>
          <Link 
            to={auth && auth._id ? "/auth/products" : "/products"} 
            className="btn btn-primary btn-lg"
          >
            <i className="bi bi-shop me-2"></i>
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <i className="bi bi-cart3 me-2"></i>
              Mi Carrito
            </h2>
            <span className="badge bg-primary fs-6">{cart.length} productos</span>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="row align-items-center">
                  <div className="col-md-2 col-3">
                    {item.images && item.images.length > 0 && (
                      <Link to={auth && auth._id ? `/auth/product/${item._id}` : `/product/${item._id}`}>
                        <img 
                          src={Global.url + 'product/media/' + item.images[0].filename} 
                          className="product-image w-100" 
                          alt={item.name}
                          style={{ 
                            height: '80px', 
                            objectFit: 'cover', 
                            borderRadius: 'var(--border-radius)' 
                          }}
                        />
                      </Link>
                    )}
                  </div>
                  
                  <div className="col-md-4 col-9">
                    <Link 
                      to={auth && auth._id ? `/auth/product/${item._id}` : `/product/${item._id}`}
                      className="text-decoration-none"
                    >
                      <h5 className="mb-1 text-dark">{item.name}</h5>
                    </Link>
                    <p className="text-muted mb-1 small">{item.description}</p>
                    <span className="badge bg-secondary">Talla: {item.size || 'Única'}</span>
                  </div>

                  <div className="col-md-2 col-6 text-center">
                    <label className="form-label small text-muted">Cantidad</label>
                    <div className="input-group input-group-sm">
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input 
                        type="number" 
                        className="form-control text-center" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                        style={{ maxWidth: '60px' }}
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-md-2 col-6 text-center">
                    <label className="form-label small text-muted">Precio</label>
                    {item.discountPercentage > 0 ? (
                      <div>
                        <div className="fw-bold text-primary">
                          ${formatPrice(item.offerprice)}
                        </div>
                        <small className="text-decoration-line-through text-muted">
                          ${formatPrice(item.price)}
                        </small>
                        <div>
                          <span className="discount">-{item.discountPercentage}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="fw-bold text-primary">
                        ${formatPrice(item.price)}
                      </div>
                    )}
                  </div>

                  <div className="col-md-2 col-12 text-center mt-3 mt-md-0">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '2rem' }}>
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Resumen del pedido
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} productos)</span>
                <span className="fw-bold">${formatPrice(getTotalPrice())}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span>Envío</span>
                <span className="text-success fw-bold">Gratis</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <span className="h5">Total</span>
                <span className="h5 text-primary fw-bold">${formatPrice(getTotalPrice())}</span>
              </div>

              <div className="d-grid gap-2">
                {auth && auth._id ? (
                  <NavLink to="/auth/checkout" className="btn btn-primary btn-lg">
                    <i className="bi bi-credit-card me-2"></i>
                    Proceder al pago
                  </NavLink>
                ) : (
                  <NavLink to="/checkout" className="btn btn-primary btn-lg">
                    <i className="bi bi-credit-card me-2"></i>
                    Proceder al pago
                  </NavLink>
                )}
                
                <Link 
                  to={auth && auth._id ? "/auth/products" : "/products"} 
                  className="btn btn-outline-secondary"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>

          {/* Productos recomendados */}
          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="bi bi-star me-2"></i>
                También te puede interesar
              </h6>
            </div>
            <div className="card-body">
              <p className="text-muted small">
                Descubre productos similares que otros clientes han comprado.
              </p>
              <Link 
                to={auth && auth._id ? "/auth/products" : "/products"} 
                className="btn btn-outline-primary btn-sm"
              >
                Ver productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};