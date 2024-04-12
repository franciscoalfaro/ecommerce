import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { Grafico } from './Grafico';

export const Dashboard = () => {

  const { auth } = useAuth({})
  const [detalles, setDetalles] = useState([])

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  useEffect(() => {
    obtenerDetalle(page)
  }, [page])

  const nextPage = () => {
    let next = page + 1;
    setPage(next);

  };
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };


  //informacion detallada los productos mas vendidos ( nombre y cantidad )
  const obtenerDetalle = async (nextPage = 1) => {
    try {
      const request = await fetch(Global.url + "product/bestlist/" + nextPage, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }

      })
      const data = await request.json()

      if (data.status === 'success') {

        setDetalles(data.bestselling)
        setTotalPages(data.totalPages)


      } else {
        setDetalles([])
        console.log('code', data.message)
      }
    } catch (error) {
      console.log('code', error)
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




  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Panel de Control - Administrador</h2>
      <div className="row">
        <div className="col-md-6">
          <Grafico></Grafico>
        </div>
        <div className="col-md-6">
          <h3>Productos Más Vendidos</h3>
          {detalles.length === 0 ? (
            <p>sin informacion de productos mas vendidos</p>
          ) : (
            <ul className="list-group">
              {detalles.map((product) => (
                <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                  {product.nombreproducto}
                  <span className="badge bg-primary rounded-pill">{product.quantity}</span> {/* Cambiar clase badge-pill a rounded-pill */}
                </li>
              ))}
            </ul>
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
      </div>
    </div>
  );
};
