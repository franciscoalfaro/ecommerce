import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Global } from '../../../helpers/Global'
import useCart from '../../../hooks/useCart'

export const Nav = () => {
  const [categorys, setCategorys] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navegar = useNavigate();
  const { totalItems } = useCart();

  const buscador = (e) => {
    e.preventDefault()
    const miBusqueda = searchTerm.trim()
    
    if (miBusqueda === '') {
      if (window.Swal) {
        Swal.fire({
          icon: 'warning',
          title: 'Campo vacío',
          text: 'Por favor ingresa un término de búsqueda',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
          background: '#fff3cd',
          color: '#856404'
        });
      }
      return;
    }
    
    // Limpiar el campo de búsqueda y cerrar modal
    setSearchTerm('');
    setIsSearchModalOpen(false);
    setIsMenuOpen(false);
    
    navegar("/auth/search/" + miBusqueda, { replace: true })
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const clearSearch = () => {
    setSearchTerm('');
  }

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
    // Focus en el input después de que se abra el modal
    setTimeout(() => {
      const searchInput = document.getElementById('modal-search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchTerm('');
  }

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeSearchModal();
      }
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    listCategorys()
  }, [])

  const listCategorys = async () => {
    try {
      const request = await fetch(Global.url + 'category/listcategorys', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await request.json()

      if (data.status === 'success') {
        setCategorys(data.categorys || [])
      } else {
        console.log('Error al cargar categorías:', data.message)
        setCategorys([])
      }
    } catch (error) {
      console.log('Error de red al cargar categorías:', error.message)
      setCategorys([])
    }
  }

  return (
    <>
      <nav className="bg-white shadow-soft border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gradient">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <i className="bi bi-shop text-white text-lg"></i>
                </div>
                <span>TuTienda</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/" className="navbar-link">
                <i className="bi bi-house-door mr-2"></i>
                Inicio
              </NavLink>
              <NavLink to="/auth/products" className="navbar-link">
                <i className="bi bi-grid-3x3-gap mr-2"></i>
                Productos
              </NavLink>
              
              {/* Categories Dropdown */}
              <div className="relative">
                <button 
                  className="navbar-link flex items-center"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <i className="bi bi-tags mr-2"></i>
                  Categorías
                  <i className="bi bi-chevron-down ml-1 text-xs"></i>
                </button>
                
                {isCategoriesOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-large border border-gray-100 z-50"
                    onMouseEnter={() => setIsCategoriesOpen(true)}
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                  >
                    <div className="py-2">
                      {categorys.length > 0 ? (
                        categorys.map(category => (
                          <Link 
                            key={category._id} 
                            to={`/auth/categorys/${category._id}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setIsCategoriesOpen(false)}
                          >
                            {category.name}
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 text-sm">
                          No hay categorías disponibles
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <NavLink to="/auth/offers" className="navbar-link">
                <i className="bi bi-percent mr-2"></i>
                Ofertas
              </NavLink>
            </div>

            {/* Search Button */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8 justify-center">
              <button 
                onClick={openSearchModal}
                className="w-full max-w-md bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 px-4 rounded-xl transition-all duration-200 flex items-center space-x-3 group"
              >
                <i className="bi bi-search text-gray-400 group-hover:text-gray-600"></i>
                <span className="text-left flex-1">Buscar productos...</span>
                <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-400">
                  <kbd className="px-2 py-1 bg-white rounded border border-gray-300">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-white rounded border border-gray-300">K</kbd>
                </div>
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button Mobile */}
              <button 
                onClick={openSearchModal}
                className="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 hover:bg-primary-50 rounded-lg"
              >
                <i className="bi bi-search text-xl"></i>
              </button>

              {/* Enhanced User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                    <i className="bi bi-person text-white text-sm"></i>
                  </div>
                  <i className="bi bi-chevron-down text-xs"></i>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-large border border-gray-100 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">Mi cuenta</p>
                        <p className="text-xs text-gray-500">Gestiona tu perfil y pedidos</p>
                      </div>
                      <Link 
                        to="/auth/perfil" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="bi bi-person mr-3"></i>
                        Mi Perfil
                      </Link>
                      <Link 
                        to="/auth/order" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="bi bi-box-seam mr-3"></i>
                        Mis Compras
                      </Link>
                      <hr className="my-2" />
                      <Link 
                        to="/auth/logout" 
                        className="flex items-center px-4 py-2 text-danger-600 hover:bg-danger-50 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="bi bi-box-arrow-right mr-3"></i>
                        Cerrar Sesión
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Cart */}
              <Link to="/auth/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 hover:bg-primary-50 rounded-lg">
                <i className="bi bi-bag text-xl"></i>
                {totalItems > 0 && (
                  <span className="cart-counter">{totalItems}</span>
                )}
              </Link>

              {/* Tracking */}
              <Link to="/auth/seguimiento" className="hidden sm:flex items-center navbar-link">
                <i className="bi bi-truck mr-2"></i>
                Seguimiento
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 hover:bg-primary-50 rounded-lg"
              >
                <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'} text-xl`}></i>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 animate-slide-up bg-white">
              <div className="flex flex-col space-y-3">
                <NavLink to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-house-door mr-2"></i>
                  Inicio
                </NavLink>
                <NavLink to="/auth/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-grid-3x3-gap mr-2"></i>
                  Productos
                </NavLink>
                
                {/* Mobile Categories */}
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <i className="bi bi-tags mr-2"></i>
                    Categorías:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categorys.length > 0 ? (
                      categorys.map(category => (
                        <Link 
                          key={category._id} 
                          to={`/auth/categorys/${category._id}`}
                          className="block py-2 px-3 text-sm text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm col-span-2">No hay categorías</div>
                    )}
                  </div>
                </div>
                
                <NavLink to="/auth/offers" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-percent mr-2"></i>
                  Ofertas
                </NavLink>
                <NavLink to="/auth/perfil" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-person mr-2"></i>
                  Perfil
                </NavLink>
                <NavLink to="/auth/order" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-box-seam mr-2"></i>
                  Mis Compras
                </NavLink>
                <NavLink to="/auth/seguimiento" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-truck mr-2"></i>
                  Seguimiento
                </NavLink>
                
                {/* Mobile Logout */}
                <div className="pt-3 border-t border-gray-100">
                  <Link 
                    to="/auth/logout" 
                    className="flex items-center px-4 py-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="bi bi-box-arrow-right mr-2"></i>
                    Cerrar Sesión
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeSearchModal}
          ></div>
          
          {/* Modal */}
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <i className="bi bi-search mr-2"></i>
                    Buscar productos
                  </h3>
                  <button 
                    onClick={closeSearchModal}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <i className="bi bi-x-lg text-xl"></i>
                  </button>
                </div>
              </div>

              {/* Search Form */}
              <div className="px-6 py-6">
                <form onSubmit={buscador}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="bi bi-search text-gray-400 text-xl"></i>
                    </div>
                    <input
                      id="modal-search-input"
                      type="search"
                      placeholder="¿Qué estás buscando hoy?"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      autoComplete="off"
                    />
                    
                    {/* Clear button */}
                    {searchTerm && (
                      <button 
                        type="button"
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-16 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <i className="bi bi-x-circle text-xl"></i>
                      </button>
                    )}
                    
                    {/* Search button */}
                    <button 
                      type="submit"
                      className={`absolute inset-y-0 right-0 mr-2 px-6 py-2 rounded-lg transition-all duration-300 ${
                        searchTerm 
                          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!searchTerm}
                    >
                      <i className="bi bi-arrow-right text-lg"></i>
                    </button>
                  </div>
                </form>

                {/* Search Tips */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="bi bi-lightbulb text-secondary-600 mr-2"></i>
                      Consejos de búsqueda
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Usa palabras clave específicas</li>
                      <li>• Prueba con nombres de marcas</li>
                      <li>• Busca por categorías</li>
                    </ul>
                  </div>
                  
                  <div className="bg-primary-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="bi bi-star text-primary-600 mr-2"></i>
                      Populares
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 cursor-pointer hover:bg-primary-100 transition-colors duration-200">
                        Electrónicos
                      </span>
                      <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 cursor-pointer hover:bg-primary-100 transition-colors duration-200">
                        Ropa
                      </span>
                      <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 cursor-pointer hover:bg-primary-100 transition-colors duration-200">
                        Hogar
                      </span>
                    </div>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Presiona <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">ESC</kbd> para cerrar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}