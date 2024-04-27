import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Global } from '../../helpers/Global'
import { useForm } from '../../hooks/useForm'
import { SerializeForm } from '../../helpers/SerializeForm'
import useModalClose from '../../hooks/useModalClose'
import useModal2 from '../../hooks/useModal2'

export const ProductEdit = () => {
  const params = useParams()
  const [product, setProduct] = useState(null);
  const { form, changed } = useForm({})
  const closeModal = useModalClose();
  const closeModal2 = useModal2();


  //producto Seleccionado 
  const productSelected = async () => {
    let id = params.id

    try {
      const request = await fetch(Global.url + 'product/obtenido/' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      })
      const data = await request.json()

      if (data.status === 'success') {
        setProduct(data.product)
  

      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log('code', error)
    }
  }

  useEffect(() => {
    productSelected()
  }, [])


  const deleteImagen = async (image, index) => {
    let images = image;
    let productId = params.id;

    try {
      const request = await fetch(Global.url + 'product/deleteImages/' + productId, {
        method: 'DELETE',
        body: JSON.stringify({ images }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await request.json();

      if (data.status === 'success') {
        productSelected()


      } else {
        console.error('Error deleting image:', data.message);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };





  const updateProduct = async (e) => {
    e.preventDefault();
    const productID = product._id
    const updateProduct = SerializeForm(e.target)
    delete updateProduct.stock;

    try {
      const request = await fetch(Global.url + "product/update/" + productID, {
        method: "PUT",
        body: JSON.stringify(updateProduct),
        headers: {
          "Content-Type": "application/json",
          'Authorization': localStorage.getItem('token')
        }
      })
      const data = await request.json();
      const fileInput = document.querySelector("#files");

      if (!fileInput) {

        return;
      }

      const imagesAttached = fileInput && fileInput.files.length > 0;


      if (data.status === "success" && !imagesAttached) {
        Swal.fire({ position: "bottom-end", title: "Producto actualizado correctamente", showConfirmButton: false, timer: 1000 });
        productSelected()
      } else {
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1000 });
      }


      const files = fileInput.files;

      if (data.status === "success" && files.length > 0) {
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
          const compressedFile = await compressImage(files[i], 800, 600, 0.7);
          formData.append('files', compressedFile);
        }

        const uploadRequest = await fetch(Global.url + "product/uploads/" + productID, {
          method: "POST",
          body: formData,
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        });
        const uploadData = await uploadRequest.json();

        if (uploadData.status === "success") {
          productSelected()

          const myForm = document.querySelector("#product");
          myForm.reset();

        } else {
          Swal.fire({ position: "bottom-end", title: uploadData.message, showConfirmButton: false, timer: 1000 });
        }
      } else {
        // Si no se adjuntaron imágenes, se restablece el formulario
        const myForm = document.querySelector("#product");
        myForm.reset();

      }


    } catch (error) {
      console.error(error);
    }

  }

  // Función para comprimir la imagen
  async function compressImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, { type: file.type });
            resolve(compressedFile);
          }, file.type, quality);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  }




  //crear llamado para crear especificaciones y caracteristicas adicionales.
  const spectCreate = async (e) => {
    e.preventDefault();

    try {
      let newEspect = form;
      const productId = params.id

      const request = await fetch(Global.url + "product/spect/" + productId, {
        method: "POST",
        body: JSON.stringify(newEspect),
        headers: {
          "Content-Type": "application/json",
          'Authorization': localStorage.getItem('token')
        }
      })
      const data = await request.json();
      if (data.status === 'success') {
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1000 });
        productSelected()
        const myForm = document.querySelector("#modalForm");
        myForm.reset();
        closeModal()


      }
      if (data.status === 'error') {
        console.log(data.status)
        const myForm = document.querySelector("#modalForm");
        myForm.reset();
        closeModal()


        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1000 });

      }
    } catch (error) {
      console.log('existe un error:', error)

    }

  }


  const deleteSpect = async (specification, index) => {
    const productID = product._id
    let spectId = specification

    try {
      const request = await fetch(Global.url + 'product/deletespect/' + productID, {
        method: 'DELETE',
        body: JSON.stringify({ spectId }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await request.json();

      if (data.status === 'success') {
        //const newItems = [...product];
        //newItems.splice(index, 1);
        //setProduct(newItems);
        productSelected()


      } else {
        setProduct([]);
      }
    } catch (error) {
      console.error(error);
    }

  }


  //funcion para crear stock
  const addStock = async (e) => {

    e.preventDefault();
    const productID = params.id

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
      if (data.status === 'success') {
        productSelected()
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1000 });
        const myForm = document.querySelector("#formStock");
        myForm.reset();
        closeModal2()


      }
      if (data.status === 'error') {
        const myForm = document.querySelector("#formStock");
        myForm.reset();
        closeModal2()
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1000 });

      }else{
        console.log('existe un error:', data.message)
      }
    } catch (error) {
      console.log('existe un error:', error)

    }

  }



  return (
    <>

      <form id='product' onSubmit={updateProduct}>
        <div className="">
          {product && (
            <div>
              {/* Sección de campos de texto */}
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="name">Nombre:</label>
                  <input type="text" className="form-control" name="name" defaultValue={product.name} onChange={changed} />
                </div>
                <div className="col">
                  <label htmlFor="description">Descripción:</label>
                  <input type="text" className="form-control" name="description" defaultValue={product.description} onChange={changed} />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="brand">Marca:</label>
                  <input type="text" className="form-control" name="brand" defaultValue={product.brand} onChange={changed} />
                </div>
                <div className="col">
                  <label htmlFor="price">Precio:</label>
                  <input type="number" className="form-control" name="price" defaultValue={product.price} onChange={changed} />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="size">Talla:</label>
                  <input type="text" className="form-control" name="size" defaultValue={product.size} onChange={changed} />
                </div>
                <div className="col">
                  <label htmlFor="standout">Destacado:</label>
                  <select className="form-control" name="standout" defaultValue={product.standout} onChange={changed}>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="offerprice">Precio oferta:</label>
                  <input type="text" className="form-control" name="offerprice" defaultValue={product.offerprice} onChange={changed} />
                </div>
                <div className="col">

                </div>
              </div>



              <div className="row mb-3">
                <div className="col">
                  <p>Especificaciones <i className="bi bi-plus-circle" data-toggle="modal" data-target="#exampleModal" style={{ cursor: 'pointer' }}></i></p>
                </div>
                <div className="col">
                  {product.specifications.length > 0 ? (
                    <>
                      <h5>Especificaciones:</h5>
                      {product.specifications.map((specification, index) => (
                        <div key={index}>
                          <ul>
                            <li>{specification.key}: {specification.value} <i className="bi bi-trash" onClick={() => deleteSpect(specification._id)}></i></li>
                          </ul>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>sin especificaciones</p>
                  )}

                </div>
              </div>



              <div className="row mb-3">
                <div className="col-sm-2">
                  <label htmlFor="stock">Stock:</label>
                  <input type="text" className="form-control" disabled name="stock" value={product.stock ? product.stock.quantity : 'N/A'}/>
                  <input type="text" className="form-control"  disabled hidden name="stock" defaultValue={product.stock ? product.stock._id : 'N/A'} />
                </div>
                <div className="col-sm-8">
                  <label htmlFor="location">Ubicación:</label>
                  <input type="text" className="form-control" name="location" defaultValue={product.stock ? product.stock.location : 'N/A'} disabled onChange={changed} />
                </div>
                <div className="col-sm-2">
                  <br></br>
                  <button type='button' className="stockedit btn btn-info" data-toggle="modal" data-target="#exampleModal2">Stock</button>
                </div>
              </div>




              {/* Sección de imágenes */}
              <div className="row mb-3 border border-primary rounded p-3">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div key={index} className="col-3 position-relative">
                      <img src={Global.url + 'product/media/' + image.filename} className="d-block w-100 small-image" alt={`Imagen ${index}`} />

                      <button className="btn btn-danger btn-sm delete-button" onClick={() => deleteImagen(image._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center">
                    <p>Sin imágenes disponibles</p>
                  </div>
                )}

                {/* Sección para agregar más imágenes */}
                <hr></hr>

                <div className="col-12 text-center">
                  <div className="mb-3">
                    <label htmlFor="imagenProducto" className="form-label">Agregar imágenes</label>
                    <input type="file" name='files' className="form-control" id="files" multiple onChange={changed}></input>
                  </div>
                </div>
              </div>



            </div>
          )}
        </div>
        <div className="container text-center">
          <div className="row">
            <div className="col-sm-2">
              <Link to={`/admin/administrar-productos/`}><button type="submit" className="btn btn-primary">volver atras</button></Link>
            </div>
            <div className="col-sm-8">

            </div>
            <div className="col-sm-2">
              <button type="submit" className="btn btn-primary">Actualizar</button>
            </div>
          </div>
        </div>

      </form>


      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModal" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModal">Nueva Especificacion</h1>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form id='modalForm' onSubmit={spectCreate}>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">Nombre:</label>
                  <input type="text" className="form-control" name='key' id="recipient-key" onChange={changed}></input>
                </div>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">Detalle:</label>
                  <input type="text" className="form-control" name='value' id="recipient-value" onChange={changed}></input>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  <button type="submit" className="btn btn-primary">Agregar Especificacion</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>


      {/* modal stock*/}
      <div className="modal fade" id="exampleModal2" tabIndex="-1" role="dialog" aria-labelledby="exampleModal2" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModal2">Crear Stock</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form id='formStock' onSubmit={addStock}>
              <div className="modal-body">
                {product && (
                  <div>
                    <div className="mb-3 row">
                      <label htmlFor="name" className="col-sm-4 col-form-label"></label>
                      <div className="col-sm-12">
                        <div className="input-group">
                          <span className="input-group-text">Nombre del Producto</span>
                          <input type="text" className="form-control" id="name" readOnly value={product.name}></input>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="stock" className="col-sm-4 col-form-label"></label>
                      <div className="col-sm-12">
                        <div className="input-group">
                          <span className="input-group-text">stock</span>
                          <input type="number" name='quantity' id="stock" defaultValue={product.stock ? product.stock.quantity : ''} onChange={changed} />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label htmlFor="stock" className="col-sm-4 col-form-label"></label>
                      <div className="col-sm-12">
                        <div className="input-group">
                          <span className="input-group-text">ubicacion</span>
                          <input type="text" name='location' className="form-control" id="ubicacion" defaultValue={product.stock ? product.stock.location : ''} onChange={changed} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-primary">Actualizar</button>
              </div>
            </form>

          </div>
        </div>
      </div>



    </>
  )
}
