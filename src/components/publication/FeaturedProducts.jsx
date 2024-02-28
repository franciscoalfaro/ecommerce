import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import ReactTimeAgo from 'react-time-ago'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export const FeaturedProducts = () => {
    const { auth } = useAuth({})
    const [featuredproduct, setFeaturedproduct] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)



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
            const request = await fetch(Global.url + 'product/featuredproduct/' + nextPage, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            const data = await request.json()
            console.log(data)
            if (data.status === 'success') {
                setFeaturedproduct(data.products)
                setTotalPages(data.totalPages)


            } else {
                console.log(data.message)
            }

        } catch (error) {

        }

    }


    return (
        <>
            <main>
                <section className="py-4 bg-light">
                    <div className="container">
                        {featuredproduct.length === 0 ? (
                            <p>No existen productos en ofertas.</p>
                        ) : (
                            <div className="row">
                                {featuredproduct.map(product => (
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
                                                        <p className="card-text">
                                                            <ins>${product.offerprice}</ins>
                                                            <span className="discount"> -{product.discountPercentage}%</span>
                                                        </p>
                                                        <del>
                                                            <p className="old-price">${product.price}</p>
                                                        </del>

                                                    </>
                                                ) : (

                                                    <p className="card-text">
                                                        ${product.price}
                                                    </p>
                                                )}
                                                <button className="btn btn-primary"><i className="bi bi-cart-fill"></i> Agregar al carrito</button>
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
        </>
    )
}
