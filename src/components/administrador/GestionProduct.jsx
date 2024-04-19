import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { SerializeForm } from '../../helpers/SerializeForm';

export const GestionProduct = () => {
  const { changed } = useForm()


  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [product, setProduct] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null);


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
    getProduct(page);
  }, [page]);


  const getProduct = async (nextPage = 1) => {
    try {
      const request = await fetch(Global.url + "product/list/" + nextPage, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': localStorage.getItem('token')
        }
      })
      const data = await request.json();
      console.log(data)
      if (data.status === 'success') {

        setProduct(data.products);
        setTotalPages(data.totalPages)
      } else {
        setProduct([]);
      }

    } catch (error) {
      console.error(error);
    }
  }

  const handleProductClick = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
  };


  const updateProduct = async (e) => {
    e.preventDefault();
    const productID = selectedProduct._id
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

      if (data.status === "success") {
        getProduct()
      }


    } catch (error) {
      console.error(error);
    }

        // subida de imagen al servidor
        const fileInput = document.querySelector("#file");

        if (data.status == "success" && fileInput.files[0]) {
          // Recoger imagen a subir
          const formData = new FormData();
          formData.append('files', fileInput.files[0]);
    
          // Verificar la extensión del archivo
          const fileName = fileInput.files[0].name;
          const fileExtension = fileName.split('.').pop().toLowerCase();
    
          if (fileExtension === 'gif') {
            // Si la extensión es .gif, subir el archivo sin comprimir
            const uploadRequest = await fetch(Global.url + "product/upload"+productID, {
              method: "POST",
              body: formData,
              headers: {
                'Authorization': localStorage.getItem('token')
              }
            });
    
            const uploadData = await uploadRequest.json();
    
    
            if (uploadData.status == "success" && uploadData.user) {
              delete uploadData.password;
              setAuth({ ...auth, ...uploadData.user });
              setTimeout(() => { window.location.reload() }, 0);
              setSaved("saved");
            } else {
              setSaved("error");
            }
          } else {
            // Si no es .gif, comprimir el archivo antes de subirlo
            const compressedFile = await compressImage(fileInput.files[0]);
    
            // Crear un nuevo FormData con el archivo comprimido
            const compressedFormData = new FormData();
            compressedFormData.append('file0', compressedFile);
    
            // Subir el archivo comprimido
            const uploadRequest = await fetch(Global.url + "product/upload"+productID, {
              method: "POST",
              body: compressedFormData,
              headers: {
                'Authorization': localStorage.getItem('token')
              }
            });
    
            const uploadData = await uploadRequest.json();
    
    
            if (uploadData.status == "success" && uploadData.user) {
              delete uploadData.password;
              setAuth({ ...auth, ...uploadData.user });
              setTimeout(() => { window.location.reload() }, 0);
              setSaved("saved");
            } else {
              setSaved("error");
            }
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
                // Crear un lienzo (canvas) para dibujar la imagen comprimida
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                  // Redimensionar la imagen si supera el ancho máximo
                  height *= maxWidth / width;
                  width = maxWidth;
                }
                if (height > maxHeight) {
                  // Redimensionar la imagen si supera la altura máxima
                  width *= maxHeight / height;
                  height = maxHeight;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                // Dibujar la imagen en el lienzo con el tamaño redimensionado
                ctx.drawImage(img, 0, 0, width, height);
                // Convertir el lienzo a un archivo comprimido (blob)
                canvas.toBlob((blob) => {
                  // Crear un nuevo archivo con el blob comprimido
                  const compressedFile = new File([blob], file.name, { type: file.type });
                  resolve(compressedFile);
                }, file.type, quality);
              };
            };
            reader.onerror = (error) => reject(error);
          });
        }


  }


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
        getProduct()


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






  return (
    <>
      <div className="container mt-4">
        <h2>Gestión de Productos</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>ubicacion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {product.map((prod, index) => (
                <tr key={index}>
                  <td>{prod.name}</td>
                  <td>{prod.description}</td>
                  <td>{prod.category.name}</td>
                  <td>{prod.stock ? prod.stock.quantity : 'N/A'}</td>
                  <td>{prod.stock ? prod.stock.location : 'N/A'}</td>
                  <td>
                    <button className="btn btn-danger btn-sm me-2" onClick={() => deleteProduct(prod._id)}>Eliminar</button>
                    <button className="btn btn-info btn-sm me-2" data-toggle="modal" data-target="#exampleModal2" onClick={() => handleProductClick(prod)}>Editar</button>
                    <button className="btn btn-info btn-sm" data-toggle="modal" data-target="#exampleModal" onClick={() => handleProductClick(prod)}>Stock</button>
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
            <div className="modal-body">
              <form>
                <div className="mb-3 row">
                  <label htmlFor="nombreProducto" className="col-sm-4 col-form-label"></label>
                  <div className="col-sm-12">
                    <div className="input-group">
                      <span className="input-group-text">Nombre del Producto</span>
                      <input type="text" className="form-control" id="nombreProducto" readOnly defaultValue="Producto 1" />
                    </div>
                  </div>
                </div>

                <div className="mb-3 row">
                  <label htmlFor="stock" className="col-sm-4 col-form-label"></label>
                  <div className="col-sm-12">
                    <div className="input-group">
                      <span className="input-group-text">stock</span>
                      <input type="number" name='stock' className="form-control" id="stock" defaultValue="0" />
                    </div>
                  </div>
                </div>

                <div className="mb-3 row">
                  <label htmlFor="stock" className="col-sm-4 col-form-label"></label>
                  <div className="col-sm-12">
                    <div className="input-group">
                      <span className="input-group-text">ubicacion</span>
                      <input type="number" name='ubicacion' className="form-control" id="ubicacion" defaultValue="bodega" />
                    </div>
                  </div>
                </div>

              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
              <button type="submit" className="btn btn-primary">Asignar</button>
            </div>
          </div>
        </div>
      </div>

      {/* abrir modal para editar producto*/}
      <div className="modal fade bd-example-modal-lg" id="exampleModal2" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel" >Editar</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={updateProduct}>
              <div className="modal-body">
                {selectedProduct && (
                  <div>
                    <div className="mb-3">
                      <label htmlFor="name">Nombre:</label>
                      <input type="text" className="form-control" name="name" defaultValue={selectedProduct.name} onChange={changed} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description">Descripcion:</label>
                      <input type="text" className="form-control" name="description" defaultValue={selectedProduct.description} onChange={changed} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="brand">Marca:</label>
                      <input type="text" className="form-control" name="brand" defaultValue={selectedProduct.brand} onChange={changed} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="price">Precio:</label>
                      <input type="number" className="form-control" name="price" defaultValue={selectedProduct.price} onChange={changed} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="size">Talla:</label>
                      <input type="text" className="form-control" name="size" defaultValue={selectedProduct.size} onChange={changed} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="standout">Destacado:</label>
                      <select className="form-control" name="standout" defaultValue={selectedProduct.standout} onChange={changed}>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="stock">Stock:</label>
                      <input type="text" className="form-control" readOnly name="stock" defaultValue={selectedProduct.stock ? selectedProduct.stock.quantity : 'N/A'} />
                      <input type="text" className="form-control" readOnly hidden name="stock" defaultValue={selectedProduct.stock ? selectedProduct.stock._id : 'N/A'} />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="location">Ubicacion:</label>
                      <input type="text" className="form-control" name="location" defaultValue={selectedProduct.stock ? selectedProduct.stock.location : 'N/A'} onChange={changed} />
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



  );
};
