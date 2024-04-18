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
    let newProduct = form
    console.log(newProduct)
    try {

      const request = await fetch(Global.url + "product/create/", {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      })
      const data = await request.json()

      if (data.status === "success") {
        Swal.fire({ position: "bottom-end", title: "producto creado", showConfirmButton: false, timer: 1000 });
        const myForm = document.querySelector("#product")
        myForm.reset()
        setSelectedOption('')

      } else {
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1000 });
      }

    } catch (error) {
      console.log('code', error)
    }

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
          <input type="file" className="form-control" id="imagenProducto" multiple></input>
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
