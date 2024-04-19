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

  //llamado al end-point para listar las ordenes con su estado
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

  //todas las ordenes en el droplist
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


  // se debe de enviar ID y actualizar el estado de enum: ['pending', 'shipped', 'delivered', 'canceled'],  
  const updateOrder = async (e) => {
    try {
      console.log(selectedOrderId)
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

      } else {
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1000 });


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

//eliminar ordenes
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


      } else {
        setOrderList([]);
      }
    } catch (error) {
      console.error(error);
    }

  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="d-flex flex-column">
            <h4>Estados de Envío</h4>
            {order.map((ordenes) => (
              <ul className="list-group" key={ordenes._id}>
                <li className="list-group-item d-flex justify-content-between align-items-center mb-2">
                  {ordenes.orderNumber}
                  <span className={`badge ${ordenes.status === 'pending' ? 'bg-primary' : ordenes.status === 'shipped' ? 'bg-success' : ordenes.status === 'delivered' ? 'bg-info' : ordenes.status === 'canceled' ? 'bg-danger' : ''}`}>
                    {ordenes.status}
                  </span>
                  <i className="bi bi-x-circle" data-toggle="tooltip" data-placement="top" onClick={() => deleteOrder(ordenes._id)}title="Eliminar"></i>
                </li>
              </ul>
            ))}
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

        <div className="col-md-6">
          <h4>Actualizar Estado de Envío</h4>
          <form onSubmit={updateOrder}>
            <div className="mb-3s overflow-auto">
              <label htmlFor="estadoEnvio" className="form-label">Seleccionar Envío</label>
              <select className="form-select" id="estadoEnvio" onChange={(e) => setSelectedOrderId(e.target.value)} required>
                <option value="">Selecciona una orden</option>
                {orderlist.map((listordenes) => (
                  (listordenes.status !== "canceled") &&
                  <option key={listordenes._id} value={listordenes._id}>{listordenes.orderNumber}</option>
                ))}
              </select>
              <div className="invalid-feedback">Debes seleccionar una orden.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">Nuevo Estado</label>
              <select className="form-select" id="nuevoEstado" name='status' onChange={changed}>
                <option value='pending'>En Proceso</option>
                <option value='shipped'>Enviado</option>
                <option value='delivered'>Entregado</option>
                <option value='canceled'>Cancelado</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Actualizar Estado</button>
          </form>
        </div>
      </div>
    </div>



  );
};
