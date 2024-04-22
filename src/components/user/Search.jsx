import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { IntlProvider, FormattedNumber } from 'react-intl'


export const Search = () => {
  const params = useParams();
  const { auth } = useAuth({});
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [genderFilter, setGenderFilter] = useState('');

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
    buscarProducto(page)
  }, [page])

  useEffect(() => {
    buscarProducto(1);
  }, [params, genderFilter]);


  const buscarProducto = async (nextPage = 1) => {
    try {
      const request = await fetch(Global.url + 'product/search/' + params.product + '/' + nextPage, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await request.json();
      console.log(data)

      if (data.status === 'success') {
        let filteredProducts = data.products;

        if (genderFilter) {
          filteredProducts = filteredProducts.filter(product => product.gender === genderFilter);
        }

        setProducts(filteredProducts);
        setTotalPages(data.totalPages);

      } else {
        //con eso se limpia la busqueda y se vuelve a setear a null antes de volver a iniciar una nueva
        setProducts([])
      }
    } catch (error) {
      console.log(error);

    }

  };


  return (
    <>

      <section className="py-4">
        <div className="container">

          {/*filtro*/}

          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <select className="form-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                <option value="">Todos los productos</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
            </div>
          </div>

          {/*fin - filtro*/}

          {products.length === 0 ? (
            <p>Buscaste {params.product}</p>
          ) : (
            <div className="row">
              <p>Buscaste: {params.product}</p>
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


                      <p className="card-text">{product.description}</p>
                      <p className="card-text">Genero {product.gender}</p>

                      <button className="btn btn-primary" onClick={() => addToCart(product)}><i className="bi bi-cart-fill"></i> Agregar al carrito</button>
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
