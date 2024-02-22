import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';


export const Products = () => {

  //listar todos los productos y permitir un filtro de productos
  const [filter, setFilter] = useState('');
  const [products, setProducts] = useState([])

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

  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  const productList = async (nextPage = 1) => {

    try {
      const request = await fetch(Global.url + 'product/list' + '/' + nextPage, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      })
      const data = await request.json()
      console.log(data)
      if (data.status === 'success') {
        setProducts(data.products)
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
          <h2>Filtrar por</h2>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <select className="form-select" value={filter} onChange={handleChange}>
                <option value="">Todos los productos</option>
                <option value="zapatillas">Zapatillas</option>
                <option value="ropa">Ropa</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 bg-light">
        <div className="container">
          {products.length === 0 ? (
            <p>No existen productos mas vendidos.</p>
          ) : (
            <div className="row">
              {products.map(product => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product._id}>
                  <div className="card">
                    {product.images.length > 0 && (
                      <img src={Global.url + 'product/media/' + product.images[0].filename} className="card-img-top" alt={product.name}></img>
                    )}
                    
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">${product.price}</p>
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
  )
}
