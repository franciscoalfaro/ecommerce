import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import useCart from '../../hooks/useCart'
import { FormattedNumber } from 'react-intl'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export const Offers = () => {
  const [offerProduct, setOfferProduct] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()
  const { auth } = useAuth({})

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    productList(page)
  }, [page])

  const productList = async (nextPage = 1) => {
    setIsLoading(true);
    try {
      const request = await fetch(Global.url + 'product/offers' + '/' + nextPage, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      })
      const data = await request.json()

      if (data.status === 'success') {
        setOfferProduct(data.products)
        setTotalPages(data.totalPages)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log('code', error)
    } finally {
      setIsLoading(false);
    }
  }

  function generatePaginationNumbers(totalPages, currentPage) {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= halfVisiblePages) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + halfVisiblePages >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfVisiblePages;
        endPage = currentPage + halfVisiblePages;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }
  
  const visiblePageNumbers = generatePaginationNumbers(totalPages, page);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando ofertas especiales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-danger-600 via-danger-700 to-danger-800 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <i className="bi bi-percent text-white text-3xl"></i>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Ofertas
              <span className="block text-secondary-400">Especiales</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Descubre increíbles descuentos en productos seleccionados. 
              ¡Aprovecha estas ofertas por tiempo limitado!
            </p>
            <div className="flex items-center justify-center space-x-4 text-white">
              <div className="flex items-center space-x-2">
                <i className="bi bi-clock text-secondary-400"></i>
                <span className="text-lg">Ofertas limitadas</span>
              </div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="flex items-center space-x-2">
                <i className="bi bi-truck text-secondary-400"></i>
                <span className="text-lg">Envío gratis</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Bar */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-percent text-danger-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{offerProduct.length}</p>
                  <p className="text-gray-600">Productos en oferta</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-tag text-success-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Hasta 70%</p>
                  <p className="text-gray-600">De descuento</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-clock text-primary-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Limitado</p>
                  <p className="text-gray-600">Por tiempo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {offerProduct.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
                <i className="bi bi-percent text-6xl text-gray-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No hay ofertas disponibles</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Por el momento no tenemos productos en oferta, pero pronto tendremos increíbles descuentos para ti.
              </p>
              <Link to={auth && auth._id ? "/auth/products" : "/products"} className="btn-primary">
                <i className="bi bi-shop mr-2"></i>
                Ver todos los productos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offerProduct.map(product => (
                <div key={product._id} className="product-card group">
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    {product.images.length > 0 && (
                      <Link to={auth && auth._id ? `/auth/product/${product._id}` : `/product/${product._id}`}>
                        <img 
                          src={Global.url + 'product/media/' + product.images[0].filename} 
                          className="product-image" 
                          alt={product.name} 
                        />
                      </Link>
                    )}
                    
                    {/* Offer Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-gradient-to-r from-danger-500 to-danger-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        <i className="bi bi-fire mr-1"></i>
                        OFERTA
                      </div>
                    </div>

                    {/* Discount Badge */}
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-secondary-500 text-white px-2 py-1 rounded-lg text-lg font-bold shadow-lg">
                          -{product.discountPercentage}%
                        </div>
                      </div>
                    )}

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="space-y-2">
                        <Link 
                          to={auth && auth._id ? `/auth/product/${product._id}` : `/product/${product._id}`}
                          className="block bg-white text-primary-600 hover:bg-primary-600 hover:text-white font-medium py-2 px-4 rounded-lg shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                        >
                          <i className="bi bi-eye mr-2"></i>
                          Ver detalles
                        </Link>
                        {product.stock?.quantity > 0 && (
                          <button 
                            onClick={() => addToCart(product)}
                            className="block w-full bg-success-600 hover:bg-success-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                          >
                            <i className="bi bi-cart-plus mr-2"></i>
                            Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <Link 
                      to={auth && auth._id ? `/auth/product/${product._id}` : `/product/${product._id}`}
                      className="block"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price Section */}
                    <div className="mb-4">
                      {product.discountPercentage > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-danger-600">
                              $<FormattedNumber value={product.offerprice} style="currency" currency="CLP" />
                            </span>
                            <span className="bg-danger-100 text-danger-800 text-xs font-bold px-2 py-1 rounded-full">
                              -{product.discountPercentage}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 line-through">
                              $<FormattedNumber value={product.price} style="currency" currency="CLP" />
                            </span>
                            <span className="text-xs text-success-600 font-medium">
                              Ahorras: $<FormattedNumber value={product.price - product.offerprice} />
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-primary-600">
                          $<FormattedNumber value={product.price} style="currency" currency="CLP" />
                        </span>
                      )}
                    </div>

                    {/* Stock Status & Add to Cart */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        {product.stock?.quantity > 0 ? (
                          <div className="flex items-center text-success-600">
                            <i className="bi bi-check-circle mr-1"></i>
                            <span>En stock ({product.stock.quantity} disponibles)</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-danger-600">
                            <i className="bi bi-x-circle mr-1"></i>
                            <span>Sin stock</span>
                          </div>
                        )}
                      </div>

                      {product.stock?.quantity > 0 ? (
                        <button 
                          onClick={() => addToCart(product)}
                          className="btn-primary w-full justify-center group"
                        >
                          <i className="bi bi-cart-plus mr-2 group-hover:animate-bounce"></i>
                          Agregar al carrito
                        </button>
                      ) : (
                        <button 
                          disabled
                          className="w-full py-2.5 px-6 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                        >
                          <i className="bi bi-x-circle mr-2"></i>
                          Sin stock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <button 
                  onClick={prevPage}
                  disabled={page === 1}
                  className={`p-2 rounded-lg border ${page === 1 
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                
                {visiblePageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
                      page === pageNumber
                        ? 'bg-danger-600 border-danger-600 text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                <button 
                  onClick={nextPage}
                  disabled={page === totalPages}
                  className={`p-2 rounded-lg border ${page === totalPages 
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿No encontraste lo que buscabas?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Explora toda nuestra colección de productos con los mejores precios
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={auth && auth._id ? "/auth/products" : "/products"} 
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              <i className="bi bi-grid-3x3-gap mr-2"></i>
              Ver todos los productos
            </Link>
            <Link 
              to={auth && auth._id ? "/auth" : "/"} 
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-all duration-200 inline-flex items-center justify-center"
            >
              <i className="bi bi-house mr-2"></i>
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}