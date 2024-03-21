import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import useCart from '../../hooks/useCart'
import { IntlProvider, FormattedNumber } from 'react-intl'

export const Offers = () => {

    //listar todos los productos y permitir un filtro de productos
    const [offerProduct, setOfferProduct] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const { addToCart } = useCart()



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
            console.log(data)
            if (data.status === 'success') {
                setOfferProduct(data.products)
                setTotalPages(data.totalPages)


            } else {
                console.log(data.message)
            }

        } catch (error) {

        }

    }

    return (
        <main>
            <section className="py-4 bg-light">
                <div className="container">
                    {offerProduct.length === 0 ? (
                        <p>No existen productos en ofertas.</p>
                    ) : (
                        <div className="row">
                            {offerProduct.map(product => (
                                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product._id}>
                                    <div className="card">
                                        {product.images.length > 0 && (
                                            <img src={Global.url + 'product/media/' + product.images[0].filename} className="card-img-top" alt={product.name}></img>
                                        )}

                                        <div className="card-body">

                                            <h5 className="card-title">{product.name}</h5>

                                            {product.discountPercentage > 0 ? (
                                                <>
                                                    <IntlProvider locale="es" defaultLocale="es">
                                                        <p className="card-text">
                                                            <ins>$<FormattedNumber value={product.offerprice}  style="currency" currency="CLP"></FormattedNumber></ins>
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
                        <ul className="pagination">
                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={prevPage}>Previous</a>
                            </li>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index} className={`page-item ${page === index + 1 ? 'active' : ''}`}>
                                    <a className="page-link" href="#" onClick={() => setPage(index + 1)}>{index + 1}</a>
                                </li>
                            ))}
                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={nextPage}>Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>

        </main>
    )
}
