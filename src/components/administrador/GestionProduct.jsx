import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { SerializeForm } from '../../helpers/SerializeForm';
import { IntlProvider, FormattedNumber } from 'react-intl';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { GetProducts } from '../../helpers/GetProducts';
import useModalClose from '../../hooks/useModalClose';

export const GestionProduct = () => {
  const { form, changed } = useForm({})
  const { auth } = useAuth({})

  const [product, setProduct] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  }


  useEffect(() => {
    getDataProduct();
  }, [page]);



  const deleteProduct = async (productID, index) => {

    try {
      const request = await fetch(Global.url + 'product/delete/' + productID, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await request.json();

      if (data.status === 'success') {
        const newItems = [...product];
        newItems.splice(index, 1);
        setProduct(newItems);
        getDataProduct()


      } else {
        setProduct([]);
      }
    } catch (error) {
      console.error(error);
    }

  }


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



  //llamado a helpers para obtener el listado de los productos 
  const getDataProduct = async () => {
    try {
      let data = await GetProducts(page, setProduct, setTotalPages);
      setProduct(data.products);
      setTotalPages(data.totalPages)

    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <>
      <div className="container mt-4">
        <h2>Gestión de Productos</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>

                <th>Categoría</th>
                <th>Stock</th>
                <th>Ubicacion</th>
                <th>Destacado</th>
                <th>Precio</th>
                <th>Precio oferta</th>
                <th>Acciones</th>

              </tr>
            </thead>
            <tbody>
              {product.map((prod, index) => (
                <tr key={index}>
                  <td>{prod.name}</td>

                  <td>{prod.category.name}</td>
                  <td>{prod.stock ? prod.stock.quantity : 'N/A'}</td>
                  <td>{prod.stock ? prod.stock.location : 'N/A'}</td>

                  <td>{prod.standout ? 'Sí' : 'No'}</td>
                  <IntlProvider locale="es" defaultLocale="es">
                    <td><FormattedNumber value={prod.price} style="currency" currency="CLP" /></td>
                  </IntlProvider>
                  <IntlProvider locale="es" defaultLocale="es">
                    <td><FormattedNumber value={prod.offerprice ? prod.offerprice : 0} style="currency" currency="CLP" /></td>
                  </IntlProvider>

                  <td>
                    <span>{prod.standout}</span>
                    <button className="btn btn-danger btn-sm me-2" onClick={() => deleteProduct(prod._id)}>Eliminar</button>
                                        
                    <Link to={auth && auth._id ? `/admin/editar-producto/${prod._id}` : '#'}>
                      <button className="btn btn-info btn-sm">Editar</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br></br>
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


    </>



  );
};
