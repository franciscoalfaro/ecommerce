import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';

export const OrderAdmin = () => {
  const { auth } = useAuth({});
  const { form, changed } = useForm({})
  const [order, setOrder] = useState([])
  const [orderlist, setOrderList] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState('');

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    obtenerOrdenes(page)
    ListAllOrdenes()
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

  const obtenerOrdenes = async (nextPage = 1) => {
    try {
      const request = await fetch(Global.url + 'order/listall/' + nextPage, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      })
      const data = await request.json()

      if (data.status === "success") {
        setOrder(data.order)
        setTotalPages(data.totalPages);
      } else {
        console.log('code', data.message)
      }
    } catch (error) {
      console.log('code', error)
    }
  }

  const ListAllOrdenes = async () => {
    try {
      const request = await fetch(Global.url + 'order/listdrop', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      });
      const data = await request.json();

      if (data.status === "success") {
        setOrderList(data.order);
      } else {
        console.log('code', data.message);
      }
    } catch (error) {
      console.log('code', error);
    }
  }

  const updateOrder = async (e) => {
    try {
      e.preventDefault()
      let orden = form
      const request = await fetch(Global.url + "order/updatestatus/" + selectedOrderId, {
        method: "PUT",
        body: JSON.stringify(orden),
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      })
      const data = await request.json()

      if (data.status === 'success') {
        obtenerOrdenes()
        if (window.Swal) {
          Swal.fire({ 
            position: "bottom-end", 
            title: "Estado actualizado correctamente", 
            showConfirmButton: false, 
            timer: 1000,
            icon: 'success'
          });
        }
      } else {
        if (window.Swal) {
          Swal.fire({ 
            position: "bottom-end", 
            title: data.message, 
            showConfirmButton: false, 
            timer: 1000,
            icon: 'error'
          });
        }
      }
    } catch (error) {
      console.log('code', error)
    }
  }

  function generatePaginationNumbers(totalPages, currentPage) {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

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

  const deleteOrder = async (productID, index) => {
    try {
      const request = await fetch(Global.url + 'order/delete/' + productID, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await request.json();

      if (data.status === 'success') {
        const newItems = [...order];
        newItems.splice(index, 1);
        setOrderList(newItems);
        obtenerOrdenes()
        ListAllOrdenes()
        
        if (window.Swal) {
          Swal.fire({ 
            position: "bottom-end", 
            title: "Orden eliminada correctamente", 
            showConfirmButton: false, 
            timer: 1000,
            icon: 'success'
          });
        }
      } else {
        setOrderList([]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="status-pending">Pendiente</span>;
      case 'shipped':
        return <span className="status-shipped">Enviado</span>;
      case 'delivered':
        return <span className="status-delivered">Entregado</span>;
      case 'canceled':
        return <span className="status-canceled">Cancelado</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">
                <i className="bi bi-list-check me-2"></i>
                Estados de Envío
              </h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Número de Orden</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.map((ordenes) => (
                      <tr key={ordenes._id}>
                        <td className="fw-medium">{ordenes.orderNumber}</td>
                        <td>{getStatusBadge(ordenes.status)}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteOrder(ordenes._id)}
                            title="Eliminar orden"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={prevPage}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  {visiblePageNumbers.map((pageNumber) => (
                    <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPage(pageNumber)}>
                        {pageNumber}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={nextPage}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">
                <i className="bi bi-pencil-square me-2"></i>
                Actualizar Estado
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={updateOrder}>
                <div className="mb-3">
                  <label htmlFor="estadoEnvio" className="form-label">
                    Seleccionar Orden
                  </label>
                  <select 
                    className="form-select" 
                    id="estadoEnvio" 
                    onChange={(e) => setSelectedOrderId(e.target.value)} 
                    required
                  >
                    <option value="">Selecciona una orden</option>
                    {orderlist.map((listordenes) => (
                      listordenes.status !== "canceled" && (
                        <option key={listordenes._id} value={listordenes._id}>
                          {listordenes.orderNumber}
                        </option>
                      )
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Nuevo Estado
                  </label>
                  <select className="form-select" id="nuevoEstado" name='status' onChange={changed} required>
                    <option value="">Seleccionar estado</option>
                    <option value='pending'>En Proceso</option>
                    <option value='shipped'>Enviado</option>
                    <option value='delivered'>Entregado</option>
                    <option value='canceled'>Cancelado</option>
                  </select>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-2"></i>
                    Actualizar Estado
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Estados disponibles
              </h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center">
                  <span className="status-pending me-2">Pendiente</span>
                  <small className="text-muted">Orden recibida</small>
                </div>
                <div className="d-flex align-items-center">
                  <span className="status-shipped me-2">Enviado</span>
                  <small className="text-muted">En camino</small>
                </div>
                <div className="d-flex align-items-center">
                  <span className="status-delivered me-2">Entregado</span>
                  <small className="text-muted">Completado</small>
                </div>
                <div className="d-flex align-items-center">
                  <span className="status-canceled me-2">Cancelado</span>
                  <small className="text-muted">Cancelado</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};