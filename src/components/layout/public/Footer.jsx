import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <i className="bi bi-shop text-white text-lg"></i>
              </div>
              <span className="text-2xl font-bold">TuTienda</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu destino de compras online favorito. Ofrecemos productos de calidad 
              con la mejor experiencia de compra y atención al cliente.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200">
                <i className="bi bi-facebook text-lg"></i>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200">
                <i className="bi bi-instagram text-lg"></i>
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200">
                <i className="bi bi-twitter-x text-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link to="/seguimiento" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Seguimiento
                </Link>
              </li>
              <li>
                <Link to="/terminoycondiciones" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Atención al cliente</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400 text-sm">
                <i className="bi bi-geo-alt mr-2 text-primary-400"></i>
                Calle Falsa 123, Santiago
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <i className="bi bi-telephone mr-2 text-primary-400"></i>
                +56 9 8220 2241
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <i className="bi bi-envelope mr-2 text-primary-400"></i>
                info@tutienda.com
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <i className="bi bi-whatsapp mr-2 text-success-400"></i>
                +56 9 8220 2241
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-gray-400 text-sm">
              Suscríbete para recibir ofertas exclusivas y novedades.
            </p>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="Tu email..." 
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 TuTienda. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/terminoycondiciones" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Términos de Servicio
              </Link>
              <Link to="/terminoycondiciones" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}