import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import useCart from '../../hooks/useCart'
import { IntlProvider, FormattedNumber } from 'react-intl'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export const Offers = () => {
  const [offerProduct, setOfferProduct] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('discount') // discount, price, name
  const [filterBy, setFilterBy] = useState('all') // all, high, medium, low
  const { addToCart } = useCart()
  const { auth } = useAuth({})

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
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

  // Función para filtrar y ordenar productos
  const getFilteredAndSortedProducts = () => {
    let filtered = [...offerProduct];

    // Filtrar por rango de descuento
    if (filterBy !== 'all') {
      filtered = filtered.filter(product => {
        const discount = product.discountPercentage;
        switch (filterBy) {
          case 'high': return discount >= 50;
          case 'medium': return discount >= 25 && discount < 50;
          case 'low': return discount > 0 && discount < 25;
          default: return true;
        }
      });
    }

    // Ordenar productos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          return b.discountPercentage - a.discountPercentage;
        case 'price':
          const priceA = a.offerprice && parseFloat(a.offerprice) > 0 ? parseFloat(a.offerprice) : parseFloat(a.price);
          const priceB = b.offerprice && parseFloat(b.offerprice) > 0 ? parseFloat(b.offerprice) : parseFloat(b.price);
          return priceA - priceB;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

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
          <p className="text-gray-600 text-lg">Cargando ofertas increíbles...</p>
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
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i className="bi bi-percent text-white text-4xl"></i>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              ¡Ofertas 
              <span className="block text-secondary-300">Increíbles!</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Descubre descuentos de hasta 70% en productos seleccionados. 
              ¡Aprovecha estas ofertas por tiempo limitado!
            </p>
            <div className="flex items-center justify-center space-x-4 text-white">
              <div className="flex items-center space-x-2">
                <i className="bi bi-clock text-secondary-300"></i>
                <span className="text-lg">Ofertas limitadas</span>
              </div>
              <div className="w-1 h-6 bg-white bg-opacity-30"></div>
              <div className="flex items-center space-x-2">
                <i className="bi bi-fire text-secondary-300"></i>
                <span className="text-lg">¡Los mejores precios!</span>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center hover-lift">
            <div className="card-body">
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="bi bi-percent text-danger-600 text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{offerProduct.length}</h3>
              <p className="text-gray-600">Productos en oferta</p>
            </div>
          </div>
          
          <div className="card text-center hover-lift">
            <div className="card-body">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="bi bi-arrow-down text-success-600 text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Hasta 70%</h3>
              <p className="text-gray-600">De descuento</p>
            </div>
          </div>
          
          <div className="card text-center hover-lift">
            <div className="card-body">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="bi bi-truck text-secondary-600 text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Gratis</h3>
              <p className="text-gray-600">Envío incluido</p>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por:
                  </label>
                  <select 
                    id="sortBy"
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-field"
                  >
                    <option value="discount">Mayor descuento</option>
                    <option value="price">Menor precio</option>
                    <option value="name">Nombre A-Z</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label htmlFor="filterBy" className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrar por descuento:
                  </label>
                  <select 
                    id="filterBy"
                    value={filterBy} 
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">Todos los descuentos</option>
                    <option value="high">50% o más</option>
                    <option value="medium">25% - 49%</option>
                    <option value="low">Hasta 24%</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <i className="bi bi-funnel"></i>
                <span>{filteredProducts.length} productos encontrados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <i className="bi bi-search text-4xl text-gray-400"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No hay ofertas disponibles</h3>
            <p className="text-gray-600 mb-8">
              {offerProduct.length === 0 
                ? "Actualmente no tenemos productos en oferta, pero pronto tendremos increíbles descuentos para ti."
                : "No se encontraron productos con los filtros seleccionados. Intenta ajustar tus criterios de búsqueda."
              }
            </p>
            {filterBy !== 'all' || sortBy !== 'discount' ? (
              <button 
                onClick={() => {
                  setFilterBy('all');
                  setSortBy('discount');
                }}
                className="btn-primary"
              >
                <i className="bi bi-arrow-clockwise mr-2"></i>
                Limpiar filtros
              </button>
            ) : (
              <Link to="/products" className="btn-primary">
                <i className="bi bi-shop mr-2"></i>
                Ver todos los productos
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
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
                  
                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-gradient-to-r from-danger-600 to-danger-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      -{product.discountPercentage}%
                    </div>
                  </div>

                  {/* Hot Deal Badge */}
                  {product.discountPercentage >= 50 && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        <i className="bi bi-fire mr-1"></i>
                        ¡HOT!
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Link 
                      to={auth && auth._id ? `/auth/product/${product._id}` : `/product/${product._id}`}
                      className="bg-white text-primary-600 hover:bg-primary-600 hover:text-white font-medium py-2 px-4 rounded-lg shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <i className="bi bi-eye mr-2"></i>
                      Ver detalles
                    </Link>
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

                  {/* Price Section */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl font-bold text-danger-600">
                        <IntlProvider locale="es" defaultLocale="es">
                          $<FormattedNumber value={product.offerprice} style="currency" currency="CLP" />
                        </IntlProvider>
                      </span>
                      <div className="bg-danger-100 text-danger-800 text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discountPercentage}%
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 line-through">
                        <IntlProvider locale="es" defaultLocale="es">
                          $<FormattedNumber value={product.price} style="currency" currency="CLP" />
                        </IntlProvider>
                      </span>
                      <span className="text-xs text-success-600 font-medium">
                        Ahorras: $<FormattedNumber value={product.price - product.offerprice} />
                      </span>
                    </div>
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
                        className="btn-primary w-full justify-center"
                      >
                        <i className="bi bi-cart-plus mr-2"></i>
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

        {/* Newsletter CTA */}
        <div className="mt-16">
          <div className="card bg-gradient-to-r from-danger-600 to-danger-700 text-white">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-bell text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-2">¡No te pierdas nuestras ofertas!</h3>
              <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
                Suscríbete a nuestro newsletter y sé el primero en conocer las mejores ofertas y descuentos exclusivos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Tu email aquí..." 
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-4 focus:ring-white focus:ring-opacity-50 focus:outline-none text-gray-900"
                />
                <button className="bg-white text-danger-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}