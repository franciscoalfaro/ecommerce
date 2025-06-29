import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import useCart from '../../hooks/useCart'
import { IntlProvider, FormattedNumber } from 'react-intl'

export const FeaturedProducts = () => {
    const { auth } = useAuth({})
    const [featuredproduct, setFeaturedproduct] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const { addToCart } = useCart()

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
        productList(page)
    }, [page])

    const productList = async (nextPage = 1) => {
        setIsLoading(true);
        try {
            const request = await fetch(Global.url + 'product/featuredproduct/' + nextPage, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            const data = await request.json()

            if (data.status === 'success') {
                setFeaturedproduct(data.products)
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
        const maxVisiblePages = 3;
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
            <div className="flex justify-center items-center py-12">
                <div className="loading-spinner w-8 h-8"></div>
            </div>
        );
    }

    return (
        <div>
            {featuredproduct.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <i className="bi bi-star text-4xl text-gray-400"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay productos destacados</h3>
                    <p className="text-gray-600">Pronto tendremos productos destacados para ti</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {featuredproduct.map(product => (
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
                                
                                {/* Featured Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="badge-primary">
                                        <i className="bi bi-star-fill mr-1"></i>
                                        Destacado
                                    </span>
                                </div>

                                {/* Discount Badge */}
                                {product.discountPercentage > 0 && (
                                    <div className="absolute top-3 right-3">
                                        <span className="badge-danger">
                                            -{product.discountPercentage}%
                                        </span>
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

                                {/* Price */}
                                <div className="mb-4">
                                    {product.discountPercentage > 0 ? (
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-primary-600">
                                                    <IntlProvider locale="es" defaultLocale="es">
                                                        $<FormattedNumber value={product.offerprice} style="currency" currency="CLP" />
                                                    </IntlProvider>
                                                </span>
                                                <span className="badge-danger text-xs">
                                                    -{product.discountPercentage}%
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500 line-through">
                                                <IntlProvider locale="es" defaultLocale="es">
                                                    $<FormattedNumber value={product.price} style="currency" currency="CLP" />
                                                </IntlProvider>
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-bold text-primary-600">
                                            <IntlProvider locale="es" defaultLocale="es">
                                                $<FormattedNumber value={product.price} style="currency" currency="CLP" />
                                            </IntlProvider>
                                        </span>
                                    )}
                                </div>

                                {/* Stock Status & Add to Cart */}
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm">
                                        {product.stock?.quantity > 0 ? (
                                            <div className="flex items-center text-success-600">
                                                <i className="bi bi-check-circle mr-1"></i>
                                                <span>En stock</span>
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
                <div className="flex justify-center mt-8">
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
    )
}