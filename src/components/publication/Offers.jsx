import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import useCart from '../../hooks/useCart'
import { IntlProvider, FormattedNumber } from 'react-intl'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export const Offers = () => {

    //listar todos los productos y permitir un filtro de productos
    const [offerProduct, setOfferProduct] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
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

        }

    }

    //funcion para paginar y ocultar numeros 
    function generatePaginationNumbers(totalPages, currentPage) {
        const maxVisiblePages = 1; // Número máximo de páginas visibles
        const halfVisiblePages = Math.floor(maxVisiblePages / 2); // Mitad de las páginas visibles

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


    return (
        <main>
            <section className="py-4">
                <div className="container">
                    {offerProduct.length === 0 ? (
                        <p>No existen productos en ofertas.</p>
                    ) : (
                        <div className="row">
                            {offerProduct.map(product => (
                                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product._id}>
                                    <div className="card">
                                        {product.images.length > 0 && (
                                            <Link to={auth && auth._id ? `/auth/product/${product._id}` : `/product/${product._id}`}>
                                                <img src={Global.url + 'product/media/' + product.images[0].filename} className="card-img-top" alt={product.name} />
                                            </Link>
                                        )}

                                        <div className="card-body">

                                            <h5 className="card-title">{product.name}</h5>

                                            {product.discountPercentage > 0 ? (
                                                <>
                                                    <IntlProvider locale="es" defaultLocale="es">
                                                        <p className="card-text">
                                                            <ins>$<FormattedNumber value={product.offerprice} style="currency" currency="CLP"></FormattedNumber></ins>
                                                            <span className="discount"> -{product.discountPercentage}%</span>
                                                        </p>
                                                    </IntlProvider>

                                                    <del>
                                                        <IntlProvider locale="es" defaultLocale="es">
                                                            <p className="card-text">
                                                                $<FormattedNumber value={product.price} style="currency" currency="CLP" />
                                                            </p>
                                                        </IntlProvider>
                                                    </del>

                                                </>
                                            ) : (


                                                <IntlProvider locale="es" defaultLocale="es">
                                                    <p className="card-text">
                                                        <FormattedNumber value={product.price} style="currency" currency="CLP" />
                                                    </p>
                                                </IntlProvider>

                                            )}

                                            {product.stock?.quantity > 0 ? (
                                                <button className="btn btn-primary" onClick={() => addToCart(product)}><i className="bi bi-cart-fill"></i> Agregar al carrito</button>
                                            ) : (
                                                <>
                                                    <button className="btn btn-primary" onClick={() => addToCart(product)} disabled><i className="bi bi-cart-fill"></i> Agregar al carrito</button>
                                                    <br></br>
                                                    <div>sin stock disponible</div>
                                                </>
                                            )}


                                        </div>


                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={prevPage}><i className="bi bi-chevron-left"></i></a>
                            </li>
                            {visiblePageNumbers.map((pageNumber) => (
                                <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                                    <a className="page-link" href="#" onClick={() => setPage(pageNumber)}>{pageNumber}</a>
                                </li>
                            ))}
                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={nextPage}><i className="bi bi-chevron-right"></i></a>


                            </li>
                        </ul>
                    </nav>
                </div>
            </section>

        </main>
    )
}
