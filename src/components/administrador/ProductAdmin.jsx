import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import useModalClose from '../../hooks/useModalClose';

export const ProductAdmin = () => {
  const { auth } = useAuth({});
  const { form, changed } = useForm({})
  const closeModal = useModalClose();

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


  useEffect(() => {
    listCategoryAdmin()
  }, [])


  const crearProducto = async (e) => {
    e.preventDefault();

    if (selectedOption === "") {
      // Mostrar mensaje de error o realizar alguna acción
      Swal.fire({ position: "bottom-end", title: "Por favor selecciona una categoría válida", showConfirmButton: false, timer: 1500 });
      return; // Detener el proceso de creación del producto
    }

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
      } if (data.status === "error") {
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

      } else {
        setCategorias([])
        console.log('code', data.message)
      }
    } catch (error) {
      console.log('code', error)
    }
  }


  const CreateCategory = async (e) => {
    e.preventDefault()
    console.log('aqui')
    try {
      let newCat = form;
      console.log(form)

      const request = await fetch(Global.url + "category/newcategory", {
        method: "POST",
        body: JSON.stringify(newCat),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await request.json()
      console.log(data)
      if (data.status === 'success') {
        listCategoryAdmin()
        const myForm = document.querySelector("#modalForm");
        myForm.reset();
        closeModal()
      }

    } catch (error) {

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
          <label htmlFor="additionalInformation" className="form-label">Informacion Adicional</label>
          <textarea className="form-control" id="additionalInformation" rows="3" name='additionalInformation' placeholder="Informacion Adicional" required onChange={changed}></textarea>
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
          <select className="form-control" name="gender" required onChange={changed}>
            <option value="">Selecciona opcion</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Unisex">Unisex</option>
            <option value="Nino">Nino</option>
          </select>
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
          <div className=''>
            <label htmlFor="categoriaProducto" className="form-label">Categoría del Producto</label>
            <select className="form-select" id="category" name='category' required value={selectedOption} onChange={eventosDistintos}>
              <option value="Seleccione una categoría" >Seleccione una categoría</option>
              {categoria.map((categorias) => (
                <option key={categorias._id} value={categorias.name}>{categorias.name}</option>
              ))}
            </select>
            <input type="hidden" name="categoria" className="form-control" placeholder="Categoria" hidden value={selectedOption} onChange={changed} />
          </div>
        </div>





        <div className="mb-3">
          <label htmlFor="imagenProducto" className="form-label">Imagen del Producto</label>
          <input type="file" name='files' className="form-control" id="files" multiple onChange={changed}></input>
        </div>
        <button type="submit" className="btn btn-primary">Subir Producto</button>
      </form>

      <br></br>

      {/* abrir modal de creación de categoría */}

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
              <form id='modalForm' onSubmit={CreateCategory}>
                <div className="mb-3">
                  <label htmlFor="name" className="col-form-label">Nombre:</label>
                  <input type="text" className="form-control" name='name' id="name" onChange={changed}></input>
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


    </div>
  );
};
