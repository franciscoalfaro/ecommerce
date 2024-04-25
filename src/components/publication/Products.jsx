import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import ReactTimeAgo from 'react-time-ago';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';

import { IntlProvider, FormattedNumber } from 'react-intl'
import { GetProducts } from '../../helpers/GetProducts';


export const Products = () => {
  const { auth } = useAuth({})

  const { addToCart } = useCart()

  //listar todos los productos y permitir un filtro de productos
  const [products, setProduct] = useState([])

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [productFilter, setProductFilter] = useState('');


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



  //obtener el listado de los productos. 
  const getDataProduct = async () => {
    try {
      let data = await GetProducts(page, setProduct, setTotalPages);
      setProduct(data.products);
      setTotalPages(data.totalPages)

      let filteredProducts = data.products;
      //no filtra por el brand 
      if (productFilter) {
        filteredProducts = filteredProducts.filter(product => product.brand === productFilter);
      }
      setProduct(productFilter ? filteredProducts : data.products);

    } catch (error) {
      console.error('Error:', error);
    }
  };




  //funcion para paginar y ocultar numeros 
  function generatePaginationNumbers(totalPages, currentPage) {
    const maxVisiblePages = 5; // Número máximo de páginas visibles
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
          <h2>Filtrar por</h2>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <select className="form-select" value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
                <option value="">Todos los productos</option>
                {uniqueBrands.map((brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <button className="btn btn-secondary" onClick={clearFilters}>Limpiar Filtros</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          {products.length === 0 ? (
            <p>No existen productos.</p>
          ) : (
            <div className="row">
              {products.map(product => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product._id}>
                  <div className="card">


                    {product.images.length > 0 && (
                      <Link to={auth && auth._id ? `/auth/product/${product._id}` : `/product/${product._id}`}>
                        <img src={Global.url + 'product/media/' + product.images[0].filename} className="card-img-top" alt={product.name} />
                      </Link>
                    )}

                    <div className="card-body">

                      <Link to={auth && auth._id ? `/auth/product/${product._id}` : `/product/${product._id}`}><h5 className="card-title">{product.name}</h5></Link>
                      <p className="card-text">Marca {product.brand}</p>
                      <p className="card-text">{product.description}</p>

                      {product.discountPercentage > 0 ? (
                        <>
                          <IntlProvider locale="es" defaultLocale="es">
                            <p className="card-text">
                              <ins>$<FormattedNumber value={product.offerprice} style="currency" currency="CLP" /></ins>
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
                            $<FormattedNumber value={product.price} style="currency" currency="CLP" />
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
                <a className="page-link" href="#" onClick={prevPage}>Anterior</a>
              </li>
              {visiblePageNumbers.map((pageNumber) => (
                <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                  <a className="page-link" href="#" onClick={() => setPage(pageNumber)}>{pageNumber}</a>
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
