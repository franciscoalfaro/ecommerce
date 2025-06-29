import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import useModalClose from '../../hooks/useModalClose';

export const ProductAdmin = () => {
  const { auth } = useAuth({});
  const { form, changed } = useForm({})
  const closeModal = useModalClose();

  const [categoria, setCategorias] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedOption, setSelectedOption] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const opcioneDelselect = (event) => {
    setSelectedOption(event.target.value);
  };

  const eventosDistintos = (event) => {
    opcioneDelselect(event);
    changed(event);
  };

  useEffect(() => {
    listCategoryAdmin()
  }, [])

  const crearProducto = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectedOption === "") {
      if (window.Swal) {
        Swal.fire({ 
          position: "bottom-end", 
          title: "Por favor selecciona una categoría válida", 
          showConfirmButton: false, 
          timer: 1500,
          icon: 'warning'
        });
      }
      setIsLoading(false);
      return;
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
        if (window.Swal) {
          Swal.fire({ 
            position: "bottom-end", 
            title: "Producto creado correctamente", 
            showConfirmButton: false, 
            timer: 1000,
            icon: 'success'
          });
        }
      } 
      
      if (data.status === "error") {
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
          
          if (window.Swal) {
            Swal.fire({ 
              position: "bottom-end", 
              title: "Producto creado con imágenes correctamente", 
              showConfirmButton: false, 
              timer: 1000,
              icon: 'success'
            });
          }
        } else {
          if (window.Swal) {
            Swal.fire({ 
              position: "bottom-end", 
              title: uploadData.message, 
              showConfirmButton: false, 
              timer: 1000,
              icon: 'error'
            });
          }
        }
      } else {
        const myForm = document.querySelector("#product");
        myForm.reset();
        setSelectedOption('');
      }
    } catch (error) {
      console.error(error);
      if (window.Swal) {
        Swal.fire({ 
          position: "bottom-end", 
          title: "Error al crear el producto", 
          showConfirmButton: false, 
          timer: 1000,
          icon: 'error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

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
    try {
      let newCat = form;

      const request = await fetch(Global.url + "category/newcategory", {
        method: "POST",
        body: JSON.stringify(newCat),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await request.json()
      
      if (data.status === 'success') {
        listCategoryAdmin()
        const myForm = document.querySelector("#modalForm");
        myForm.reset();
        closeModal()
        
        if (window.Swal) {
          Swal.fire({ 
            position: "bottom-end", 
            title: "Categoría creada correctamente", 
            showConfirmButton: false, 
            timer: 1000,
            icon: 'success'
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Producto</h1>
          <p className="text-gray-600">Agrega un nuevo producto a tu inventario</p>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form id='product' onSubmit={crearProducto} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name='name' 
                    required 
                    className="input-field"
                    placeholder="Ingrese el nombre del producto"
                    onChange={changed}
                  />
                </div>

                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                    Marca *
                  </label>
                  <input 
                    type="text" 
                    id="brand" 
                    name='brand' 
                    required 
                    className="input-field"
                    placeholder="Marca del producto"
                    onChange={changed}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea 
                  id="description" 
                  rows="4" 
                  name='description' 
                  required 
                  className="input-field"
                  placeholder="Descripción detallada del producto"
                  onChange={changed}
                ></textarea>
              </div>

              <div>
                <label htmlFor="additionalInformation" className="block text-sm font-medium text-gray-700 mb-2">
                  Información Adicional
                </label>
                <textarea 
                  id="additionalInformation" 
                  rows="3" 
                  name='additionalInformation' 
                  className="input-field"
                  placeholder="Información adicional del producto"
                  onChange={changed}
                ></textarea>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                    Talla/Tamaño
                  </label>
                  <input 
                    type="text" 
                    id="size" 
                    name='size' 
                    className="input-field"
                    placeholder="Ej: M, L, XL"
                    onChange={changed}
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Género *
                  </label>
                  <select name="gender" required className="input-field" onChange={changed}>
                    <option value="">Selecciona género</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Nino">Niño</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio *
                  </label>
                  <input 
                    type="number" 
                    id="price" 
                    name='price' 
                    min={0} 
                    required
                    className="input-field"
                    placeholder="0"
                    onChange={changed}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría del Producto *
                  </label>
                  <div className="flex space-x-2">
                    <select 
                      id="category" 
                      name='category' 
                      required 
                      value={selectedOption} 
                      onChange={eventosDistintos}
                      className="input-field flex-1"
                    >
                      <option value="">Seleccione una categoría</option>
                      {categoria.map((categorias) => (
                        <option key={categorias._id} value={categorias.name}>
                          {categorias.name}
                        </option>
                      ))}
                    </select>
                    <button 
                      type="button"
                      className="btn-secondary"
                      data-toggle="modal" 
                      data-target="#exampleModal"
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  <input 
                    type="hidden" 
                    name="categoria" 
                    value={selectedOption} 
                    onChange={changed} 
                  />
                </div>

                <div>
                  <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
                    Imágenes del Producto
                  </label>
                  <input 
                    type="file" 
                    name='files' 
                    id="files" 
                    multiple 
                    accept="image/*"
                    className="input-field"
                    onChange={changed}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puedes seleccionar múltiples imágenes
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner"></div>
                    <span className="text-gray-600">Creando producto...</span>
                  </div>
                ) : (
                  <button type="submit" className="btn-primary">
                    <i className="bi bi-plus-circle mr-2"></i>
                    Crear Producto
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Category Modal */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModal" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModal">Nueva Categoría</h1>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form id='modalForm' onSubmit={CreateCategory}>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">Nombre de la categoría:</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name='name' 
                      id="name" 
                      required
                      placeholder="Ej: Electrónicos, Ropa, etc."
                      onChange={changed}
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="submit" className="btn btn-primary">Crear Categoría</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};