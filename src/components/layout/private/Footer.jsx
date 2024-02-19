import React from 'react'

export const Footer = () => {
  return (
    <footer className="footer py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mb-4 mx-auto text-center">
            <a target="_blank" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
              Compañía
            </a>
            <a target="_blank" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
              Acerca de nosotros
            </a>
            <a target="_blank" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
              Team
            </a>
            <a target="_blank" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
              Nuestros Productos
            </a>
            <a target="_blank" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
              Blog
            </a>
            <a target="_blank" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
              Pricing
            </a>
          </div>
          <div className="col-lg-8 mx-auto text-center mb-4 mt-2">
            <a target="_blank" className="text-secondary me-xl-4 me-4">
              <span className="text-lg fab fa-dribbble"></span>
            </a>
            <a target="_blank" className="text-secondary me-xl-4 me-4">
              <span className="text-lg fab fa-twitter"></span>
            </a>
            <a target="_blank" className="text-secondary me-xl-4 me-4">
              <span className="text-lg fab fa-instagram"></span>
            </a>
            <a target="_blank" className="text-secondary me-xl-4 me-4">
              <span className="text-lg fab fa-pinterest"></span>
            </a>
            <a target="_blank" className="text-secondary me-xl-4 me-4">
              <span className="text-lg fab fa-github"></span>
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col-8 mx-auto text-center mt-1">
            <p className="mb-0 text-secondary">
              Copyright © <script>
                document.write(new Date().getFullYear())
              </script> www.comogasto.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
