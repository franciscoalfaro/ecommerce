import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom' // Agrega Link
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'

export const ProductSelect = () => {
  const { auth } = useAuth({})
  const params = useParams()
  const [productSelect, setProductSelect] = useState([])
  console.log(productSelect)


  useEffect(() => {
    productSelected()

  }, [])


  // Inicializar los modales después de que el componente se monta
  const modalElems = document.querySelectorAll('.thumbnail-clickable')
  modalElems.forEach((elem) => {
    elem.addEventListener('click', function () {
      const targetModal = elem.getAttribute('data-bs-target')
      const modal = new bootstrap.Modal(document.querySelector(targetModal))
      modal.show()

      // Obtener el índice de la imagen correspondiente
      const imageIndex = elem.getAttribute('data-bs-image')
      // Actualizar la imagen en el modal
      const modalImg = document.querySelector(targetModal + ' img')
      modalImg.src = Global.url + 'product/media/' + productSelect[0]?.images?.[imageIndex]?.filename
    })
  })

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
      console.log(data)
      if (data.status === 'success') {
        setProductSelect([data.product]) // Cambiar a data.product

      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <main>
        <section className="py-4 bg-light">
          <div className="container">
            {productSelect.map((product, index) => (
              <div className="row" key={index}>
                <div className="col-md-6">
                  <div id={`mainImage${index}`} className="thumbnail-clickable" data-bs-toggle="modal" data-bs-target={`#imageModal${index}`} data-bs-image="0">
                    <img src={Global.url + 'product/media/' + product.images?.[0]?.filename} className="img-fluid" alt={`Imagen 1 del producto ${index + 1}`}></img>
                  </div>
                </div>
                <div className="col-md-6">
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                  <p>Stock: {product.stock?.quantity}</p>
                  <p>categoria: {product.categoty?.name}</p>
                  <p>Precio: ${product.price}</p>
                  <button className="btn btn-primary">Agregar al Carro</button>
                </div>

                <div className="row mt-5">
                  {product.images?.map((image, imageIndex) => (
                    <div className="col-md-4" key={imageIndex}>
                      <div className="thumbnail-clickable" data-bs-toggle="modal" data-bs-target={`#imageModal${index}`} data-bs-image={imageIndex}>
                        <img src={Global.url + 'product/media/' + image.filename} className="img-fluid img-thumbnail" alt={`Imagen ${imageIndex + 2} del producto ${index + 1}`}></img>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>


          {productSelect.map((product, index) => (
            <div className="modal fade" id={`imageModal${index}`} tabIndex="-1" aria-labelledby={`imageModalLabel${index}`} aria-hidden="true" key={index}>
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-body">
                    <img src={Global.url + 'product/media/' + product.images?.[0]?.filename} className="img-fluid" alt={`Imagen 1 del producto ${index + 1}`}></img>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </section>
      </main>
    </>
  )
}
