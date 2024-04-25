import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { SerializeForm } from '../../helpers/SerializeForm';
import { IntlProvider, FormattedNumber } from 'react-intl';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { GetProducts } from '../../helpers/GetProducts';

export const GestionProduct = () => {
  const { form, changed } = useForm({})
  const { auth } = useAuth({})

  const [product, setProduct] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);


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



  const handleProductClick = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
  };



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



  //funcion para crear stock
  const addStock = async (e) => {

    e.preventDefault();
    const productID = selectedProduct._id
    console.log(productID)
    const createStock = SerializeForm(e.target)

    try {
      const request = await fetch(Global.url + "stock/create/" + productID, {
        method: "POST",
        body: JSON.stringify(createStock),
        headers: {
          "Content-Type": "application/json",
          'Authorization': localStorage.getItem('token')
        }
      })
      const data = await request.json();
      console.log(data)

      if (data.status === "success") {
        Swal.fire({ position: "bottom-end", title: "stock actualizado correctamente", showConfirmButton: false, timer: 1000 });
        getProduct()
        $('#exampleModal').modal('hide');
        window.location.replace('/admin/administrar-productos')

      } else {
        setProduct([])
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1000 });
      }

    } catch (error) {
      console.log('code', error);
    }

  }




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
                    <button className="btn btn-info btn-sm" data-toggle="modal" data-target="#exampleModal" onClick={() => handleProductClick(prod)}>Stock</button>
                    
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


      {/* abrir modal de creación de crear stock */}

      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Crear Stock</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={addStock}>
              <div className="modal-body">
                {selectedProduct && (
                  <div>
                    <div className="mb-3 row">
                      <label htmlFor="name" className="col-sm-4 col-form-label"></label>
                      <div className="col-sm-12">
                        <div className="input-group">
                          <span className="input-group-text">Nombre del Producto</span>
                          <input type="text" className="form-control" id="name" readOnly value={selectedProduct.name}></input>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="stock" className="col-sm-4 col-form-label"></label>
                      <div className="col-sm-12">
                        <div className="input-group">
                          <span className="input-group-text">stock</span>
                          <input type="number" name='quantity' id="stock" defaultValue={selectedProduct.stock ? selectedProduct.stock.quantity : ''} onChange={changed} />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="stock" className="col-sm-4 col-form-label"></label>
                      <div className="col-sm-12">
                        <div className="input-group">
                          <span className="input-group-text">ubicacion</span>
                          <input type="text" name='location' className="form-control" id="ubicacion" defaultValue={selectedProduct.stock ? selectedProduct.stock.location : ''} onChange={changed} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={(e) => { admin / administrar-productos }} data-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-primary">Actualizar</button>
              </div>
            </form>

          </div>
        </div>
      </div>


    </>



  );
};
