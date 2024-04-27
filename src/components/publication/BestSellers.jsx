import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import useCart from '../../hooks/useCart'
import { IntlProvider, FormattedNumber } from 'react-intl'

export const BestSellers = () => {
    const { auth } = useAuth({})
    const [page, setPage] = useState(1)
    const [bestseller, setBestseller] = useState([])
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
        getBestSeller(page)

    }, [page])



    const getBestSeller = async (nextPage = 1) => {
        try {

            const request = await fetch(Global.url + 'product/bestselling' + '/' + nextPage, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            const data = await request.json()
            
            if (data.status === 'success') {
                setBestseller(data.products)
                setTotalPages(data.totalPages)

            } else {
                console.log(data.message)
            }

        } catch (error) {
            console.log('code',error)

        }
    }


    return (
        <>
            <section className="py-4">
                <div className="container">
                    <h2>Productos Mas vendidos</h2>
                    {bestseller.length === 0 ? (
                        <p>No existen productos mas vendidos.</p>
                    ) : (
                        <div className="row">
                            {bestseller.map(product => (
                                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product._id}>
                                    <div className="card">
                                        {product.images.length > 0 && (
                                            <Link to={auth && auth._id ? `/auth/product/${product._id}` : `/product/${product._id}`}>
                                                <img src={Global.url + 'product/media/' + product.images[0].filename} className="card-img-top" alt={product.name} />
                                            </Link>
                                        )}

                                        <div className="card-body">
                                        <Link to={auth && auth._id ? `/auth/product/${product._id}` : `/product/${product._id}`}><h5 className="card-title">{product.name}</h5></Link>


                                            {product.discountPercentage > 0 ? (
                                                <>
                                                    <p className="card-text">
                                                        <ins>
                                                            <IntlProvider locale="es" defaultLocale="es">
                                                                $<FormattedNumber value={product.offerprice} style="currency" currency="CLP" /><span className="discount"> -{product.discountPercentage}%</span>
                                                            </IntlProvider>
                                                        </ins>
                                                    </p>
                                                    <del>
                                                        <IntlProvider locale="es" defaultLocale="es">
                                                            <p className="card-text">
                                                                <FormattedNumber value={product.price} style="currency" currency="CLP" />
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
                                                    <span>sin stock disponible</span>
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
                                <a className="page-link" href="#" onClick={prevPage}>Anterior</a>
                            </li>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index} className={`page-item ${page === index + 1 ? 'active' : ''}`}>
                                    <a className="page-link" href="#" onClick={() => setPage(index + 1)}>{index + 1}</a>
                                </li>
                            ))}
                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={nextPage}>Siguiente</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>
        </>
    )
}
