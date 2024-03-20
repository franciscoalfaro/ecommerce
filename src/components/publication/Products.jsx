import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import ReactTimeAgo from 'react-time-ago';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';

import { IntlProvider, FormattedNumber } from 'react-intl'


export const Products = () => {
  const { auth } = useAuth({})

  const { addToCart } = useCart()

  //listar todos los productos y permitir un filtro de productos
  const [products, setProducts] = useState([])

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [productFilter, setProductFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');


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

  }, [page, productFilter])



  const productList = async (nextPage = 1) => {

    try {
      const request = await fetch(Global.url + 'product/list/' + nextPage, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      })
      const data = await request.json()

      if (data.status === 'success') {
        let filteredProducts = data.products;


        if (productFilter) {
          filteredProducts = filteredProducts.filter(product => product.brand === productFilter);

        }

        setProducts(filteredProducts);
        setTotalPages(data.totalPages);

      } else {
        setProducts([]);
      }

    } catch (error) {
      console.log(data.message)

    }

  }



  return (
    <main>

      <section className="py-4 bg-light">
        <div className="container">
          <h2>Filtrar por</h2>

          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <select className="form-select" value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
                <option value="">Todos los productos</option>
                <option value="levis">levis</option>
                <option value="opaline">opaline</option>
              </select>
            </div>
          </div>

        </div>
      </section>

      <section className="py-4 bg-light">
        <div className="container">
          {products.length === 0 ? (
            <p>No existen productos.</p>
          ) : (
            <div className="row">
              {products.map(product => (
                <div className="col-lg-4 col-md-4 col-sm-6 mb-4" key={product._id}>
                  <div className="card">


                    {product.images.length > 0 && (
                      <Link to={auth && auth._id ? `/auth/product/${product._id}` : `/product/${product._id}`}>
                        <img src={Global.url + 'product/media/' + product.images[0].filename} className="card-img-top" alt={product.name} />
                      </Link>
                    )}

                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">Marca {product.brand}</p>
                      <p className="card-text">{product.description}</p>

                      {product.discountPercentage > 0 ? (
                        <>
                          <p className="card-text">
                            <ins>${product.offerprice}</ins>
                            <span className="discount"> -{product.discountPercentage}%</span>
                          </p>
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
    </main>
  )
}
