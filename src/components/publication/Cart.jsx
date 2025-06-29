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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <i className="bi bi-cart-x text-4xl text-gray-400"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">¡Descubre nuestros increíbles productos y comienza a llenar tu carrito!</p>
          <Link 
            to={auth && auth._id ? "/auth/products" : "/products"} 
            className="btn-primary inline-flex items-center"
          >
            <i className="bi bi-shop mr-2"></i>
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Carrito</h1>
          <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'producto' : 'productos'} en tu carrito</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="card">
                  <div className="card-body">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.images && item.images.length > 0 && (
                          <Link to={auth && auth._id ? `/auth/product/${item._id}` : `/product/${item._id}`}>
                            <img 
                              src={Global.url + 'product/media/' + item.images[0].filename} 
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                            />
                          </Link>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={auth && auth._id ? `/auth/product/${item._id}` : `/product/${item._id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center mt-2">
                          <span className="badge-primary">Talla: {item.size || 'Única'}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <i className="bi bi-dash text-gray-600"></i>
                          </button>
                          <input 
                            type="number" 
                            min="1" 
                            value={item.quantity} 
                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
                          />
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <i className="bi bi-plus text-gray-600"></i>
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        {item.discountPercentage > 0 ? (
                          <div>
                            <div className="text-xl font-bold text-primary-600">
                              ${formatPrice(item.offerprice)}
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              ${formatPrice(item.price)}
                            </div>
                            <div className="badge-danger text-xs">
                              -{item.discountPercentage}%
                            </div>
                          </div>
                        ) : (
                          <div className="text-xl font-bold text-primary-600">
                            ${formatPrice(item.price)}
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-danger-600 hover:text-danger-700 p-2 hover:bg-danger-50 rounded-lg transition-all duration-200"
                        title="Eliminar producto"
                      >
                        <i className="bi bi-trash text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link 
                to={auth && auth._id ? "/auth/products" : "/products"} 
                className="btn-secondary inline-flex items-center"
              >
                <i className="bi bi-arrow-left mr-2"></i>
                Seguir comprando
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="card sticky top-8">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  <i className="bi bi-receipt mr-2"></i>
                  Resumen del pedido
                </h3>
              </div>
              <div className="card-body space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} productos)
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${formatPrice(getTotalPrice())}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold text-success-600">Gratis</span>
                </div>

                <hr className="border-gray-200" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${formatPrice(getTotalPrice())}
                  </span>
                </div>

                {/* Checkout Button */}
                <div className="pt-4">
                  {auth && auth._id ? (
                    <NavLink to="/auth/checkout" className="btn-primary w-full justify-center">
                      <i className="bi bi-credit-card mr-2"></i>
                      Proceder al pago
                    </NavLink>
                  ) : (
                    <NavLink to="/checkout" className="btn-primary w-full justify-center">
                      <i className="bi bi-credit-card mr-2"></i>
                      Proceder al pago
                    </NavLink>
                  )}
                </div>

                {/* Security Badge */}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <i className="bi bi-shield-check text-success-600 text-2xl mb-2"></i>
                  <p className="text-sm text-gray-600">
                    Compra 100% segura y protegida
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Products */}
            <div className="card mt-6">
              <div className="card-header">
                <h4 className="text-lg font-semibold text-gray-900">
                  <i className="bi bi-star mr-2"></i>
                  También te puede interesar
                </h4>
              </div>
              <div className="card-body">
                <p className="text-gray-600 text-sm mb-4">
                  Descubre productos similares que otros clientes han comprado.
                </p>
                <Link 
                  to={auth && auth._id ? "/auth/products" : "/products"} 
                  className="btn-outline w-full justify-center"
                >
                  Ver productos recomendados
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};