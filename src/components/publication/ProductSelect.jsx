import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom' // Agrega Link
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import { IntlProvider, FormattedNumber } from 'react-intl'
import useCart from '../../hooks/useCart'

export const ProductSelect = () => {
  const { auth } = useAuth({})
  const params = useParams()
  const [productSelect, setProductSelect] = useState([])
  const { addToCart, updateQuantity } = useCart()



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
      console.log('code', error)
    }
  }

  return (
    <>
      <main>
        <div className="container mt-4">
          {productSelect.map((product, index) => (
            <div className="row" key={index}>
              <div className="col-md-6">
                <img src={Global.url + 'product/media/' + product.images?.[0]?.filename} className="img-fluid" alt={`Imagen 1 del producto ${index + 1}`} data-bs-toggle="modal" data-bs-target={`#galleryModal${index}`} style={{ cursor: 'pointer' }}/>
                <div className="row mt-3">
                  {product.images?.map((image, imageIndex) => (
                    <div className="col-4" key={imageIndex}>
                      <img src={Global.url + 'product/media/' + image.filename} className="img-fluid gallery-item" alt={`Imagen ${imageIndex + 2} del producto ${index + 1}`} data-bs-target={`#galleryModal${index}`} data-bs-toggle="modal" style={{ cursor: 'pointer' }}/>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6">

                <div class="row">
                  <div class="col">
                    <h2>{product.name}</h2>
                    {product.discountPercentage > 0 ? (
                      <>
                        <p className="text-muted">Precio:
                          <IntlProvider locale="es" defaultLocale="es">
                            <ins>$<FormattedNumber value={product.offerprice} style="currency" currency="CLP"></FormattedNumber></ins>
                            <span className="discount"> -{product.discountPercentage}%</span>
                          </IntlProvider>
                        </p>

                        <p className="text-muted">Precio anterior:
                          <IntlProvider locale="es" defaultLocale="es">
                            <del>
                              $<FormattedNumber value={product.price} style="currency" currency="CLP" />
                            </del>
                          </IntlProvider>
                        </p>

                      </>
                    ) : (

                      <p className="text-muted">Precio:
                        <IntlProvider locale="es" defaultLocale="es">

                          $<FormattedNumber value={product.price} style="currency" currency="CLP" />
                        </IntlProvider>
                      </p>
                    )}
                    <p>{product.description}</p>
                    <p>Disponibilidad: {product.stock?.quantity ? product.stock.quantity : '0'} <span class="text-success">En Stock</span></p>
                    <p>Talla: {product.size}</p>
                    <p>categoria: {product.category?.name}</p>
                    <p>SKU: 123456</p>
                  </div>
                </div>

                {product.stock?.quantity > 0 ? (
                  <button className="btn btn-primary" onClick={() => addToCart(product)}><i className="bi bi-cart-fill"></i> Agregar al carrito</button>
                ) : (
                  <>
                    <button className="btn btn-primary" onClick={() => addToCart(product)} disabled><i className="bi bi-cart-fill"></i> Agregar al carrito</button>
                    <div>sin stock disponible</div>
                  </>
                )}

              </div>
              <div className='col-md-6'>
                <div class="row mt-3">
                  <div class="col">
                    <h5>Especificaciones:</h5>
                    <ul>
                      <li>Condición del producto: Nuevo</li>
                      <li>País de origen: Francia</li>
                      <li>Modelo: La Vie Est Belle</li>
                      <li>Fragancia: Floral</li>
                      <li>Género: Mujer</li>
                      <li>Incluye: La Vie Est Belle EDP 30ml</li>
                      <li>Posee vaporizador: Sí</li>
                      <li>Tipo de perfume: Eau de parfum</li>
                      <li>Contenido (ml): 30ml</li>
                      <li>Nombre comercial: Perfume Polo Blue EDT 30 ml GWP</li>
                      <li>Notas de fondo: Esencia de corazón de pachulí.</li>
                      <li>Formato belleza: Individual</li>
                      <li>Notas de salida: Iris pallida y acorde de delicadas delicias.</li>
                      <li>Temporada: Toda temporada</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='col-md-6'>
                <div className='row'>
                  <div class="col">
                    <h5>Información Adicional:</h5>
                    <p>Características de Perfume Mujer La Vie Est Belle EDP 30 ml LANCOME</p>
                    <p>Sumérgete en un mundo de sofisticación y elegancia con el perfume La Vie Est Belle de Lancome.</p>
                    <p>Con un volumen de 30 ml, este perfume es una declaración de la belleza de la vida, personificada por la actriz Julia Roberts y creado por tres líderes perfumistas de Francia.</p>
                    <p>Su aroma floral, compuesto por preciosos ingredientes, ofrece una experiencia sensorial única que resalta tu personalidad y realza tu esencia.</p>
                    <p>Las notas de salida del perfume La Vie Est Belle son de iris pallida y acorde de delicadas delicias, que aportan un toque de frescura y suavidad al perfume.</p>
                    <p>Seguido de esto, las notas de corazón están compuestas por concreto de iris pallida, flor de azahar del naranjo y jazmín sambac, que aportan un aroma floral y delicado, lleno de feminidad y elegancia.</p>
                    <p>Finalmente, las notas de fondo del perfume son de esencia de corazón de pachulí. Este ingrediente aporta un toque exótico y misterioso al perfume, dejando una estela duradera y cautivadora que te hará sentir segura y única.</p>
                    <p>La Vie Est Belle de Lancome es más que un perfume, es una declaración de belleza y libertad. Un perfume hecho para mujeres fuertes, únicas y contemporáneas.</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Modals */}
        {productSelect.map((product, index) => (
          <div className="modal fade" id={`galleryModal${index}`} tabIndex="-1" aria-labelledby={`galleryModalLabel${index}`} aria-hidden="true" key={index}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-body">
                  <div id={`galleryCarousel${index}`} className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {product.images?.map((image, imageIndex) => (
                        <div className={`carousel-item ${imageIndex === 0 ? 'active' : ''}`} key={imageIndex}>
                          <img src={Global.url + 'product/media/' + image.filename} className="d-block w-100" alt={`Imagen ${imageIndex + 1} del producto ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target={`#galleryCarousel${index}`} data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target={`#galleryCarousel${index}`} data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </>
  )
}
