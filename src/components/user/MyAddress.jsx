import React, { useEffect, useRef, useState } from 'react';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { SerializeForm } from '../../helpers/SerializeForm';
import useModalClose from '../../hooks/useModalClose';
import useModal2 from '../../hooks/useModal2';

export const MyAddress = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [totalDoc, setTotalDoc] = useState(1)
  const { form, changed } = useForm()
  const closeModal = useModalClose();
  const closeModal2 = useModal2();


  const nextPage = () => {
    let next = page + 1;
    setPage(next);

  }
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  }



  useEffect(() => {
    getAddressList(page);
  }, [page]);

  const getAddressList = async (nextPage = 1) => {
    try {
      const request = await fetch(Global.url + 'address/list/' + nextPage, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await request.json();
      console.log(data)
      if (data.status === 'success') {
        setAddress(data.address);
        setTotalPages(data.totalPages)
        setTotalDoc(data.totalDocs)
      } else {
        setAddress([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddressClick = (selectedAddress) => {
    setSelectedAddress(selectedAddress);
    getAddressList()
  };



  const deleteAddress = async (addressId, index) => {

    try {
      const request = await fetch(Global.url + 'address/delete/' + addressId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await request.json();

      if (data.status === 'success') {
        const newItems = [...address];
        newItems.splice(index, 1);
        setAddress(newItems);
        getAddressList()


      } else {
        setAddress([]);
      }
    } catch (error) {
      console.error(error);
    }

  }


  const updateAddress = async (e) => {
    e.preventDefault();
    const addressID = selectedAddress._id
    const updateAddressUser = SerializeForm(e.target)
    try {
      const request = await fetch(Global.url + "address/update/" + addressID, {
        method: "PUT",
        body: JSON.stringify(updateAddressUser),
        headers: {
          "Content-Type": "application/json",
          'Authorization': localStorage.getItem('token')
        }
      })
      const data = await request.json();

      if (data.status === "success") {
        Swal.fire({ position: "bottom-end", title: "Direccion actualizada correctamente", showConfirmButton: false, timer: 800 });
        getAddressList()
        closeModal2()
      } else {
        console.log(data.message)
        closeModal2()
      }


    } catch (error) {
      console.error(error);
    }


  }



  const createAddress = async (e) => {
    e.preventDefault();

    let newAddress = form

    try {
      const request = await fetch(Global.url + 'address/create', {
        method: "POST",
        body: JSON.stringify(newAddress),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')

        }
      })
      const data = await request.json()

      if (data.status === "success") {
        getAddressList()
        Swal.fire({ position: "bottom-end", title: "Direccion Agregada correctamente", showConfirmButton: false, timer: 800 });
        closeModal()

      } else {
        console.log(data.message)
        closeModal()

      }

      const myForm = document.querySelector("#CreateAdd")
      myForm.reset()


    } catch (error) {
      console.error(error);
    }
  }



  // Función para manejar el cierre del modal
  const cerrarModal = () => {
    const myForm = document.querySelector("#updateAddres");
    myForm.reset();
    getAddressList()
  };

  return (
    <div>
      <h2>Mis Direcciones</h2>
      <button type="button" className="btn btn-secondary"><i className="bi bi-building-fill-add" data-toggle="modal" data-target="#exampleModal"> Agregar nueva direccion</i>
      </button>
      <hr></hr>

      {address && address.length > 0 ? (
        <div className="row">
          {address.map((addr, index) => (
            // Verificar si la dirección está marcada como eliminada
            addr.eliminado === false ? (
              <div key={addr._id} className="col-md-4 mb-3">
                <div className="address-container">
                  <div>
                    <i className="bi bi-geo-alt h1" onClick={() => handleAddressClick(addr)} data-toggle="modal" data-target="#exampleModal3" style={{ cursor: 'pointer' }}></i>
                    <h5>{addr.nombre}</h5>
                    <div>
                      <i className="bi bi-trash" onClick={() => deleteAddress(addr._id)} style={{ cursor: 'pointer' }}></i>
                      <i className="bi bi-pencil ms-2" onClick={() => handleAddressClick(addr)} data-toggle="modal" data-target="#exampleModal2" style={{ cursor: 'pointer' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            ) : null // Si la dirección está marcada como eliminada, no mostrarla
          ))}
        </div>
      ) : (
        <div>
          Sin direcciones
        </div>
      )}


      {address && address.length > 0 ? (
        <ul className="list-group">
          {address.map((addr, index) => (
            // Verificar si la dirección está marcada como eliminada
            addr.eliminado === false ? (
              <li key={addr._id} className="list-group-item d-flex justify-content-between align-items-center">
                <p onClick={() => handleAddressClick(addr)} data-toggle="modal" data-target="#exampleModal3" style={{ cursor: 'pointer' }}>{addr.nombre}</p>
                <div>

                  <i className="bi bi-trash" onClick={() => deleteAddress(addr._id)} style={{ cursor: 'pointer' }}></i>
                  <i className="bi bi-pencil-square" onClick={() => handleAddressClick(addr)} data-toggle="modal" data-target="#exampleModal2" style={{ cursor: 'pointer' }}></i>
                </div>
              </li>
            ) : null // Si la dirección está marcada como eliminada, no mostrarla
          ))}
        </ul>
      ) : (
        <div>
          Sin direcciones
        </div>
      )}


      {totalDoc >= 4 ? (
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
      ) : (
        <div></div>
      )}



      <div className="modal fade" id="exampleModal3" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel3" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel3" >Mi dirección</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {selectedAddress && (
                <div>
                  <p><strong>Nombre:</strong> {selectedAddress.nombre}</p>
                  <p><strong>Dirección:</strong> {selectedAddress.direccion}</p>
                  <p><strong>Número:</strong> {selectedAddress.numero}</p>
                  <p><strong>Teléfono:</strong> {selectedAddress.phone}</p>
                  <p><strong>Región:</strong> {selectedAddress.region}</p>
                  <p><strong>Comuna:</strong> {selectedAddress.comuna}</p>
                  <p><strong>Ciudad:</strong> {selectedAddress.ciudad}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>


      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel" >Crear nueva direccion</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form id="CreateAdd" onSubmit={createAddress}>
              <div className="modal-body">
                <div className="container">
                  <div className="row">
                    <div className="col order-first">
                      <label htmlFor="nombre">Nombre:</label>
                      <input type="text" className="form-control" id="nombre" name="nombre" onChange={changed} />
                    </div>
                    <div className="col">
                      <label htmlFor="direccion">Dirección:</label>
                      <input type="text" className="form-control" id="direccion" name="direccion" onChange={changed} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col order-first">
                      <label htmlFor="numero">Número:</label>
                      <input type="text" className="form-control" id="numero" name="numero" onChange={changed} />
                    </div>
                    <div className="col">
                      <label htmlFor="phone">Teléfono:</label>
                      <input type="text" className="form-control" id="phone" name="phone" onChange={changed} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col order-first">
                      <label htmlFor="codigoPostal">Código Postal:</label>
                      <input type="text" className="form-control" id="codigoPostal" name="codigoPostal" onChange={changed} />
                    </div>
                    <div className="col">
                      <label htmlFor="region">Región:</label>
                      <input type="text" className="form-control" id="region" name="region" onChange={changed} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col order-first">
                      <label htmlFor="comuna">Comuna:</label>
                      <input type="text" className="form-control" id="comuna" name="comuna" onChange={changed} />
                    </div>
                    <div className="col">
                      <label htmlFor="ciudad">Ciudad:</label>
                      <input type="text" className="form-control" id="ciudad" name="ciudad" onChange={changed} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-primary">Crear</button>
              </div>
            </form>

          </div>
        </div>
      </div>

      <div className="modal fade" id="exampleModal2" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel2" >Actualizar direccion</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => cerrarModal()}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form id="updateAddres" onSubmit={updateAddress}>
              <div className="modal-body">
                {selectedAddress && (
                  <div className="container">
                    <div className="row">
                      <div className="col order-first">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" className="form-control" id="nombre" name="nombre" defaultValue={selectedAddress.nombre} onChange={changed} />
                      </div>
                      <div className="col">
                        <label htmlFor="direccion">Dirección:</label>
                        <input type="text" className="form-control" id="direccion" name="direccion" defaultValue={selectedAddress.direccion} onChange={changed} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col order-first">
                        <label htmlFor="numero">Número:</label>
                        <input type="text" className="form-control" id="numero" name="numero" defaultValue={selectedAddress.numero} onChange={changed} />
                      </div>
                      <div className="col">
                        <label htmlFor="phone">Teléfono:</label>
                        <input type="text" className="form-control" id="phone" name="phone" defaultValue={selectedAddress.phone} onChange={changed} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col order-first">
                        <label htmlFor="codigoPostal">Código Postal:</label>
                        <input type="text" className="form-control" id="codigoPostal" name="codigoPostal" defaultValue={selectedAddress.codigoPostal} onChange={changed} />
                      </div>
                      <div className="col">
                        <label htmlFor="region">Región:</label>
                        <input type="text" className="form-control" id="region" name="region" defaultValue={selectedAddress.region} onChange={changed} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col order-first">
                        <label htmlFor="comuna">Comuna:</label>
                        <input type="text" className="form-control" id="comuna" name="comuna" defaultValue={selectedAddress.comuna} onChange={changed} />
                      </div>
                      <div className="col">
                        <label htmlFor="ciudad">Ciudad:</label>
                        <input type="text" className="form-control" id="ciudad" name="ciudad" defaultValue={selectedAddress.ciudad} onChange={changed} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => cerrarModal()}>Cerrar</button>
                <button type="submit" className="btn btn-primary">Actualizar</button>
              </div>
            </form>

          </div>
        </div>
      </div>


    </div >
  );
};

