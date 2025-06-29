import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { FormattedNumber } from 'react-intl'
import { GetProducts } from '../../helpers/GetProducts';

export const Products = () => {
  const { auth } = useAuth({})
  const { addToCart } = useCart()

  const [products, setProduct] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [productFilter, setProductFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const uniqueBrands = [...new Set(products.map(product => product.brand))];

  const clearFilters = () => {
    setProductFilter('');
  };

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
    getDataProduct()
  }, [page, productFilter])

  const getDataProduct = async () => {
    setIsLoading(true);
    try {
      let data = await GetProducts(page, setProduct, setTotalPages);
      setProduct(data.products);
      setTotalPages(data.totalPages)

      let filteredProducts = data.products;
      if (productFilter) {
        filteredProducts = filteredProducts.filter(product => product.brand === productFilter);
      }
      setProduct(productFilter ? filteredProducts : data.products);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-gray-600 text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Todos los Productos</h1>
          <p className="text-gray-600">Descubre nuestra amplia selección de productos de calidad</p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <label htmlFor="brandFilter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por marca:
                </label>
                <select 
                  id="brandFilter"
                  value={productFilter} 
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="input-field max-w-xs"
                >
                  <option value="">Todas las marcas</option>
                  {uniqueBrands.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                onClick={clearFilters}
                className="btn-secondary"
              >
                <i className="bi bi-x-circle mr-2"></i>
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <i className="bi bi-search text-4xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600 mb-6">Intenta ajustar tus filtros o explora otras categorías</p>
            <button onClick={clearFilters} className="btn-primary">
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
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
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="badge-danger">
                        -{product.discountPercentage}%
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link 
                      to={auth && auth._id ? `/auth/product/${product._id}` : `/product/${product._id}`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 mb-2"
                      title="Ver detalles"
                    >
                      <i className="bi bi-eye text-gray-600"></i>
                    </Link>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="badge-primary text-xs">{product.brand}</span>
                  </div>
                  
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

                  {/* Price */}
                  <div className="mb-4">
                    {product.discountPercentage > 0 ? (
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-primary-600">
                            $<FormattedNumber value={product.offerprice} style="currency" currency="CLP" />
                          </span>
                          <span className="badge-danger text-xs">
                            -{product.discountPercentage}%
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 line-through">
                          $<FormattedNumber value={product.price} style="currency" currency="CLP" />
                        </span>
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
                      ? 'bg-primary-600 border-primary-600 text-white'
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
    </div>
  )
}