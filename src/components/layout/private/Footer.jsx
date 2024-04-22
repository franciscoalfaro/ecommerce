import React from 'react'

export const Footer = () => {
  return (
    <footer class="bg-light text-center p-4">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h5>Contacto</h5>
            <p>Dirección: Calle Falsa 123</p>
            <p>Teléfono: 123-456-7890</p>
            <p>Email: info@tutienda.com</p>
            <p><i class="bi bi-whatsapp">982202241</i></p>

          </div>
          <div class="col-md-4">
            <h5>Acerca de</h5>
            <p>Somos una tienda online dedicada a ofrecer productos de calidad a precios accesibles.</p>
          </div>
          <div class="col-md-4">
            <h5>Redes Sociales</h5>
            <a href="www.facebook.com"><i class="bi bi-facebook"></i></a>
            <a href="www.twitter.com"><i class="bi bi-twitter-x"></i></a>
            <a href="www.instagram.com"><i class="bi bi-instagram"></i></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
