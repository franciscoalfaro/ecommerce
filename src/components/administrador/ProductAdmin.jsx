import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';

export const ProductAdmin = () => {
  const { auth } = useAuth({});
  const { form, changed } = useForm({})

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [categoria, setCategorias] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedOption, setSelectedOption] = useState('')

  const opcioneDelselect = (event) => {
    setSelectedOption(event.target.value); // Actualiza la opción seleccionada

  };


  //llamar eventos distintos con onchange
  const eventosDistintos = (event) => {
    opcioneDelselect(event);
    changed(event);
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
    listCategoryAdmin(page)
  }, [page])


  const crearProducto = async (e) => {
    e.preventDefault();

    let newProduct = form;

    try {
      const request = await fetch(Global.url + "product/create/", {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await request.json();

      const fileInput = document.querySelector("#files");

      const imagesAttached = fileInput && fileInput.files.length > 0;


      if (data.status === "success" && !imagesAttached) {
        Swal.fire({ position: "bottom-end", title: "Producto creado correctamente", showConfirmButton: false, timer: 1000 });
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

        const uploadRequest = await fetch(Global.url + "product/uploads/" + data.newProduct._id, {
          method: "POST",
          body: formData,
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        });
        const uploadData = await uploadRequest.json();

        if (uploadData.status === "success") {
         
          const myForm = document.querySelector("#product");
          myForm.reset();
          setSelectedOption('');
        } else {
          Swal.fire({ position: "bottom-end", title: uploadData.message, showConfirmButton: false, timer: 1000 });
        }
      } else {
        // Si no se adjuntaron imágenes, se restablece el formulario
        const myForm = document.querySelector("#product");
        myForm.reset();
        setSelectedOption('');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ position: "bottom-end", title: "Error al crear el producto", showConfirmButton: false, timer: 1000 });
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




  const listCategoryAdmin = async () => {
    try {
      const request = await fetch(Global.url + "category/list/", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }

      })
      const data = await request.json()

      if (data.status === 'success') {

        setCategorias(data.categorias)
        setTotalPages(data.totalPages)


      } else {
        setCategorias([])
        console.log('code', data.message)
      }
    } catch (error) {
      console.log('code', error)
    }
  }



  return (
    <div className="container mt-4">
      <h4>Crear Nuevo Producto</h4>
      <form id='product' onSubmit={crearProducto}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre del Producto</label>
          <input type="text" className="form-control" id="nombreProducto" name='name' placeholder="Ingrese el nombre del producto" required onChange={changed}></input>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descripción del Producto</label>
          <textarea className="form-control" id="description" rows="3" name='description' placeholder="Ingrese la descripción del producto" required onChange={changed}></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="brand" className="form-label">Marca del Producto</label>
          <input type="text" className="form-control" id="brand" name='brand' placeholder="Marca del producto" required onChange={changed}></input>
        </div>

        <div className="mb-3">
          <label htmlFor="size" className="form-label">Talla del Producto</label>
          <input type="text" className="form-control" id="size" name='size' min={0} placeholder="Talla del producto" required onChange={changed}></input>
        </div>

        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Genero</label>
          <input type="text" className="form-control" id="gender" name='gender' placeholder="Talla del producto" required onChange={changed}></input>
        </div>


        <div className="mb-3">
          <label htmlFor="price" className="form-label">Precio del Producto</label>
          <input type="number" className="form-control" id="price" name='price' min={0} placeholder="Precio del producto" onChange={changed}></input>
        </div>

        <div className="mb-3 d-flex align-items-center">
          <label htmlFor="crearcategoria" className="form-label me-2">Crear nueva Categoría</label>
          <i className="bi bi-plus-circle" data-toggle="modal" data-target="#exampleModal" style={{ cursor: 'pointer' }}></i>
        </div>

        <div className="mb-3">
          <label htmlFor="categoriaProducto" className="form-label">Categoría del Producto</label>
          <select className="form-select" id="category" name='category' required value={selectedOption} onChange={eventosDistintos}>
            <option value="Seleccione una categoría" >Seleccione una categoría</option>
            {categoria.map((categorias) => (
              <option key={categorias._id} value={categorias.name}>{categorias.name}</option>
            ))}
          </select>
          <input type="hidden" name="categoria" className="form-control" placeholder="Categoria" hidden value={selectedOption} onChange={changed} />
        </div>

        <div className="mb-3">
          <label htmlFor="imagenProducto" className="form-label">Imagen del Producto</label>
          <input type="file" name='files' className="form-control" id="files" multiple onChange={changed}></input>
        </div>
        <button type="submit" className="btn btn-primary">Subir Producto</button>
      </form>

      <br></br>

      {/* abrir modal de creación de categoría */}

      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel" >Crear Categoria</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-6">
                  <label htmlFor="nombreCategoria" className="form-label">Nombre de la Categoría</label>
                  <input type="text" className="form-control" id="nombreCategoria" required placeholder="Ingrese el nombre de la categoría"></input>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
              <button type="submit" className="btn btn-primary">Crear Categoría</button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};
